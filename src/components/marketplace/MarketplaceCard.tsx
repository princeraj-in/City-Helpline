import React from 'react';
import { MarketplaceItem } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { APP_CONFIG } from '../../lib/appConfig';
import { VerifiedStudentBadge } from '../common/TrustBadge';
import { formatWhatsAppUrl } from '../../lib/utils';

interface MarketplaceCardProps {
  item: MarketplaceItem;
  onOpenDetails: (item: MarketplaceItem) => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ item, onOpenDetails }) => {
  const discountPercent = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = item.whatsappNumber || item.sellerPhone;
    const itemUrl = APP_CONFIG.getMarketplaceUrl(item.id);
    const text = item.price === 0
      ? `Hi ${item.sellerName}, maine Studolink par aapka Free Study Material Giveaway "${item.title}" dekha. Kya ye abhi available hai collect karne ke liye?`
      : `Hi ${item.sellerName}, maine Studolink Student Marketplace (${itemUrl}) par aapka item "${item.title}" dekha. Kya ye abhi available hai?`;
    window.open(formatWhatsAppUrl(phone, text), '_blank', 'noopener,noreferrer');
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${item.sellerPhone}`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Like New':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Good Condition':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
  const displayImage = item.images && item.images.length > 0 ? item.images[0] : fallbackImage;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <GlassCard 
        onClick={() => onOpenDetails(item)}
        className="h-full flex flex-col overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer relative bg-slate-900/60"
        intensity="low"
      >
        {/* Top Image Chamber */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
          <img 
            src={displayImage} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

          {/* Condition Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {item.price === 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-300 animate-pulse">
                🎁 100% FREE GIFT
              </span>
            ) : (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-sm ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
            )}
            {discountPercent && item.price > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500/90 text-white backdrop-blur-md shadow-sm animate-pulse">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Category Pill */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-gray-200 border border-white/15 backdrop-blur-md">
              {item.category}
            </span>
          </div>

          {/* Sold out overlay */}
          {item.status === 'sold' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
              <span className="px-4 py-1.5 rounded-xl bg-rose-600/90 text-white font-extrabold tracking-wider text-sm uppercase shadow-xl border border-rose-400/40">
                {item.price === 0 ? 'Handed Over' : 'Sold Out'}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Price Tag */}
            <div className="flex items-baseline gap-2 mb-2">
              {item.price === 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-emerald-400 tracking-tight bg-emerald-500/15 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                    ₹0 (FREE GIVEAWAY)
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-2xl font-black text-white tracking-tight">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-gray-400 line-through font-medium">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors mb-2">
              {item.title}
            </h3>

            {/* Location Pill */}
            <div className="flex items-center gap-1.5 text-xs text-gray-300 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              <span className="truncate font-medium">
                {item.city}{item.area ? ` • ${item.area}` : ''}
              </span>
            </div>
          </div>

          {/* Footer with Seller info and Quick Action CTAs */}
          <div className="pt-3 border-t border-white/10 mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span className="flex items-center gap-1 font-medium truncate max-w-[140px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{item.sellerName}</span>
              </span>
              {item.isStudentVerified && (
                <VerifiedStudentBadge size="sm" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleWhatsAppClick}
                disabled={item.status === 'sold'}
                className="w-full py-2 px-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCallClick}
                disabled={item.status === 'sold'}
                className="w-full py-2 px-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Seller</span>
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
