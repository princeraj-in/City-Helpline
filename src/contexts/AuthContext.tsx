import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasCustomClaimAdmin: boolean;
  logout: () => Promise<void>;
  updateLocalProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [hasCustomClaimAdmin, setHasCustomClaimAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const cachedProfile = localStorage.getItem('userProfile');
      if (!cachedProfile) return null;
      return JSON.parse(cachedProfile) as UserProfile;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Authoritatively driven by Firebase Auth Custom Claim (request.auth.token.admin == true)
  const isAdmin = hasCustomClaimAdmin;
  const isSuperAdmin = hasCustomClaimAdmin;

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    let unsubscribePrivateDetails: (() => void) | undefined;
    let unsubscribePrivateVerification: (() => void) | undefined;

    // Safety fallback: Never keep the app completely unmounted/blocked for more than 2.5 seconds
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      clearTimeout(safetyTimeout);
      setCurrentUser(user);
      if (user) {
        // Inspect Firebase Auth Custom Claims directly on user ID Token (forceRefresh ensures freshest state)
        let isAdminClaim = false;
        try {
          const tokenResult = await user.getIdTokenResult(true);
          isAdminClaim = tokenResult.claims.admin === true;
          setHasCustomClaimAdmin(isAdminClaim);
        } catch {
          setHasCustomClaimAdmin(false);
        }

        let publicProfileData: Partial<UserProfile> = {};
        let privateDetailsData: Partial<UserProfile> = {};
        let privateVerificationData: any = undefined;

        const mergeAndSetProfile = () => {
          if (!publicProfileData.uid) return;
          const merged: UserProfile = {
            ...publicProfileData,
            ...privateDetailsData,
            ...(privateVerificationData ? { studentVerificationData: privateVerificationData } : {}),
          } as UserProfile;

          setUserProfile(merged);
          localStorage.setItem('userProfile', JSON.stringify(merged));
        };

        const docRef = doc(db, 'users', user.uid);
        unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (data.banned) {
              signOut(auth);
              setUserProfile(null);
              setCurrentUser(null);
              localStorage.removeItem('userProfile');
              setLoading(false);
              return;
            } else {
              // Ensure profile role stays in sync with authoritative Custom Claim
              publicProfileData = (isAdminClaim && data.role !== 'admin')
                ? { ...data, role: 'admin' }
                : data;
              mergeAndSetProfile();
            }
          } else {
            // Auto-provision public user profile in Firestore if missing so user is never orphaned in Auth
            const fallbackFromEmail = user.email ? (user.email.split('@')[0] || 'User') : 'User';
            const cleanName = user.displayName || fallbackFromEmail;
            const cleanEmail = user.email || '';
            const initialProfile: UserProfile = {
              uid: user.uid,
              name: cleanName,
              email: cleanEmail,
              photoURL: user.photoURL || '',
              role: isAdminClaim ? 'admin' : 'user',
              banned: false,
              createdAt: Date.now() as any,
              lastLogin: Date.now() as any,
              updatedAt: Date.now(),
            };

            setDoc(docRef, {
              ...initialProfile,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            }, { merge: true }).catch((err) => {
              console.warn("Notice: auto-provisioning profile notice:", err);
            });

            publicProfileData = initialProfile;
            mergeAndSetProfile();
          }
          setLoading(false);
        }, (error) => {
          console.warn("Notice: user public profile sync in offline/delayed mode:", error);
          setLoading(false);
        });

        // Listen to protected private details subcollection doc (/users/{uid}/private/details)
        const privateDetailsRef = doc(db, 'users', user.uid, 'private', 'details');
        unsubscribePrivateDetails = onSnapshot(privateDetailsRef, (snap) => {
          if (snap.exists()) {
            privateDetailsData = snap.data() as Partial<UserProfile>;
            mergeAndSetProfile();
          }
        }, (pErr) => {
          console.warn("Notice: private details sync offline or not yet initialized:", pErr);
        });

        // Listen to protected private verification subcollection doc (/users/{uid}/private/verification)
        const privateVerificationRef = doc(db, 'users', user.uid, 'private', 'verification');
        unsubscribePrivateVerification = onSnapshot(privateVerificationRef, (snap) => {
          if (snap.exists()) {
            privateVerificationData = snap.data();
            mergeAndSetProfile();
          }
        }, (vErr) => {
          console.warn("Notice: private verification sync offline or not yet initialized:", vErr);
        });

      } else {
        setUserProfile(null);
        setHasCustomClaimAdmin(false);
        localStorage.removeItem('userProfile');
        setLoading(false);
        if (unsubscribeProfile) unsubscribeProfile();
        if (unsubscribePrivateDetails) unsubscribePrivateDetails();
        if (unsubscribePrivateVerification) unsubscribePrivateVerification();
      }
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribePrivateDetails) unsubscribePrivateDetails();
      if (unsubscribePrivateVerification) unsubscribePrivateVerification();
    };
  }, []);

  const updateLocalProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      if (!prev) return null;
      const safeUpdates = { ...updates };
      // Prevent local elevation to admin by non-superadmins
      if (safeUpdates.role === 'admin' && !isSuperAdmin) {
        delete safeUpdates.role;
      }
      const updated = { ...prev, ...safeUpdates };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, isAdmin, isSuperAdmin, hasCustomClaimAdmin, logout, updateLocalProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
