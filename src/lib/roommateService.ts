import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import { RoommateProfile, RoommatePrivateContact } from '../types';

export const DEMO_ROOMMATES: RoommateProfile[] = [
  {
    id: 'roommate-demo-1',
    userId: 'demo-student-rohit',
    userName: 'Rohit K. (NEET Dropper)',
    userEmail: 'rohit.allen@student.in',
    userPhone: '9876543210',
    whatsappNumber: '9876543210',
    gender: 'male',
    city: 'Kota',
    locality: 'Landmark City, Kunhari',
    budgetMin: 3500,
    budgetMax: 5000,
    roomType: 'Shared Room',
    targetExam: 'NEET UG 2025 (Allen)',
    habits: {
      studyTime: 'Night Owl (10 PM - 4 AM)',
      dietary: 'Strict Vegetarian',
      cleanliness: 'High / Very Neat',
      smokingDrinking: 'Strict No'
    },
    bio: 'Preparing seriously for NEET 2025 at Allen Samyak. Already have a spacious 2-bed AC room with attached washroom in Landmark City. Looking for a sincere, quiet study partner to share rent & electricity 50-50.',
    moveInDate: 'Immediate',
    status: 'active',
    createdAt: Date.now() - 3600000 * 24 * 2
  },
  {
    id: 'roommate-demo-2',
    userId: 'demo-student-priya',
    userName: 'Priya Sharma (JEE 2025)',
    userEmail: 'priya.resonance@student.in',
    userPhone: '9876512345',
    whatsappNumber: '9876512345',
    gender: 'female',
    city: 'Kota',
    locality: 'Talwandi, Sector A',
    budgetMin: 4000,
    budgetMax: 6000,
    roomType: 'Looking for 1RK/1BHK Flatmate',
    targetExam: 'JEE Advanced (Resonance)',
    habits: {
      studyTime: 'Early Bird (5 AM - 11 PM)',
      dietary: 'Strict Vegetarian',
      cleanliness: 'High / Very Neat',
      smokingDrinking: 'Strict No'
    },
    bio: 'Need a focused female student roommate for a fully furnished 2BHK flat near Talwandi circle. High-speed Wi-Fi, RO water, and tiffin service available. Serious study atmosphere only.',
    moveInDate: 'Within 10 Days',
    status: 'active',
    createdAt: Date.now() - 3600000 * 24 * 4
  },
  {
    id: 'roommate-demo-3',
    userId: 'demo-student-aryan',
    userName: 'Aryan Gupta (UPSC Aspirant)',
    userEmail: 'aryan.upsc@student.in',
    userPhone: '9876598765',
    whatsappNumber: '9876598765',
    gender: 'male',
    city: 'New Delhi',
    locality: 'Old Rajinder Nagar',
    budgetMin: 6000,
    budgetMax: 9000,
    roomType: 'Private Room',
    targetExam: 'UPSC Civil Services 2026',
    habits: {
      studyTime: 'Night Owl (10 PM - 4 AM)',
      dietary: 'No Preference',
      cleanliness: 'Moderate / Casual',
      smokingDrinking: 'No Smoking in Room'
    },
    bio: 'Looking for 1 flatmate for a furnished 2BHK in ORN near Bada Bazar. Separate private bedroom with AC. Seeking someone disciplined for GS + Optional preparation discussions.',
    moveInDate: 'Immediate',
    status: 'active',
    createdAt: Date.now() - 3600000 * 24 * 5
  },
  {
    id: 'roommate-demo-4',
    userId: 'demo-student-vikram',
    userName: 'Vikram Singh (IIT-JEE)',
    userEmail: 'vikram.patna@student.in',
    userPhone: '9876554321',
    whatsappNumber: '9876554321',
    gender: 'male',
    city: 'Patna',
    locality: 'Boring Road (Near Anand Puri)',
    budgetMin: 3000,
    budgetMax: 4500,
    roomType: 'Shared Room',
    targetExam: 'JEE Main (Mentors Eduserv)',
    habits: {
      studyTime: 'Flexible',
      dietary: 'No Preference',
      cleanliness: 'Moderate / Casual',
      smokingDrinking: 'Strict No'
    },
    bio: 'Big room in a quiet residential colony with inverter backup and study desks. Need 1 roommate to split the ₹7,000 monthly total rent. Walking distance to Boring Road coaching hub.',
    moveInDate: 'Next Month 1st',
    status: 'active',
    createdAt: Date.now() - 3600000 * 24 * 7
  },
  {
    id: 'roommate-demo-5',
    userId: 'demo-student-mohit',
    userName: 'Mohit Meena (NEET Sikar)',
    userEmail: 'mohit.gurukripa@student.in',
    userPhone: '9876523456',
    whatsappNumber: '9876523456',
    gender: 'male',
    city: 'Sikar',
    locality: 'Piprali Road',
    budgetMin: 2500,
    budgetMax: 4000,
    roomType: 'Shared Room',
    targetExam: 'NEET 2025 (PCP / Gurukripa)',
    habits: {
      studyTime: 'Early Bird (5 AM - 11 PM)',
      dietary: 'Strict Vegetarian',
      cleanliness: 'High / Very Neat',
      smokingDrinking: 'Strict No'
    },
    bio: 'Spacious double bed room on Piprali Road. Clean bathroom, regular water supply, and peaceful study environment. Looking for a neat and non-disturbing roommate.',
    moveInDate: 'Immediate',
    status: 'active',
    createdAt: Date.now() - 3600000 * 24 * 10
  }
];

