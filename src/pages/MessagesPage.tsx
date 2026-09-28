import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  collection, query, where, orderBy, onSnapshot, doc, getDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Conversation, ChatMessage } from '../types';
import { sendChatMessage, markConversationAsRead } from '../lib/chatService';
import { 
  MessageSquare, Send, ArrowLeft, Building2, ShoppingBag, 
  ExternalLink, Clock, Check, CheckCheck, Sparkles, User, Search, ShieldCheck 
} from 'lucide-react';
import { UserAvatar } from '../components/common/UserAvatar';
import { toast } from 'sonner';

export default function MessagesPage() {
  const { conversationId: routeConvId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { currentUser, userProfile, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(routeConvId || null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync route param with state
  useEffect(() => {
    if (routeConvId) {
      setSelectedConvId(routeConvId);
    }
  }, [routeConvId]);

  // Redirect to login if user not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [authLoading, currentUser, navigate]);

  // 1. Listen to all conversations where current user is a participant
  useEffect(() => {
    if (!currentUser?.uid) return;

    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const convList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as Conversation[];

        // Sort in memory by updatedAt or lastMessageTimestamp desc
        convList.sort((a, b) => {
          const getMs = (val: any) => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            if (typeof val.toMillis === 'function') return val.toMillis();
            if (val.seconds) return val.seconds * 1000;
            return 0;
          };
          const tA = getMs(a.updatedAt) || getMs(a.lastMessageTimestamp) || 0;
          const tB = getMs(b.updatedAt) || getMs(b.lastMessageTimestamp) || 0;
          return tB - tA;
        });

        setConversations(convList);
        setLoadingConversations(false);

        // If no conversation is selected and screen is desktop, select first conversation
        if (!selectedConvId && convList.length > 0 && window.innerWidth >= 1024 && convList[0]) {
          setSelectedConvId(convList[0].id);
        }
      }, (err) => {
        console.warn("Conversations listener error:", err);
        setLoadingConversations(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Error subscribing to conversations:", e);
      setLoadingConversations(false);
    }
  }, [currentUser?.uid]);

  // 2. Listen to real-time messages in the selected conversation
  useEffect(() => {
    if (!selectedConvId || !currentUser?.uid) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    markConversationAsRead(selectedConvId, currentUser.uid);

    try {
      const messagesCol = collection(db, 'conversations', selectedConvId, 'messages');
      const q = query(messagesCol, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as ChatMessage[];

        setMessages(msgs);
        setLoadingMessages(false);

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, (err) => {
        console.warn("Messages listener error:", err);
        setLoadingMessages(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Error subscribing to messages:", e);
      setLoadingMessages(false);
    }
  }, [selectedConvId, currentUser?.uid]);

  const activeConversation = conversations.find((c) => c.id === selectedConvId);

  // Recipient details (the other participant)
  const recipientUid = activeConversation?.participants.find((p) => p !== currentUser?.uid);
  const recipientData = recipientUid && activeConversation?.participantData 
    ? activeConversation.participantData[recipientUid] 
    : null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedConvId || !currentUser || !recipientUid) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      await sendChatMessage(
        selectedConvId,
        messageText,
        {
          uid: currentUser.uid,
          name: userProfile?.name || currentUser.displayName || 'User',
        },
        recipientUid
      );
    } catch (err: any) {
      console.error("Failed to send message:", err);
      toast.error("Message could not be sent. Please check connection.");
      setInputText(messageText);
    }
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  const formatMessageTime = (ts: any) => {
    if (!ts) return '';
    try {
      let date: Date;
      if (typeof ts === 'number') date = new Date(ts);
      else if (typeof ts.toDate === 'function') date = ts.toDate();
      else if (ts.seconds) date = new Date(ts.seconds * 1000);
      else date = new Date(ts);

      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const otherUid = c.participants.find((p) => p !== currentUser?.uid);
    const otherUser = otherUid && c.participantData ? c.participantData[otherUid] : null;
    const nameMatch = otherUser?.name?.toLowerCase().includes(q) || false;
    const listingMatch = c.listingContext?.title?.toLowerCase().includes(q) || false;
    const lastMsgMatch = c.lastMessage?.toLowerCase().includes(q) || false;
    return nameMatch || listingMatch || lastMsgMatch;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070A11] text-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6">
        
        {/* Main Chat Container */}
        <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl flex">
          
          {/* ======================================================== */}
          {/* LEFT PANE: Conversation List */}
          {/* ======================================================== */}
          <div className={`w-full lg:w-96 flex flex-col border-r border-white/10 bg-[#0B0F1A]/80 shrink-0 ${
            selectedConvId ? 'hidden lg:flex' : 'flex'
          }`}>
            
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-[#00E5FF]/20 to-[#8A2BE2]/20 border border-[#00E5FF]/30 text-[#00E5FF]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-base font-extrabold text-white">Messages</h1>
                    <p className="text-[11px] text-gray-400">Student & Provider Inquiries</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-300">
                  {conversations.length}
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats or listings..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/50"
                />
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5">
              {loadingConversations ? (
                <div className="p-8 text-center text-gray-500 text-xs">
                  <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Syncing conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-gray-500">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">No chats yet</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    Browse PG, hostel, or marketplace listings to start a conversation with the owner.
                  </p>
                  <Link
                    to="/search"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-bold transition-all"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Browse Services
                  </Link>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const otherUid = conv.participants.find((p) => p !== currentUser?.uid);
                  const otherUser = otherUid && conv.participantData ? conv.participantData[otherUid] : null;
                  const isSelected = conv.id === selectedConvId;
                  const unread = conv.unreadCount?.[currentUser?.uid || ''] || 0;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConvId(conv.id);
                        navigate(`/messages/${conv.id}`);
                      }}
                      className={`w-full p-3.5 text-left flex items-start gap-3 transition-all relative ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#00E5FF]/15 via-white/[0.04] to-transparent border-l-4 border-[#00E5FF]' 
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <UserAvatar
                          photoURL={otherUser?.photoURL}
                          name={otherUser?.name || 'User'}
                          email={otherUser?.email}
                          size="md"
                        />
                        {unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#0B0F1A] shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-white truncate">
                              {otherUser?.name || 'User'}
                            </span>
                            {otherUser?.role === 'admin' && (
                              <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                            )}
                          </div>
                          {unread > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white shrink-0">
                              {unread}
                            </span>
                          )}
                        </div>

                        {/* Listing context badge if inquiry is for specific item */}
                        {conv.listingContext && (
                          <div className="flex items-center gap-1 text-[10px] text-[#00E5FF] font-medium truncate mb-1">
                            <Building2 className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{conv.listingContext.title}</span>
                          </div>
                        )}

                        {/* Last message preview */}
                        <p className={`text-[11px] truncate ${
                          unread > 0 ? 'font-bold text-gray-200' : 'text-gray-400'
                        }`}>
                          {conv.lastMessage || 'Conversation started'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANE: Active Chat Conversation */}
          {/* ======================================================== */}
          <div className={`flex-1 flex flex-col bg-[#070A11]/60 ${
            !selectedConvId ? 'hidden lg:flex items-center justify-center' : 'flex'
          }`}>
            
            {activeConversation && recipientData ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3.5 sm:p-4 border-b border-white/10 bg-[#0B0F1A]/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Back button on mobile */}
                    <button
                      onClick={() => {
                        setSelectedConvId(null);
                        navigate('/messages');
                      }}
                      className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 active:scale-95 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <UserAvatar
                      photoURL={recipientData.photoURL}
                      name={recipientData.name}
                      email={recipientData.email}
                      size="sm"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">
                          {recipientData.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-white/10 text-gray-300">
                          {recipientData.role === 'admin' ? 'Support' : recipientData.role === 'contributor' ? 'Owner' : 'Student'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Related Listing Quick Link (if any) */}
                  {activeConversation.listingContext && (
                    <Link
                      to={`/listing/${activeConversation.listingContext.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] text-[#00E5FF] font-medium transition-all group shrink-0"
                    >
                      <span className="hidden sm:inline">View Listing</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>

                {/* Related Listing Snapshot Banner at top of chat */}
                {activeConversation.listingContext && (
                  <div className="px-4 py-2 bg-gradient-to-r from-[#00E5FF]/10 via-[#8A2BE2]/10 to-transparent border-b border-white/5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF]">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-300 font-medium truncate">
                        Inquiry regarding: <strong className="text-white">{activeConversation.listingContext.title}</strong>
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-[#00E5FF] shrink-0">
                      ₹{activeConversation.listingContext.price.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                )}

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {loadingMessages ? (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-gray-500">
                        <Sparkles className="w-6 h-6 text-[#00E5FF]" />
                      </div>
                      <p className="text-xs font-bold text-white mb-1">Start the conversation</p>
                      <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                        Ask about room availability, advance deposit, food quality, or schedule a physical visit.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === currentUser?.uid;

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] p-3.5 text-xs leading-relaxed break-words shadow-lg ${
                              isMe
                                ? 'bg-gradient-to-r from-[#00E5FF]/25 to-[#8A2BE2]/25 border border-[#00E5FF]/40 text-white rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                                : 'bg-white/[0.06] border border-white/10 text-gray-100 rounded-2xl rounded-bl-sm'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            
                            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-gray-400 font-mono">
                              <span>{formatMessageTime(msg.createdAt)}</span>
                              {isMe && (
                                <CheckCheck className="w-3 h-3 text-[#00E5FF]" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Reply Chips */}
                <div className="px-4 py-2 border-t border-white/5 bg-[#0B0F1A]/50 flex items-center gap-2 overflow-x-auto custom-scrollbar">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider shrink-0">Quick:</span>
                  {[
                    "Is this still available?",
                    "What is the security deposit?",
                    "Can I visit and inspect today?",
                    "Is food/mess included in rent?"
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickReply(chip)}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-white/[0.04] hover:bg-[#00E5FF]/15 border border-white/10 hover:border-[#00E5FF]/30 text-gray-300 hover:text-[#00E5FF] transition-all whitespace-nowrap active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-white/10 bg-[#0B0F1A]/90 backdrop-blur-md flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${recipientData.name}...`}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/60 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 text-black" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </>
            ) : (
              /* No Active Chat Selected Placeholder */
              <div className="text-center p-8 text-gray-400">
                <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-extrabold text-white mb-1">Select a Conversation</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Choose a chat from the left panel to message room providers or marketplace sellers in real-time.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
