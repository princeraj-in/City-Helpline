import React, { useState, useEffect } from 'react';
import { X, Building2, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, Clock, FileText, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { Listing, PGVerificationData } from '../../types';

interface PGVerificationModalProps {
  listing: Listing;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PGVerificationModal: React.FC<PGVerificationModalProps> = ({ listing, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();

  const [consumerNumber, setConsumerNumber] = useState(
    listing.pgVerificationData?.electricityConsumerNumber || ''
  );
  const [subMeterRate, setSubMeterRate] = useState<number>(
    listing.pgVerificationData?.subMeterRateDeclared || 8
  );
  const [caretakerName, setCaretakerName] = useState(
    listing.pgVerificationData?.caretakerName || listing.authorName || ''
  );
  const [caretakerPhone, setCaretakerPhone] = useState(
    listing.pgVerificationData?.caretakerPhone || listing.contact || ''
  );
  const [idType, setIdType] = useState(
    listing.pgVerificationData?.ownerGovtIdType || 'Electricity Bill (Latest)'
  );
  const [inspectionAgreement, setInspectionAgreement] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPrivate, setIsLoadingPrivate] = useState(false);

  const existingStatus = listing.pgVerificationStatus;
  const isAlreadyVerified = listing.isVerifiedPG || existingStatus === 'verified';
  const isPending = existingStatus === 'pending';

  // Fetch private verification details from protected subcollection
  useEffect(() => {
    let isMounted = true;
    const fetchPrivateData = async () => {
      if (!listing?.id) return;
      setIsLoadingPrivate(true);
      try {
        const privateRef = doc(db, 'listings', listing.id, 'private', 'verification');
        const snap = await getDoc(privateRef);
        if (snap.exists() && isMounted) {
          const data = snap.data() as PGVerificationData;
          if (data.electricityConsumerNumber) setConsumerNumber(data.electricityConsumerNumber);
          if (data.subMeterRateDeclared) setSubMeterRate(data.subMeterRateDeclared);
          if (data.caretakerName) setCaretakerName(data.caretakerName);
          if (data.caretakerPhone) setCaretakerPhone(data.caretakerPhone);
          if (data.ownerGovtIdType) setIdType(data.ownerGovtIdType);
        }
      } catch (err) {
        console.warn('Could not load private listing verification doc:', err);
      } finally {
        if (isMounted) setIsLoadingPrivate(false);
      }
    };
    fetchPrivateData();
    return () => {
      isMounted = false;
    };
  }, [listing?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }

    if (!consumerNumber.trim()) {
      toast.error('Please enter property electricity bill / consumer number.');
      return;
    }
    if (!inspectionAgreement) {
      toast.error('Please agree to allow daylight physical inspection.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullVerificationPayload: PGVerificationData = {
        electricityConsumerNumber: consumerNumber.trim(),
        subMeterRateDeclared: Number(subMeterRate),
        caretakerName: caretakerName.trim(),
        caretakerPhone: caretakerPhone.trim(),
        ownerGovtIdType: idType,
        physicalInspectionDone: false,
        submittedAt: Date.now(),
      };

      // 1. SECURE STORAGE: Store sensitive electricity bill & caretaker IDs in protected private subcollection
      const privateListingVerificationRef = doc(db, 'listings', listing.id, 'private', 'verification');
      await setDoc(privateListingVerificationRef, fullVerificationPayload);

      // 2. PUBLIC LISTING: Only save public tariff rate & status (Zero sensitive consumer number / ID leakage)
      const safePublicSummary = {
        subMeterRateDeclared: Number(subMeterRate),
        submittedAt: Date.now(),
      };

      const listingRef = doc(db, 'listings', listing.id);
      await updateDoc(listingRef, {
        pgVerificationStatus: 'pending',
        pgVerificationData: safePublicSummary,
      });

      toast.success(
        language === 'hi'
          ? 'सत्यापन अनुरोध सबमिट हुआ! हमारी टीम बिजली बिल व भौतिक कमरे की जांच कर 24 घंटे में बैज सक्रिय करेगी।'
          : 'PG verification request submitted! Our field moderation team will verify room details within 24 hours.'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error submitting PG verification:', err);
      toast.error('Failed to submit PG verification: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#0c1017] border border-emerald-400/40 p-6 sm:p-8 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-[#00E5FF]/20 border border-emerald-400/40 text-emerald-400">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{language === 'hi' ? 'सत्यापित पीजी (Verified PG) बैज आवेदन' : 'Apply for "Verified PG" Badge'}</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-gray-400 truncate max-w-xs">
              Listing: <span className="text-white font-bold">{listing.title}</span>
            </p>
          </div>
        </div>

        {/* Current status banner */}
        {isAlreadyVerified ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">This Property is Officially Verified!</h4>
              <p className="text-xs text-emerald-300">
                "Verified PG" trust badge is live on search cards & details page.
              </p>
            </div>
          </div>
        ) : isPending ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-400 shrink-0 animate-spin" />
            <div>
              <h4 className="text-sm font-bold text-white">Verification Under Review</h4>
              <p className="text-xs text-amber-200">
                Electricity credentials & room photos submitted on {listing.pgVerificationData?.submittedAt ? new Date(listing.pgVerificationData.submittedAt).toLocaleDateString() : 'recently'} are being reviewed.
              </p>
            </div>
          </div>
        ) : null}

        {/* Why get Verified PG badge */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-gray-300 space-y-2">
          <h4 className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Badge Criteria & Student Trust Guarantees
          </h4>
          <ul className="space-y-1.5 pl-1">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                <strong>Higher Booking Rate:</strong> Verified listings receive top ranking in search and 5x more genuine student calls.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-1.5 shrink-0" />
              <span>
                <strong>Zero Brokerage Commitment:</strong> Direct owner deal without middleman cuts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] mt-1.5 shrink-0" />
              <span>
                <strong>Fair Electricity Tariff:</strong> Sub-meter rate must be clearly disclosed (standard ₹7–₹10/unit).
              </span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">
                Electricity Consumer / K-Number *
              </label>
              <input
                type="text"
                required
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder="e.g. 1029384756 (JVVNL / SBPDCL / Tata Power)"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">
                Sub-Meter Rate Declared (₹ / Unit) *
              </label>
              <input
                type="number"
                min={5}
                max={15}
                required
                value={subMeterRate}
                onChange={(e) => setSubMeterRate(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-400 transition-all"
              />
              <span className="text-[10px] text-gray-500">Standard for student PGs is ₹7 to ₹10 / unit.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Caretaker / Owner Name</label>
              <input
                type="text"
                value={caretakerName}
                onChange={(e) => setCaretakerName(e.target.value)}
                placeholder="Owner full name"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Verification Phone / WhatsApp</label>
              <input
                type="tel"
                value={caretakerPhone}
                onChange={(e) => setCaretakerPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Ownership Proof Document Type</label>
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 transition-all"
            >
              <option value="Electricity Bill (Latest)">Electricity Bill (Latest 3 Months)</option>
              <option value="Municipal House Tax Receipt">Municipal House Tax / Property Tax Slip</option>
              <option value="Owner Aadhaar / Land Deed">Owner Aadhaar & Property Record</option>
              <option value="Commercial Hostel License">Commercial Hostel / Trade License</option>
            </select>
          </div>

          {/* Daylight Physical Inspection Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 cursor-pointer">
            <input
              type="checkbox"
              checked={inspectionAgreement}
              onChange={(e) => setInspectionAgreement(e.target.checked)}
              className="mt-0.5 rounded border-white/20 text-emerald-400 focus:ring-emerald-400"
            />
            <span className="text-xs text-gray-300 leading-relaxed">
              I certify that all uploaded room photos are genuine and taken in daylight. I agree to allow a physical inspection by a City Helpline student ambassador if requested.
            </span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00E5FF] text-black font-black text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : isPending ? 'Update Application' : 'Submit For Verified PG Badge'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