const LOCAL_STORAGE_KEY = 'studolink_local_roommate_profiles';
const OLD_LOCAL_STORAGE_KEY = 'city_helpline_local_roommate_profiles';

export async function getRoommateProfiles(city?: string): Promise<RoommateProfile[]> {
  try {
    const q = query(
      collection(db, 'roommate_profiles'),
      where('status', '==', 'active')
    );
    
    const snapshot = await Promise.race([
      getDocs(q),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Roommates fetch timeout')), 4000))
    ]);

    const firestoreProfiles = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as RoommateProfile));

    // Combine with demo data
    const existingIds = new Set(firestoreProfiles.map(p => p.id));
    const demoFiltered = DEMO_ROOMMATES.filter(d => !existingIds.has(d.id));
    const all = [...firestoreProfiles, ...demoFiltered];

    // Cache locally
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      // Ignore storage quota
    }

    if (city && city.trim() !== '') {
      const target = city.toLowerCase().trim();
      return all.filter(p => {
        const pCity = p.city.toLowerCase().trim();
        return pCity === target || pCity.includes(target) || target.includes(pCity);
      });
    }

    return all;
  } catch (err) {
    console.warn('Notice: Loading cached/demo roommate profiles:', err);
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(OLD_LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed: RoommateProfile[] = JSON.parse(cached);
        if (city && city.trim() !== '') {
          const target = city.toLowerCase().trim();
          return parsed.filter(p => p.city.toLowerCase().includes(target) || target.includes(p.city.toLowerCase()));
        }
        return parsed;
      }
    } catch (e) {
      // Fallback to static
    }

    if (city && city.trim() !== '') {
      const target = city.toLowerCase().trim();
      return DEMO_ROOMMATES.filter(p => p.city.toLowerCase().includes(target) || target.includes(p.city.toLowerCase()));
    }
    return DEMO_ROOMMATES;
  }
}

/**
 * Securely fetches private contact details for a roommate profile
 * Stored in isolated subcollection /roommate_profiles/{profileId}/private/contact
 * Only accessible to authenticated logged-in students or owner/admin.
 */
export async function getRoommateContactDetails(
  profileId: string, 
  userId?: string
): Promise<RoommatePrivateContact | null> {
  // Check if it's a demo profile
  const demo = DEMO_ROOMMATES.find(d => d.id === profileId || (userId && d.userId === userId));
  if (demo) {
    return {
      userId: demo.userId,
      userPhone: demo.userPhone || '',
      whatsappNumber: demo.whatsappNumber || demo.userPhone || '',
      userEmail: demo.userEmail || '',
      updatedAt: demo.createdAt,
    };
  }

  try {
    const contactRef = doc(db, 'roommate_profiles', profileId, 'private', 'contact');
    const snap = await getDoc(contactRef);
    if (snap.exists()) {
      return snap.data() as RoommatePrivateContact;
    }
  } catch (err) {
    console.warn('Could not fetch protected contact from Firestore subcollection:', err);
  }

  // Check local fallback
  if (userId) {
    try {
      const local = localStorage.getItem(`user_roommate_contact_${userId}`);
      if (local) {
        return JSON.parse(local);
      }
    } catch {}
  }

  return null;
}

