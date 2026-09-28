import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  PlusCircle, 
  ShoppingBag, 
  Building2, 
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface ListingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'accommodation' | 'marketplace';
  itemId?: string;
  itemTitle: string;
  city?: string;
  price?: number;
  category?: string;
  imageThumbnail?: string;
  onAddAnother?: () => void;
}

export const ListingSuccessModal: React.FC<ListingSuccessModalProps> = ({
  isOpen,
  onClose,
  type,
  itemId,
  itemTitle,
  city,
  price,
  category,
  imageThumbnail,
  onAddAnother
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isAccommodation = type === 'accommodation';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Deep Backdrop with Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0c1220] to-[#080d17] border border-[#00E5FF]/30 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(0,229,255,0.2)] overflow-hidden z-10 text-white my-8"
        >
          {/* Top Neon Ambient Glow Ribbon */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00E5FF] via-[#8A2BE2] to-[#FFD700]" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Icon + Celebration Animation */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                {/* Glowing Outer Rings */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#8A2BE2] opacity-40 blur-lg animate-pulse" />
                
                <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border shadow-xl ${
                  isAccommodation 
                    ? 'bg-gradient-to-br from-amber-500/20 via-cyan-500/20 to-purple-500/20 border-cyan-400/40 text-[#00E5FF]'
                    : 'bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border-emerald-400/40 text-emerald-400'
                }`}>
                  {isAccommodation ? (
                    <Building2 className="w-10 h-10 text-[#00E5FF]" />
                  ) : (
                    <ShoppingBag className="w-10 h-10 text-emerald-400" />
                  )}

                  {/* Sparkle Badge */}
                  <div className="absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-[#00E5FF] text-black shadow-md animate-bounce">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>

              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border ${
                  isAccommodation
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}>
                  {isAccommodation ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitted for Verification • समीक्षाधीन</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Published Successfully • लाइव</span>
                    </>
                  )}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {isAccommodation 
                    ? 'Listing Submitted for Review! 🎉' 
                    : 'Item Listed on Campus Marketplace! 🚀'}
                </h3>
              </div>
            </div>

            {/* Item Preview Card */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3.5 shadow-inner">
              {imageThumbnail ? (
                <img
                  src={imageThumbnail}
                  alt={itemTitle}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
                  {isAccommodation ? <Building2 className="w-7 h-7" /> : <ShoppingBag className="w-7 h-7" />}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  {category && (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF]">
                      {category}
                    </span>
                  )}
                  {city && (
                    <span className="text-xs text-gray-400 truncate">
                      • {city}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white truncate">{itemTitle}</h4>
                {typeof price === 'number' && (
                  <p className="text-sm font-extrabold text-[#00E5FF]">
                    ₹{price.toLocaleString('en-IN')}
                    {isAccommodation && <span className="text-xs text-gray-400 font-normal"> /month</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Educational / Explanatory Transparency Box */}
            {isAccommodation ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10 border border-amber-500/25 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-black">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Admin Approval & Security Verification Policy</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Studolink एक <strong>Zero-Brokerage & Anti-Fraud</strong> स्टूडेंट इकोसिस्टम है। फर्जी ब्रोकर्स और स्कैम रोकने के लिए आपकी लिस्टिंग को मॉडरेटर्स द्वारा चेक किया जाता है।
                </p>
                <div className="pt-2 border-t border-white/10 flex flex-col gap-1 text-[11px] text-gray-400">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#00E5FF] font-bold">1.</span>
                    <span><strong>आपकी प्रोफ़ाइल में:</strong> यह तुरंत <span className="text-amber-300 font-bold">"Under Review"</span> बैज के साथ दिखेगी।</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span><strong>पब्लिक सर्च में:</strong> एडमिन द्वारा अप्रूव होते ही पूरे शहर के छात्रों को लाइव दिखेगी (12-24 घंटे के अंदर)।</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 border border-emerald-500/25 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-black">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Peer-to-Peer Campus Marketplace</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  आपका आइटम अब <strong>Marketplace</strong> में लाइव है! आपके शहर {city ? `(${city})` : ''} के छात्र अब आपसे सीधे WhatsApp या कॉल द्वारा संपर्क कर सकते हैं।
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* Primary Action Button */}
              {isAccommodation ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/my-listings');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-cyan-400 hover:from-cyan-300 hover:to-[#00E5FF] text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>View in "My Hosted Accommodations"</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/marketplace');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-[#00E5FF] hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(52,211,153,0.35)] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Campus Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Secondary Actions Row */}
              <div className="grid grid-cols-2 gap-2.5">
                {isAccommodation && itemId ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/listing/${itemId}`);
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Preview Details</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/profile');
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>My Profile</span>
                  </button>
                )}

                {onAddAnother ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAddAnother();
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isAccommodation ? 'List Another PG' : 'Sell Another Item'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/');
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Back to Home</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
