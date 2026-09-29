import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import { MarketplaceItem, MarketplacePrivateContact } from '../types';

/**
 * Securely fetches private contact details for a marketplace item
 * Stored in isolated subcollection /marketplace_items/{itemId}/private/contact
 * Only accessible to authenticated logged-in students or owner/admin.
 */
export async function getMarketplaceContactDetails(
  itemId: string,
  sellerId?: string
): Promise<MarketplacePrivateContact | null> {
  try {
    const contactRef = doc(db, 'marketplace_items', itemId, 'private', 'contact');
    const snap = await getDoc(contactRef);
    if (snap.exists()) {
      return snap.data() as MarketplacePrivateContact;
    }
  } catch (err) {
    console.warn('Could not fetch protected marketplace contact from Firestore subcollection:', err);
  }

  // Check local fallback for item creator's session
  if (sellerId) {
    try {
      const local = localStorage.getItem(`user_marketplace_contact_${itemId}`);
      if (local) {
        return JSON.parse(local);
      }
    } catch {}
  }

  return null;
}

export interface CreateMarketplaceItemInput {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: MarketplaceItem['category'];
  condition: MarketplaceItem['condition'];
  city: string;
  area?: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  whatsappNumber?: string;
  sellerEmail?: string;
  contactPreference?: 'in_app_chat' | 'phone_whatsapp';
  allowWhatsApp?: boolean;
  allowDirectCall?: boolean;
  isStudentVerified?: boolean;
}

/**
 * Creates a marketplace listing separating public catalog info from sensitive seller contact data
 */
export async function createMarketplaceListing(
  input: CreateMarketplaceItemInput
): Promise<{ id: string; item: MarketplaceItem }> {
  const now = Date.now();
  const itemId = `mp-${now}-${Math.random().toString(36).substring(2, 7)}`;

  const rawPhone = (input.sellerPhone || '').trim();
  const rawWhatsApp = (input.whatsappNumber || rawPhone).trim();
  const rawEmail = (input.sellerEmail || '').trim();
  const preference = input.contactPreference || 'in_app_chat';
  const allowWhatsApp = preference === 'phone_whatsapp' ? Boolean(input.allowWhatsApp) : false;
  const allowDirectCall = preference === 'phone_whatsapp' ? Boolean(input.allowDirectCall) : false;

  // 1. Sanitized public document - Contains NO phone numbers unless explicit direct call consent was given
  const publicItem: MarketplaceItem = {
    id: itemId,
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price,
    ...(input.originalPrice ? { originalPrice: input.originalPrice } : {}),
    category: input.category,
    condition: input.condition,
    city: input.city,
    ...(input.area?.trim() ? { area: input.area.trim() } : {}),
    images: input.images,
    sellerId: input.sellerId,
    sellerName: input.sellerName,
    contactPreference: preference,
    allowWhatsApp,
    allowDirectCall,
    hasContactDetails: Boolean(rawPhone || rawWhatsApp),
    status: 'available',
    createdAt: now,
    featured: false,
    isStudentVerified: !!input.isStudentVerified,
  };

  try {
    // 2. Write public listing to /marketplace_items/{itemId}
    await setDoc(doc(db, 'marketplace_items', itemId), publicItem, { merge: true });

    // 3. Write sensitive contact details to protected subcollection /marketplace_items/{itemId}/private/contact
    if (rawPhone || rawWhatsApp || rawEmail) {
      const privateContact: MarketplacePrivateContact = {
        sellerId: input.sellerId,
        sellerPhone: rawPhone,
        whatsappNumber: rawWhatsApp,
        sellerEmail: rawEmail,
        allowWhatsApp,
        allowDirectCall,
        updatedAt: now,
      };

      await setDoc(doc(db, 'marketplace_items', itemId, 'private', 'contact'), privateContact, { merge: true });
      localStorage.setItem(`user_marketplace_contact_${itemId}`, JSON.stringify(privateContact));
    }
  } catch (err) {
    console.warn('Notice: Firestore save marketplace item warning:', err);
  }

  return { id: itemId, item: publicItem };
}