export async function getUserRoommateProfile(userId: string): Promise<RoommateProfile | null> {
  if (!userId) return null;
  try {
    let publicProfile: RoommateProfile | null = null;
    let profileId = userId;

    const docRef = doc(db, 'roommate_profiles', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      publicProfile = { id: snap.id, ...snap.data() } as RoommateProfile;
    } else {
      // Check query by userId
      const q = query(collection(db, 'roommate_profiles'), where('userId', '==', userId));
      const querySnap = await getDocs(q);
      if (!querySnap.empty && querySnap.docs[0]) {
        const first = querySnap.docs[0];
        publicProfile = { id: first.id, ...first.data() } as RoommateProfile;
        profileId = first.id;
      }
    }

    if (publicProfile) {
      // Fetch private contact subcollection for owner
      const contact = await getRoommateContactDetails(profileId, userId);
      return {
        ...publicProfile,
        userPhone: contact?.userPhone || publicProfile.userPhone || '',
        whatsappNumber: contact?.whatsappNumber || publicProfile.whatsappNumber || '',
        userEmail: contact?.userEmail || publicProfile.userEmail || '',
      };
    }

    // Check local storage backup
    const local = localStorage.getItem(`user_roommate_profile_${userId}`);
    if (local) {
      return JSON.parse(local);
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch user roommate profile from Firestore:', err);
    const local = localStorage.getItem(`user_roommate_profile_${userId}`);
    return local ? JSON.parse(local) : null;
  }
}

export async function saveRoommateProfile(
  profileData: Omit<RoommateProfile, 'id' | 'createdAt'> & { id?: string; createdAt?: number }
): Promise<RoommateProfile> {
  const profileId = profileData.id || profileData.userId || `rm-${Date.now()}`;
  const now = Date.now();
  
  // 1. Separate public sanitized preferences from private contact information
  const rawPhone = (profileData.userPhone || '').trim();
  const rawWhatsApp = (profileData.whatsappNumber || rawPhone).trim();
  const rawEmail = (profileData.userEmail || '').trim();

  // Public document contains NO phone or WhatsApp numbers
  const publicProfile: RoommateProfile = {
    id: profileId,
    userId: profileData.userId,
    userName: profileData.userName,
    gender: profileData.gender,
    city: profileData.city,
    locality: profileData.locality,
    budgetMin: profileData.budgetMin,
    budgetMax: profileData.budgetMax,
    roomType: profileData.roomType,
    targetExam: profileData.targetExam,
    habits: profileData.habits,
    bio: profileData.bio,
    moveInDate: profileData.moveInDate,
    status: profileData.status,
    hasContactDetails: Boolean(rawPhone || rawWhatsApp),
    photoURL: profileData.photoURL,
    isStudentVerified: profileData.isStudentVerified,
    createdAt: profileData.createdAt || now,
    updatedAt: now,
  };

  try {
    // 2. Save public preferences to /roommate_profiles/{profileId}
    await setDoc(doc(db, 'roommate_profiles', profileId), publicProfile, { merge: true });

    // 3. Save sensitive contact data to protected /roommate_profiles/{profileId}/private/contact subcollection
    if (rawPhone || rawWhatsApp || rawEmail) {
      const privateContact: RoommatePrivateContact = {
        userId: profileData.userId,
        userPhone: rawPhone,
        whatsappNumber: rawWhatsApp,
        userEmail: rawEmail,
        updatedAt: now,
      };
      await setDoc(doc(db, 'roommate_profiles', profileId, 'private', 'contact'), privateContact, { merge: true });
      localStorage.setItem(`user_roommate_contact_${profileData.userId}`, JSON.stringify(privateContact));
    }
  } catch (err) {
    console.warn('Notice: Firestore save roommate profile warning, saved locally:', err);
  }

  // Combined profile for user's own session state
  const mergedProfile: RoommateProfile = {
    ...publicProfile,
    userPhone: rawPhone,
    whatsappNumber: rawWhatsApp,
    userEmail: rawEmail,
  };

  // Always save locally for instant retrieval
  try {
    localStorage.setItem(`user_roommate_profile_${profileData.userId}`, JSON.stringify(mergedProfile));
    
    // Update local cache list
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: RoommateProfile[] = cached ? JSON.parse(cached) : [...DEMO_ROOMMATES];
    const idx = list.findIndex(p => p.id === profileId || p.userId === profileData.userId);
    if (idx >= 0) {
      list[idx] = mergedProfile;
    } else {
      list.unshift(mergedProfile);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // Ignore storage issues
  }

  return mergedProfile;
}

export async function toggleRoommateStatus(profileId: string, userId: string, newStatus: 'active' | 'found'): Promise<void> {
  try {
    await setDoc(doc(db, 'roommate_profiles', profileId), { status: newStatus, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('Could not update roommate status in firestore:', err);
  }

  try {
    const localKey = `user_roommate_profile_${userId}`;
    const local = localStorage.getItem(localKey);
    if (local) {
      const obj = JSON.parse(local);
      obj.status = newStatus;
      obj.updatedAt = Date.now();
      localStorage.setItem(localKey, JSON.stringify(obj));
    }
  } catch (e) {
    // Ignore
  }
}

export async function deleteRoommateProfile(profileId: string, userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'roommate_profiles', profileId, 'private', 'contact')).catch(() => {});
    await deleteDoc(doc(db, 'roommate_profiles', profileId));
  } catch (err) {
    console.warn('Could not delete roommate profile from Firestore:', err);
  }

  try {
    localStorage.removeItem(`user_roommate_profile_${userId}`);
    localStorage.removeItem(`user_roommate_contact_${userId}`);
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const list: RoommateProfile[] = JSON.parse(cached);
      const filtered = list.filter(p => p.id !== profileId && p.userId !== userId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (e) {
    // Ignore
  }
}
