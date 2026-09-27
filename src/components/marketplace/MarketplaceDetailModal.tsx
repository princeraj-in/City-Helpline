import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceItem } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { 
  X, MapPin, Phone, MessageCircle, ShieldAlert, CheckCircle, 
  Trash2, AlertTriangle, Sparkles, User, Calendar, ExternalLink,
  Share2, Check, MessageSquareText, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { APP_CONFIG } from '../../lib/appConfig';
import { getOrCreateConversation } from '../../lib/chatService';
import { toast } from 'sonner';
import { formatWhatsAppUrl } from '../../lib/utils';

interface MarketplaceDetailModalProps {
  item: MarketplaceItem | null;
  onClose: () => void;
  onItemUpdated?: (updatedItem: MarketplaceItem) => void;
  onItemDeleted?: (itemId: string) => void;
}

export const MarketplaceDetailModal: React.FC<MarketplaceDetailModalProps> = ({
  item,
  onClose,
  onItemUpdated,
  onItemDeleted
}) => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  if (!item) return null;

  const isOwner = currentUser?.uid === item.sellerId || userProfile?.role === 'admin';
  const discountPercent = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  const [copiedShare, setCopiedShare] = useState(false);

  const handleWhatsApp = () => {
    const phone = item.whatsappNumber || item.sellerPhone;
    const itemUrl = APP_CONFIG.getMarketplaceUrl(item.id);
    const text = `Hi ${item.sellerName}, maine City Helpline Student Marketplace (${itemUrl}) par aapka item "${item.title}" dekha. Kya ye abhi available hai?`;
    window.open(formatWhatsAppUrl(phone, text), '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    const itemUrl = APP_CONFIG.getMarketplaceUrl(item.id);
    const shareText = `Check out "${item.title}" (₹${item.price.toLocaleString('en-IN')}) on City Helpline Student Marketplace: ${itemUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${item.title} - City Helpline Marketplace`,
        text: shareText,
        url: itemUrl
      }).catch(() => {
        navigator.clipboard.writeText(itemUrl);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(itemUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${item.sellerPhone}`;
  };

  const handleStartChat = async () => {
    if (!item) return;
    if (!currentUser) {
      toast.info("Please login to chat with seller");
      onClose();
      navigate('/login');
      return;
    }
    if (currentUser.uid === item.sellerId) {
      toast.info("This is your own marketplace item!");
      return;
    }

    setStartingChat(true);
    try {
      const convId = await getOrCreateConversation(
        currentUser,
        userProfile,
        {
          uid: item.sellerId,
          name: item.sellerName,
          role: 'user',
        },
        {
          id: item.id,
          title: item.title,
          price: item.price,
          category: item.category,
          image: item.images?.[0] || '',
          city: item.city,
        }
      );
      onClose();
      navigate(`/messages/${convId}`);
    } catch (e: any) {
      console.error("Chat error:", e);
      toast.error("Could not start chat");
    } finally {
      setStartingChat(false);
    }
  };

  const handleToggleSold = async () => {
    if (!item.id || item.id.startsWith('m-')) {
      // Demo item update locally
      const updated: MarketplaceItem = {
        ...item,
        status: item.status === 'available' ? 'sold' : 'available'
      };
      onItemUpdated?.(updated);
      return;
    }

    try {
      setIsUpdating(true);
      const newStatus = item.status === 'available' ? 'sold' : 'available';
      await updateDoc(doc(db, 'marketplace_items', item.id), {
        status: newStatus
      });
      onItemUpdated?.({ ...item, status: newStatus });
    } catch (err) {
      console.error('Failed to update item status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!item.id || item.id.startsWith('m-')) {
      onItemDeleted?.(item.id);
      onClose();
      return;
    }

    try {
      setIsUpdating(true);
      await deleteDoc(doc(db, 'marketplace_items', item.id));
      onItemDeleted?.(item.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete item:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const images = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl my-auto z-10"
        >
          <GlassCard className="p-0 overflow-hidden border border-white/15 bg-slate-900/95 shadow-2xl rounded-3xl" intensity="high">
            {/* Header close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[85vh] overflow-y-auto">
              {/* Image Section */}
              <div className="relative aspect-[16/9] w-full bg-slate-950">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 backdrop-blur-md">
                    {item.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                    Condition: {item.condition}
                  </span>
                  {item.status === 'sold' && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white uppercase tracking-wider shadow-lg">
                      SOLD OUT
                    </span>
                  )}
                </div>

                {/* Multiple image thumbnails */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`h-12 w-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === idx ? 'border-[#00E5FF] scale-105 shadow-md' : 'border-white/30 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Title & Price Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                      {item.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-4 h-4 text-[#00E5FF]" />
                        {item.city}{item.area ? `, ${item.area}` : ''}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="flex items-baseline sm:justify-end gap-2">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-cyan-200">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="flex items-center sm:justify-end gap-2 text-xs">
                        <span className="text-gray-400 line-through font-medium">
                          MRP ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <h4 className="text-xs uppercase font-extrabold text-cyan-300 tracking-wider mb-2">
                    Item Description
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {/* Seller Profile & Safety Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Seller Box */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Seller Details
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center font-bold text-lg border border-[#00E5FF]/30">
                          {item.sellerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{item.sellerName}</h4>
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Verified Student / Resident
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={handleStartChat}
                        disabled={item.status === 'sold' || startingChat}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00E5FF]/20 to-[#8A2BE2]/20 hover:from-[#00E5FF]/30 hover:to-[#8A2BE2]/30 text-white border border-[#00E5FF]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                      >
                        {startingChat ? (
                          <Loader2 className="w-4 h-4 text-[#00E5FF] animate-spin" />
                        ) : (
                          <MessageSquareText className="w-4 h-4 text-[#00E5FF]" />
                        )}
                        <span>In-App Chat</span>
                      </button>
                      <button
                        onClick={handleWhatsApp}
                        disabled={item.status === 'sold'}
                        className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={handleCall}
                        disabled={item.status === 'sold'}
                        className="py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={handleShare}
                        className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedShare ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 text-[#00E5FF]" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Safety Guidance */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider text-amber-300">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Student Safety Tips</span>
                    </div>
                    <ul className="text-xs space-y-1.5 text-amber-100/80 list-disc list-inside">
                      <li>Meet the student in daylight near hostel/coaching reception.</li>
                      <li>Check books/appliances thoroughly before making payment.</li>
                      <li>Never send UPI advance token money without physical inspection.</li>
                    </ul>
                  </div>
                </div>

                {/* Owner controls */}
                {isOwner && (
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleSold}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                      >
                        {item.status === 'available' ? 'Mark as Sold' : 'Mark as Available'}
                      </button>
                    </div>

                    <div>
                      {deleteConfirm ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-rose-300 font-medium">Are you sure?</span>
                          <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-all cursor-pointer"
                          >
                            Yes, Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(false)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(true)}
                          className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete My Post</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
