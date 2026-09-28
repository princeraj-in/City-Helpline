import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Listing, MarketplaceItem } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, LogOut, Settings, Building2, MapPin, 
  Star, ShoppingBag, Calculator, 
  ShieldCheck, ArrowRight, Scale, AlertTriangle, FileText,
  Clock, CheckCircle2, PlusCircle, Sparkles, XCircle, Eye
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { useLocationContext } from '../contexts/LocationContext';
import { ProfileRoommateSection } from '../components/profile/ProfileRoommateSection';
import { ProfileFreeNotesSection } from '../components/profile/ProfileFreeNotesSection';
import { ProfileEmergencySection } from '../components/profile/ProfileEmergencySection';
import { UserAvatar } from '../components/common/UserAvatar';
import { VerifiedStudentBadge } from '../components/common/TrustBadge';
import { StudentVerificationModal } from '../components/profile/StudentVerificationModal';

export default function Profile() {
  const { currentUser, userProfile, logout } = useAuth();
  const { userLocation, openLocationModal } = useLocationContext();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [myMarketplaceItems, setMyMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        // 1. Fetch My Listings (Safe fetch & client-side sort)
        try {
          const qMy = query(
            collection(db, 'listings'),
            where('authorId', '==', currentUser.uid)
          );
          const snapshotMy = await getDocs(qMy);
          const dataMy = snapshotMy.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
          dataMy.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setMyListings(dataMy);
        } catch (listingErr) {
          console.warn('Could not load user hosted listings:', listingErr);
        }

        // 2. Fetch My Marketplace Items
        try {
          const qMarket = query(
            collection(db, 'marketplace_items'),
            where('sellerId', '==', currentUser.uid)
          );
          const snapMarket = await getDocs(qMarket);
          const marketData = snapMarket.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketplaceItem));
          marketData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setMyMarketplaceItems(marketData);
        } catch (mErr) {
          console.warn('Could not load user marketplace items:', mErr);
        }

        // 3. Fetch Saved Listings
        if (userProfile?.savedListings && userProfile.savedListings.length > 0) {
          try {
            const savedDocs = await Promise.all(
              userProfile.savedListings.map(async (savedId) => {
                try {
                  const docSnap = await getDoc(doc(db, 'listings', savedId));
                  if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as Listing;
                    if (data.status === 'approved' || data.authorId === currentUser.uid) {
                      return data;
                    }
                  }
                } catch (e) {
                  // Ignore inaccessible or removed saved items
                }
                return null;
              })
            );
            setSavedListings(savedDocs.filter((l): l is Listing => l !== null));
          } catch (savedErr) {
            console.warn('Could not load saved bookmarks:', savedErr);
            setSavedListings([]);
          }
        } else {
          setSavedListings([]);
        }
      } catch (error) {
        console.warn('Notice: Non-critical profile data loading issue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, userProfile?.savedListings]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
        <GlassCard className="p-8 sm:p-10 text-center max-w-md w-full border border-white/10" intensity="low">
          <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4 text-[#00E5FF]">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Not Signed In</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Sign in to access your personal dashboard, saved accommodations, marketplace ads, and account settings.
          </p>
          <Link 
            to="/login" 
            className="block w-full py-3.5 bg-[#00E5FF] hover:bg-cyan-300 text-slate-950 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] active:scale-95"
          >
            Sign In / Register
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-24 md:mb-16">
      {/* Top Profile Header Hero */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <LiquidGlassCard className="p-6 sm:p-8 relative overflow-hidden" glowColor="rgba(0, 229, 255, 0.2)">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Identity Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              <UserAvatar
                photoURL={userProfile?.photoURL || currentUser?.photoURL}
                name={userProfile?.name || currentUser?.displayName}
                email={userProfile?.email || currentUser?.email}
                size="xl"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight truncate">
                    {userProfile?.name || 'Student User'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_10px_rgba(0,229,255,0.15)]">
                    {userProfile?.role === 'admin' ? 'Administrator' : userProfile?.role === 'contributor' ? 'Host / Contributor' : 'Student Aspirant'}
                  </span>
                  {userProfile?.isStudentVerified && (
                    <VerifiedStudentBadge size="md" />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-300 font-medium truncate mb-2">
                  {userProfile?.email || currentUser.email}
                </p>

                <div className="flex items-center gap-3 flex-wrap text-xs text-gray-400">
                  {/* Location badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span className="text-gray-200 font-medium">
                      {userLocation ? `${userLocation.city}${userLocation.state ? `, ${userLocation.state}` : ''}` : 'Kota'}
                    </span>
                    <button
                      type="button"
                      onClick={openLocationModal}
                      className="ml-1 text-[11px] font-bold text-[#00E5FF] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {userProfile?.phone && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-gray-300">
                      📞 {userProfile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Right */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 font-bold text-xs transition-all active:scale-95 shadow-sm"
              >
                <Settings className="w-4 h-4 text-[#00E5FF]" />
                <span>Account Settings</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>

      {/* Student Verification Trust Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#00E5FF]/10 via-[#8A2BE2]/10 to-[#00E5FF]/10 border border-[#00E5FF]/25 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8A2BE2]/20 border border-[#00E5FF]/30 text-[#00E5FF] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-white">
                {userProfile?.isStudentVerified ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-black">
                    <span>Official "Verified Student" Badge Active</span>
                  </span>
                ) : userProfile?.studentVerificationStatus === 'pending' ? (
                  <span className="text-amber-300 font-black">
                    Student ID Verification is Under Review
                  </span>
                ) : (
                  <span>Get Your Free "Verified Student" Badge</span>
                )}
              </h4>
              {userProfile?.isStudentVerified && <VerifiedStudentBadge size="sm" />}
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              {userProfile?.isStudentVerified 
                ? `Verified with ${userProfile.studentVerificationData?.collegeOrCoaching || 'Coaching Institute'} • Higher trust on Roommate Finder & Marketplace`
                : userProfile?.studentVerificationStatus === 'pending'
                  ? 'Moderators verify coaching enrollment & college cards within 12-24 hours.'
                  : 'Verify coaching or college enrollment to boost trust on Roommate matching & Marketplace.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowVerificationModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-black text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>{userProfile?.isStudentVerified ? 'View Verification' : userProfile?.studentVerificationStatus === 'pending' ? 'Review Details' : 'Verify Student ID (Free)'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Stats Grid: 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* Saved Listings */}
        <Link
          to="/saved-listings"
          className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] hover:from-cyan-500/15 hover:to-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 fill-amber-400/30 text-amber-400" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {loading ? '...' : savedListings.length}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Saved Bookmarks</p>
          </div>
        </Link>

        {/* Marketplace Ads */}
        <Link
          to="/my-marketplace"
          className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] hover:from-cyan-500/15 hover:to-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {loading ? '...' : myMarketplaceItems.length}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Marketplace Ads</p>
          </div>
        </Link>

        {/* Hosted Properties */}
        <Link
          to="/my-listings"
          className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] hover:from-cyan-500/15 hover:to-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {loading ? '...' : myListings.length}
              </span>
              {myListings.filter(l => l.status === 'pending').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {myListings.filter(l => l.status === 'pending').length} review
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Hosted Listings</p>
          </div>
        </Link>

        {/* Student Living Budget */}
        <Link
          to="/budget"
          className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] hover:from-cyan-500/15 hover:to-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1">
              <span>Planner</span>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Live</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Student Budget Tool</p>
          </div>
        </Link>
      </div>

      {/* Feature: My Hosted Accommodations & Verification Status */}
      <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white/[0.04] via-black/40 to-white/[0.02] border border-white/10 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#00E5FF] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-white">My Hosted Accommodations</h4>
                {myListings.filter(l => l.status === 'pending').length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>{myListings.filter(l => l.status === 'pending').length} Under Review</span>
                  </span>
                )}
                {myListings.filter(l => l.status === 'approved').length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{myListings.filter(l => l.status === 'approved').length} Live</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Zero-brokerage student PGs, silent study libraries, and mess facilities you manage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/add-listing"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.35)] transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Listing</span>
            </Link>
            {myListings.length > 0 && (
              <Link
                to="/my-listings"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs border border-white/10 transition-all"
              >
                <span>Manage ({myListings.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-28 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            <div className="h-28 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          </div>
        ) : myListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myListings.slice(0, 4).map((listing) => (
              <div
                key={listing.id}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                    {listing.images && listing.images[0] ? (
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded bg-white/10 text-cyan-300">
                        {listing.category}
                      </span>
                      {listing.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      ) : listing.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-400">
                          <XCircle className="w-3 h-3" />
                          <span>Needs Changes</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-300 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>Under Review</span>
                        </span>
                      )}
                    </div>
                    <h5 className="text-sm font-bold text-white truncate group-hover:text-[#00E5FF] transition-colors">
                      {listing.title}
                    </h5>
                    <p className="text-xs text-gray-400 truncate">
                      {listing.city} • ₹{listing.price?.toLocaleString('en-IN')}/mo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    to={`/listing/${listing.id}`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all"
                    title="Preview listing"
                  >
                    <Eye className="w-4 h-4 text-[#00E5FF]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-sm font-bold text-white">Have a student PG, library, or tiffin facility to list?</p>
              <p className="text-xs text-gray-400 mt-0.5">Post your student accommodation for zero brokerage. Reach verified students across India.</p>
            </div>
            <Link
              to="/add-listing"
              className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs shrink-0"
            >
              List Free Accommodation
            </Link>
          </div>
        )}
      </div>

      {/* Feature 1: Flatmate / Roommate Finder (Book or List Yourself) */}
      <ProfileRoommateSection />

      {/* Feature 4: Free Books & Coaching Notes Exchange (Give or Take) */}
      <ProfileFreeNotesSection />

      {/* Feature 3: Location-Aware 24/7 Emergency & SOS Directory */}
      <ProfileEmergencySection />

      {/* Safety & Legal Terms Protection Hub */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white/[0.04] via-black/40 to-white/[0.02] border border-white/10 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">Student Safety & Platform Policy</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  IT Act Sec. 79
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Zero-brokerage directory, anti-scam rules, and intermediary legal guidelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/terms"
              className="px-3.5 py-1.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-black text-xs font-bold border border-[#00E5FF]/30 transition-all"
            >
              Terms of Service &rarr;
            </Link>
            <Link
              to="/safety"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black text-xs font-bold border border-amber-500/30 transition-all"
            >
              Safety Advisory &rarr;
            </Link>
          </div>
        </div>

        {/* 3 Important Safety & Legal Bullet Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="font-bold text-[#00E5FF] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Never Pay Token Online
            </span>
            <p className="text-gray-400 leading-relaxed">
              Bina physically room dekhe WhatsApp ya call par kisi ko gate pass ya booking advance na bhejein.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              Intermediary Discovery Portal
            </span>
            <p className="text-gray-400 leading-relaxed">
              Studolink connects students and owners. Room lease, rent agreement aur offline dispute ki zimmedari landlord-tenant ki hoti hai.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Emergency & Support
            </span>
            <p className="text-gray-400 leading-relaxed">
              National Helpline: <strong className="text-white">112</strong> • Student Mental Health Tele-MANAS: <strong className="text-white">14416</strong> (24x7 Free).
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 text-[11px] text-gray-500 border-t border-white/5">
          <span>By using Studolink, you agree to our verified student habitat terms.</span>
          <div className="flex items-center gap-3">
            <Link to="/privacy" className="hover:text-white underline">Privacy Policy</Link>
            <Link to="/legal?tab=grievance" className="hover:text-white underline">Grievance Cell</Link>
            <Link to="/help" className="text-[#00E5FF] hover:underline font-bold">24x7 Help Center</Link>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-3xl bg-[#0F172A] border border-white/15 p-6 shadow-2xl text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Log Out of Your Account?</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Are you sure you want to end your active session on this device?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-lg cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Student Verification Application Modal */}
      {showVerificationModal && (
        <StudentVerificationModal
          onClose={() => setShowVerificationModal(false)}
          onSuccess={() => {
            setShowVerificationModal(false);
          }}
        />
      )}
    </div>
  );
}
