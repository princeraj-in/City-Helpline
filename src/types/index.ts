export type Role = 'user' | 'contributor' | 'admin';

// Admin authorization is strictly handled via Firebase Custom Claims (request.auth.token.admin == true)
// Zero hardcoded emails in code
export function isSuperAdminEmail(_email?: string | null): boolean {
  return false;
}

export function hasAdminPrivileges(_user?: { email?: string | null } | null, profile?: { role?: Role; email?: string | null } | null): boolean {
  return profile?.role === 'admin';
}

export interface UserLocation {
  city: string;
  state?: string;
  district?: string;
  area?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  isLiveDetected: boolean;
  updatedAt: number;
}

export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';

export interface StudentVerificationData {
  collegeOrCoaching: string;
  rollOrIdNumber: string;
  courseOrExam: string;
  idProofUrl?: string;
  isLiveCameraCaptured?: boolean;
  submittedAt?: number;
  verifiedAt?: number;
  reviewedBy?: string;
  note?: string;
}

export interface PGVerificationData {
  electricityConsumerNumber?: string;
  ownerGovtIdType?: string;
  caretakerName?: string;
  caretakerPhone?: string;
  physicalInspectionDone?: boolean;
  subMeterRateDeclared?: number;
  submittedAt?: number;
  verifiedAt?: number;
  reviewedBy?: string;
  note?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: number;
  lastLogin?: any;
  updatedAt?: number;
  savedListings?: string[];
  photoURL?: string;
  themePreference?: 'light' | 'dark' | 'system';
  phone?: string;
  businessName?: string;
  businessType?: string;
  city?: string;
  address?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  banned?: boolean;
  isStudentVerified?: boolean;
  studentVerificationStatus?: VerificationStatus;
  studentVerificationData?: StudentVerificationData;
  isOwnerVerified?: boolean;
}

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  address: string;
  price: number;
  contact: string;
  images: string[];
  status: ListingStatus;
  featured: boolean;
  authorId: string;
  authorName: string;
  createdAt: number;
  averageRating?: number;
  reviewCount?: number;
  isVerifiedPG?: boolean;
  pgVerificationStatus?: VerificationStatus;
  pgVerificationData?: PGVerificationData;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export type MarketplaceCategory = 
  | 'Books & Notes' 
  | 'Study Furniture' 
  | 'Coolers & Fans' 
  | 'Cycles & Bikes' 
  | 'Electronics & Gadgets' 
  | 'Mattress & Bedding' 
  | 'Other Essentials';

export type ItemCondition = 'Like New' | 'Good Condition' | 'Fair / Usable';
export type ItemStatus = 'available' | 'sold';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: MarketplaceCategory;
  condition: ItemCondition;
  city: string;
  area?: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  whatsappNumber?: string;
  status: ItemStatus;
  createdAt: number;
  featured?: boolean;
  isStudentVerified?: boolean;
}

// Flatmate / Roommate Finder Types
export type RoomType = 'Private Room' | 'Shared Room' | 'Looking for 1RK/1BHK Flatmate' | 'Any';
export type StudyHabit = 'Night Owl (10 PM - 4 AM)' | 'Early Bird (5 AM - 11 PM)' | 'Flexible';
export type DietHabit = 'Strict Vegetarian' | 'Non-Vegetarian' | 'No Preference';

export interface RoommateHabits {
  studyTime: StudyHabit;
  dietary: DietHabit;
  cleanliness: 'High / Very Neat' | 'Moderate / Casual';
  smokingDrinking: 'Strict No' | 'No Smoking in Room';
}

export interface RoommateProfile {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone: string;
  whatsappNumber?: string;
  gender: 'male' | 'female' | 'other';
  city: string;
  locality: string;
  budgetMin: number;
  budgetMax: number;
  roomType: RoomType;
  targetExam: string;
  habits: RoommateHabits;
  bio: string;
  moveInDate?: string;
  status: 'active' | 'found';
  createdAt: number;
  updatedAt?: number;
  photoURL?: string;
  isStudentVerified?: boolean;
}

// Emergency Contacts Types
export interface EmergencyContact {
  title: string;
  number: string;
  category: 'suicide_distress' | 'police' | 'hospital' | 'women_safety' | 'ambulance' | 'cyber';
  description: string;
  is24x7?: boolean;
  priority?: number;
}

export interface CityEmergencyInfo {
  city: string;
  state: string;
  studentDistressHelpline?: EmergencyContact;
  localContacts: EmergencyContact[];
  policeControl: EmergencyContact;
  primaryHospital: EmergencyContact;
  womenHelpline: EmergencyContact;
}

export interface UserSosContact {
  name: string;
  relation: string;
  phone: string;
}

// In-App Chat Types
export interface ChatListingContext {
  id: string;
  title: string;
  price: number;
  category?: string;
  image?: string;
  city?: string;
}

export interface ConversationParticipant {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantData: Record<string, ConversationParticipant>;
  listingContext?: ChatListingContext;
  lastMessage?: string;
  lastMessageSenderId?: string;
  lastMessageTimestamp?: any;
  unreadCount?: Record<string, number>;
  createdAt?: any;
  updatedAt?: any;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: any;
  read: boolean;
}


