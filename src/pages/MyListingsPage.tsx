import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Listing } from '../types';
import { Building2, PlusCircle, MapPin, Trash2, Edit3, ArrowRight, Eye, CheckCircle2, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { PersonalPageHeader } from '../components/layout/PersonalPageHeader';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { VerifiedPGBadge } from '../components/common/TrustBadge';
import { PGVerificationModal } from '../components/profile/PGVerificationModal';

export default function MyListingsPage() {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedListingForVerification, setSelectedListingForVerification] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'listings'),
          where('authorId', '==', currentUser.uid)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Listing));
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setListings(data);
      } catch (err) {
        console.warn('Notice: Error fetching user listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [currentUser]);

  const pendingCount = listings.filter((l) => l.status === 'pending').length;
  const approvedCount = listings.filter((l) => l.status === 'approved').length;
  const rejectedCount = listings.filter((l) => l.status === 'rejected').length;

  const filteredListings = listings.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const deleteListing = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to delete this accommodation listing?')) return;
    try {
      await deleteDoc(doc(db, 'listings', listingId));
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      toast.success('Listing deleted successfully');
    } catch (err) {
      console.error('Failed to delete listing:', err);
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-20 md:mb-12">
      <PersonalPageHeader
        title="My Hosted Accommodations"
        subtitle="Manage your listed student PGs, hostels, silent study libraries, and mess facilities"
        badge={`${listings.length} Listed`}
        badgeColor="bg-cyan-400/10 text-cyan-300 border-cyan-400/30"
        icon={Building2}
        iconColor="text-[#00E5FF]"
        exitUrl="/profile"
        backLabel="Profile"
        rightAction={
          <Link
            to="/add-listing"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Listing</span>
          </Link>
        }
      />

      {/* Verification Lifecycle Guidance Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-purple-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>Admin Verification & Approval Process</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-black uppercase bg-[#00E5FF]/20 text-[#00E5FF]">
                Anti-Fraud Safety
              </span>
            </h4>
            <p className="text-gray-300 mt-0.5">
              Newly submitted accommodations undergo a security review before appearing in public search. You can view all your listings below with their live status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/add-listing"
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-[#00E5FF] font-bold text-xs border border-cyan-500/30 transition-all flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Another PG</span>
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.35)]'
              : 'bg-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.1]'
          }`}
        >
          All Accommodations ({listings.length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.35)]'
              : 'bg-white/[0.06] text-amber-300/80 hover:text-amber-200 hover:bg-white/[0.1]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Under Review ({pendingCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)]'
              : 'bg-white/[0.06] text-emerald-300/80 hover:text-emerald-200 hover:bg-white/[0.1]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Live on Studolink ({approvedCount})</span>
        </button>

        {rejectedCount > 0 && (
          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'rejected'
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                : 'bg-white/[0.06] text-rose-300/80 hover:text-rose-200 hover:bg-white/[0.1]'
            }`}
          >
            <span>Needs Changes ({rejectedCount})</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-card rounded-3xl h-64 animate-pulse bg-white/[0.05] border border-white/10"
            />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard
                className="overflow-hidden flex flex-col h-full hover:border-[#00E5FF]/40 transition-all group"
                intensity="low"
              >
                <div className="relative h-44 w-full bg-white/[0.04] overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#00E5FF] border border-[#00E5FF]/30">
                      {item.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/90 text-white border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                          : item.status === 'rejected'
                          ? 'bg-rose-500/90 text-white border-rose-400/50'
                          : 'bg-amber-500/90 text-black border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                      }`}
                    >
                      {item.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>Approved & Live</span>
                        </>
                      ) : item.status === 'rejected' ? (
                        <span>Needs Changes</span>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-black animate-spin" />
                          <span>Under Review</span>
                        </>
                      )}
                    </span>
                    {item.isVerifiedPG && (
                      <VerifiedPGBadge size="sm" />
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Link
                      to={`/edit-listing/${item.id}`}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#00E5FF] text-white hover:text-black backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-md"
                      title="Edit listing"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteListing(item.id)}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-rose-500 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-md cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#00E5FF] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                      <span className="truncate">{item.city} • {item.address}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    {item.isVerifiedPG ? (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified PG Badge Active</span>
                      </span>
                    ) : item.pgVerificationStatus === 'pending' ? (
                      <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Verification In Review</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedListingForVerification(item)}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Apply for Verified PG Badge &rarr;</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Monthly Rent</p>
                      <p className="text-base font-black text-[#00E5FF]">
                        ₹{item.price.toLocaleString('en-IN')}
                        <span className="text-xs text-gray-400 font-normal">/mo</span>
                      </p>
                    </div>

                    <Link
                      to={`/listing/${item.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs transition-all border border-white/10"
                    >
                      <span>Preview</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center max-w-lg mx-auto" intensity="low">
          <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-[#00E5FF] flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Hosted Listings Yet</h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Own or manage a student PG, hostel, silent library, or tiffin service? List it for free and reach thousands of verified students across Kota, Patna, Delhi and more.
          </p>
          <Link
            to="/add-listing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Accommodation</span>
          </Link>
        </GlassCard>
      )}

      {selectedListingForVerification && (
        <PGVerificationModal
          listing={selectedListingForVerification}
          onClose={() => setSelectedListingForVerification(null)}
          onSuccess={() => {
            setListings((prev) =>
              prev.map((l) =>
                l.id === selectedListingForVerification.id
                  ? { ...l, pgVerificationStatus: 'pending' }
                  : l
              )
            );
          }}
        />
      )}
    </div>
  );
}
