import { 
  collection, doc, getDoc, setDoc, addDoc, updateDoc, 
  serverTimestamp, increment 
} from 'firebase/firestore';
import { db } from './firebase';
import { Conversation, ChatListingContext, UserProfile, Role } from '../types';

/**
 * Creates or gets an existing conversation between two users (e.g. Student and PG/Marketplace owner).
 */
export async function getOrCreateConversation(
  currentUser: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null },
  currentUserProfile: UserProfile | null,
  recipient: { uid: string; name: string; email?: string; photoURL?: string; role?: string },
  listingContext?: ChatListingContext
): Promise<string> {
  if (!currentUser?.uid || !recipient?.uid) {
    throw new Error('Both sender and recipient UIDs are required.');
  }

  // Consistent ID sorted by UIDs and optional listing ID
  const sortedUids = [currentUser.uid, recipient.uid].sort();
  const listingSuffix = listingContext?.id ? `_list_${listingContext.id}` : '_direct';
  const conversationId = `conv_${sortedUids[0]}_${sortedUids[1]}${listingSuffix}`;

  const convRef = doc(db, 'conversations', conversationId);
  const convSnap = await getDoc(convRef);

  const fallbackEmailName = currentUser.email ? (currentUser.email.split('@')[0] || 'User') : 'User';
  const myName: string = currentUserProfile?.name || currentUser.displayName || fallbackEmailName;
  const myEmail: string = currentUser.email || currentUserProfile?.email || '';
  const myPhoto: string = currentUser.photoURL || currentUserProfile?.photoURL || '';
  const myRole: Role = currentUserProfile?.role || 'user';

  if (!convSnap.exists()) {
    const newConv: Conversation = {
      id: conversationId,
      participants: [currentUser.uid, recipient.uid],
      participantData: {
        [currentUser.uid]: {
          uid: currentUser.uid,
          name: myName,
          email: myEmail,
          photoURL: myPhoto,
          role: myRole,
        },
        [recipient.uid]: {
          uid: recipient.uid,
          name: recipient.name || 'Provider',
          email: recipient.email || '',
          photoURL: recipient.photoURL || '',
          role: recipient.role || 'contributor',
        }
      },
      unreadCount: {
        [currentUser.uid]: 0,
        [recipient.uid]: 0,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (listingContext) {
      newConv.listingContext = listingContext;
    }

    await setDoc(convRef, newConv);
  } else {
    // If conversation exists, ensure participant details and listing context are up-to-date
    const existing = convSnap.data() as Conversation;
    const updatePayload: any = {
      updatedAt: serverTimestamp(),
    };
    if (listingContext && !existing.listingContext) {
      updatePayload.listingContext = listingContext;
    }
    // Update participant photos/names if changed
    updatePayload[`participantData.${currentUser.uid}.name`] = myName;
    updatePayload[`participantData.${currentUser.uid}.email`] = myEmail;
    if (myPhoto) updatePayload[`participantData.${currentUser.uid}.photoURL`] = myPhoto;

    await updateDoc(convRef, updatePayload);
  }

  return conversationId;
}

/**
 * Sends a real-time message inside a conversation.
 */
export async function sendChatMessage(
  conversationId: string,
  text: string,
  sender: { uid: string; displayName?: string | null; name?: string },
  recipientUid: string
) {
  const cleanText = text.trim();
  if (!cleanText) return;

  const convRef = doc(db, 'conversations', conversationId);
  const messagesCol = collection(convRef, 'messages');

  const senderName = sender.name || sender.displayName || 'User';

  // 1. Add message document
  await addDoc(messagesCol, {
    conversationId,
    senderId: sender.uid,
    senderName,
    text: cleanText,
    createdAt: serverTimestamp(),
    read: false,
  });

  // 2. Update conversation meta with last message and increment recipient unread count
  await updateDoc(convRef, {
    lastMessage: cleanText,
    lastMessageSenderId: sender.uid,
    lastMessageTimestamp: serverTimestamp(),
    updatedAt: serverTimestamp(),
    [`unreadCount.${recipientUid}`]: increment(1),
  });
}

/**
 * Resets unread counter when a user opens the conversation.
 */
export async function markConversationAsRead(conversationId: string, currentUserId: string) {
  try {
    const convRef = doc(db, 'conversations', conversationId);
    await updateDoc(convRef, {
      [`unreadCount.${currentUserId}`]: 0,
    });
  } catch (err) {
    console.warn("Could not reset unread count:", err);
  }
}
