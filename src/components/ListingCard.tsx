import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { MapPin, Building2, ArrowRight, Star, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GlassCard } from './ui/GlassCard';
import { VerifiedPGBadge } from './common/TrustBadge';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { currentUser, userProfile } = useAuth();
  
  const isSaved = userProfile?.savedListings?.includes(listing.id) || false;

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the listing
    e.stopPropagation();
    
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      if (isSaved) {
        await updateDoc(userRef, {
          savedListings: arrayRemove(listing.id)
        });
      } else {
        await updateDoc(userRef, {
          savedListings: arrayUnion(listing.id)
        });
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  return (
    <Link to={`/listing/${listing.id}`} className="block h-full">
      <GlassCard intensity="low" className="overflow-hidden hover:border-[#00E5FF]/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,229,255,0.2)] hover:-translate-y-2 h-full flex flex-col group relative" glowColor="rgba(0, 229, 255, 0.2)">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-[#8A2BE2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <div className="h-52 sm:h-60 md:h-64 w-full relative overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              loading="lazy"
              decoding="async"
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[rgba(255,255,255,0.05)] text-gray-500">
              <Building2 className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/40 to-transparent opacity-90"></div>
          
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-1.5 sm:gap-2 items-end z-10">
            {listing.featured && (
              <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg shadow-yellow-500/20">
                Featured
              </span>
            )}
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
              {listing.category}
            </span>
          </div>

          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex flex-col gap-1.5 items-start">
            <div className="flex items-center bg-[rgba(255,255,255,0.06)] backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-white/10">
              <Star className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-yellow-400 fill-yellow-400 mr-1 sm:mr-1.5" />
              <span className="text-white text-xs font-bold">
                {listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}
              </span>
              {listing.reviewCount !== undefined && listing.reviewCount > 0 && (
                <span className="text-gray-400 text-[10px] ml-1.5">({listing.reviewCount})</span>
              )}
            </div>
            {listing.isVerifiedPG && (
              <VerifiedPGBadge size="sm" />
            )}
          </div>

          {currentUser && (
            <button 
              onClick={toggleSave}
              className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 p-2.5 sm:p-3 rounded-full bg-[rgba(255,255,255,0.06)] backdrop-blur-md hover:bg-white/20 border border-white/10 transition-all duration-300 shadow-lg group/btn z-20 hover:scale-110 min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <Heart 
                className={`h-4 sm:h-5 w-4 sm:w-5 transition-colors ${isSaved ? 'fill-[#FF3B3B] text-[#FF3B3B]' : 'text-white group-hover/btn:text-[#FF3B3B]'}`} 
              />
            </button>
          )}
          
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-14 sm:right-16 z-10">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate drop-shadow-md group-hover:text-[#00E5FF] transition-colors">{listing.title}</h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-300 drop-shadow-md font-medium">
              <MapPin className="h-3.5 w-3.5 mr-1 text-[#00E5FF]" />
              <span className="truncate">{listing.city}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between bg-transparent relative z-10">
          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-4 sm:mb-6 leading-relaxed">{listing.description || listing.address}</p>
          <div className="flex items-center justify-between mt-auto pt-3 sm:pt-5 border-t border-white/10">
            <div>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider block mb-0.5 sm:mb-1">Starting from</span>
              <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                ₹{listing.price.toLocaleString()}<span className="text-xs sm:text-sm text-gray-500 font-medium ml-1">/mo</span>
              </span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center group-hover:bg-[#00E5FF] group-hover:border-[#00E5FF] transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 text-[#00E5FF] group-hover:text-white transition-colors group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
