import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle, XCircle, Star, Phone, MapPin, 
  IndianRupee, Building, User, Calendar, ExternalLink, Edit,
  ShieldCheck, Zap, Building2, CheckCircle2, AlertTriangle, Lock, RefreshCw
} from 'lucide-react';
import { Listing, PGVerificationData } from '../../types';
import { VerifiedPGBadge } from '../common/TrustBadge';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ListingInspectModalProps {
  listing: Listing | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  onEdit: (id: string) => void;
  onApprovePGVerification?: (id: string) => void;
  onRejectPGVerification?: (id: string) => void;
}

export const ListingInspectModal: React.FC<ListingInspectModalProps> = ({
  listing,
  onClose,
  onApprove,
  onReject,
  onToggleFeatured,
  onEdit,
  onApprovePGVerification,
  onRejectPGVerification,
}) => {
  const [privateVerificationData, setPrivateVerificationData] = useState<PGVerificationData | null>(null);
  const [loadingPrivate, setLoadingPrivate] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPrivateListingDoc = async () => {
      if (!listing?.id) return;
      setLoadingPrivate(true);
      try {
        const privateRef = doc(db, 'listings', listing.id, 'private', 'verification');
        const snap = await getDoc(privateRef);
        if (snap.exists() && isMounted) {
          setPrivateVerificationData(snap.data() as PGVerificationData);
        } else if (isMounted) {
          setPrivateVerificationData(listing.pgVerificationData || null);
        }
      } catch (err) {
        console.warn('Could not load private listing verification for admin:', err);
        if (isMounted) {
          setPrivateVerificationData(listing.pgVerificationData || null);
        }
      } finally {
        if (isMounted) setLoadingPrivate(false);
      }
    };
    fetchPrivateListingDoc();
    return () => {
      isMounted = false;
    };
  }, [listing?.id, listing?.pgVerificationData]);

  if (!listing) return null;

  const activeVerificationData = privateVerificationData || listing.pgVerificationData;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0B0E14] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 my-8"
        >
          {/* Neon Header Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#00E5FF] via-[#8A2BE2] to-[#00E5FF]" />

          {/* Modal Header */}
          <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  listing.status === 'approved' ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30' :
                  listing.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {listing.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-white/10 text-gray-300">
                  {listing.category}
                </span>
                {listing.featured && (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#8A2BE2]/20 text-[#8A2BE2] border border-[#8A2BE2]/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {listing.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* Gallery */}
            {listing.images && listing.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40 group">
                    <img 
                      src={img} 
                      alt={`Photo ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-sm">
                No images attached to this listing
              </div>
            )}

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-[#00E5FF]" /> Price
                </div>
                <div className="text-lg font-bold text-white">
                  ₹{listing.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-400">/ month</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8A2BE2]" /> Location
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {listing.city}
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">{listing.address}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" /> Submitted By
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {listing.authorName}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#00E5FF] mt-0.5">
                  <Phone className="w-3 h-3" /> {listing.contact}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Property Description</h4>
              <p className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Verified PG Trust & Daylight Inspection Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-400/30 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">Verified PG & Hostel Verification</h4>
                      {listing.isVerifiedPG && <VerifiedPGBadge size="sm" />}
                    </div>
                    <p className="text-xs text-gray-400">
                      Zero Brokerage • Daylight Physical Inspection • Declared Sub-meter Rate
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                  listing.isVerifiedPG 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : listing.pgVerificationStatus === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : listing.pgVerificationStatus === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-white/10 text-gray-400 border-white/10'
                }`}>
                  {listing.isVerifiedPG ? 'Verified PG Active' : listing.pgVerificationStatus === 'pending' ? 'Verification Pending Review' : listing.pgVerificationStatus === 'rejected' ? 'Application Rejected' : 'Not Applied'}
                </span>
              </div>

              {loadingPrivate ? (
                <div className="flex items-center justify-center p-6 bg-black/40 rounded-xl border border-white/5 text-gray-400 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span className="text-xs">Loading private verification document...</span>
                </div>
              ) : activeVerificationData ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-white/5 text-[10px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Protected Private Storage ({privateVerificationData ? 'listings/{id}/private/verification' : 'Legacy document'})</span>
                    </span>
                    <span className="text-gray-400">
                      ID Type: {activeVerificationData.ownerGovtIdType || 'Electricity Bill'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-black/30 p-3.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Electricity Consumer / CA No.:</span>
                      <span className="font-mono text-white font-bold bg-white/5 px-2 py-0.5 rounded">
                        {activeVerificationData.electricityConsumerNumber || 'Not provided'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Declared Electricity Rate:</span>
                      <span className="text-emerald-300 font-bold">
                        ₹{activeVerificationData.subMeterRateDeclared || 8} per unit
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Caretaker / Contact:</span>
                      <span className="text-white font-semibold">
                        {activeVerificationData.caretakerName || listing.authorName} ({activeVerificationData.caretakerPhone || listing.contact})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Submitted Date:</span>
                      <span className="text-gray-300">
                        {activeVerificationData.submittedAt ? new Date(activeVerificationData.submittedAt).toLocaleDateString('en-IN') : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No separate verification documents submitted yet by the landlord.
                </p>
              )}

              {/* Admin PG Verification Actions */}
              {(onApprovePGVerification || onRejectPGVerification) && (
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-emerald-500/20">
                  {onRejectPGVerification && (listing.isVerifiedPG || listing.pgVerificationStatus === 'pending') && (
                    <button
                      type="button"
                      onClick={() => onRejectPGVerification(listing.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      {listing.isVerifiedPG ? 'Revoke Verified PG Badge' : 'Reject Verification Request'}
                    </button>
                  )}

                  {onApprovePGVerification && !listing.isVerifiedPG && (
                    <button
                      type="button"
                      onClick={() => onApprovePGVerification(listing.id)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00E5FF] text-black text-xs font-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Issue Verified PG Badge</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Timestamps & Technical details */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
              <span>Listing ID: <code className="font-mono text-gray-400">{listing.id}</code></span>
              <span>Submitted: {new Date(listing.createdAt).toLocaleString()}</span>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFeatured(listing.id, listing.featured)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  listing.featured 
                    ? 'bg-[#8A2BE2]/20 text-[#8A2BE2] border-[#8A2BE2]/40 shadow-[0_0_15px_rgba(138,43,226,0.3)]' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${listing.featured ? 'fill-current' : ''}`} />
                <span>{listing.featured ? 'Featured' : 'Mark as Featured'}</span>
              </button>

              <button
                onClick={() => onEdit(listing.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              {listing.status !== 'rejected' && (
                <button
                  onClick={() => {
                    onReject(listing.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              )}

              {listing.status !== 'approved' && (
                <button
                  onClick={() => {
                    onApprove(listing.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:brightness-110 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Listing</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
