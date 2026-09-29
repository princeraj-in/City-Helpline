import React from 'react';

/**
 * Sweeping Shimmer Highlight Effect
 * Glides smoothly across dark glass containers to mimic content streaming
 */
export const ShimmerOverlay: React.FC = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
);

/**
 * 1. Accommodation / PG / Library Listing Card Skeleton
 * Matches ListingCard.tsx dimensions exactly (Prevents CLS)
 */
export const ListingCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden flex flex-col h-full relative shadow-lg">
      {/* Top Image Chamber */}
      <div className="h-52 sm:h-60 md:h-64 w-full relative bg-white/[0.04] overflow-hidden">
        <ShimmerOverlay />
        
        {/* Floating Top Left Badge */}
        <div className="absolute top-3 left-3 w-20 h-6 rounded-full bg-white/[0.08]" />

        {/* Floating Top Right Bookmark Circle */}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/[0.08]" />

        {/* Floating Bottom Left Price Pill */}
        <div className="absolute bottom-3 left-3 w-28 h-8 rounded-xl bg-white/[0.09]" />
      </div>

      {/* Card Content Chamber */}
      <div className="p-5 flex-1 flex flex-col justify-between relative overflow-hidden space-y-4">
        <ShimmerOverlay />

        <div>
          {/* Rating & Review Placeholder */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-14 h-4 rounded-md bg-white/[0.07]" />
            <div className="w-20 h-3 rounded-md bg-white/[0.04]" />
          </div>

          {/* Listing Title Lines */}
          <div className="h-5 w-4/5 rounded-md bg-white/[0.09] mb-2" />
          <div className="h-3.5 w-3/5 rounded-md bg-white/[0.05] mb-3" />

          {/* Location Row */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3.5 h-3.5 rounded-full bg-white/[0.08]" />
            <div className="h-3.5 w-2/3 rounded-md bg-white/[0.05]" />
          </div>

          {/* Feature Pills */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 rounded-lg bg-white/[0.05]" />
            <div className="h-5 w-14 rounded-lg bg-white/[0.05]" />
            <div className="h-5 w-20 rounded-lg bg-white/[0.05]" />
          </div>
        </div>

        {/* Card Footer Divider and Action Button */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="h-4 w-24 rounded-md bg-white/[0.05]" />
          <div className="h-8 w-24 rounded-xl bg-cyan-500/15 border border-cyan-400/20" />
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Student Marketplace Card Skeleton
 * Matches MarketplaceCard.tsx dimensions exactly
 */
export const MarketplaceCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden flex flex-col h-full relative shadow-lg">
      {/* Top Image Chamber */}
      <div className="h-48 w-full bg-white/[0.04] relative overflow-hidden">
        <ShimmerOverlay />
        {/* Condition Tag on top right */}
        <div className="absolute top-3 right-3 w-20 h-5 rounded-md bg-white/[0.08]" />
      </div>

      {/* Content Chamber */}
      <div className="p-4 flex-1 flex flex-col justify-between relative overflow-hidden space-y-3">
        <ShimmerOverlay />

        <div>
          {/* Title Placeholder */}
          <div className="h-4 w-3/4 rounded-md bg-white/[0.09] mb-2" />
          
          {/* Price & Original Price */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="h-5 w-20 rounded-md bg-cyan-400/20" />
            <div className="h-3.5 w-14 rounded-md bg-white/[0.05]" />
          </div>

          {/* Location / Area */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-3 h-3 rounded-full bg-white/[0.07]" />
            <div className="h-3 w-28 rounded-md bg-white/[0.05]" />
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-2 border-t border-white/5 flex items-center gap-2">
          <div className="h-9 flex-1 rounded-xl bg-white/[0.06]" />
          <div className="h-9 w-9 rounded-xl bg-emerald-500/15" />
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Flatmate / Roommate Card Skeleton
 * Matches RoommateCard.tsx dimensions exactly
 */
export const RoommateCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-full shadow-lg">
      <ShimmerOverlay />

      <div>
        {/* Header with Avatar & Name */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] relative shrink-0" />
            <div>
              <div className="h-4 w-28 rounded-md bg-white/[0.09] mb-1.5" />
              <div className="h-3 w-36 rounded-md bg-white/[0.05]" />
            </div>
          </div>
          {/* Status Badge */}
          <div className="w-16 h-5 rounded-full bg-white/[0.06]" />
        </div>

        {/* Target Exam Badge */}
        <div className="w-24 h-5 rounded-full bg-white/[0.06] mb-3" />

        {/* Budget Bar Container */}
        <div className="h-14 w-full rounded-2xl bg-white/[0.04] p-3 mb-3.5 flex items-center justify-between">
          <div className="w-20 h-4 rounded-md bg-white/[0.06]" />
          <div className="w-24 h-5 rounded-md bg-cyan-400/20" />
        </div>

        {/* Habits Pills Row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-20 rounded-xl bg-white/[0.05]" />
          <div className="h-6 w-16 rounded-xl bg-white/[0.05]" />
          <div className="h-6 w-14 rounded-xl bg-white/[0.05]" />
        </div>
      </div>

      {/* Action Connect Button */}
      <div className="h-10 w-full rounded-xl bg-cyan-500/15 border border-cyan-400/20 mt-2" />
    </div>
  );
};

/**
 * 4. Responsive Grid Wrappers
 */
export const ListingsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <ListingCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const MarketplaceGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <MarketplaceCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const RoommatesGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <RoommateCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * 5. Full Route / Page Transition Skeleton (Replaces generic spinning circle)
 */
export const PageTransitionSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Hero Header Skeleton */}
      <div className="rounded-3xl p-6 sm:p-8 border border-white/10 bg-white/[0.02] relative overflow-hidden space-y-4">
        <ShimmerOverlay />
        <div className="w-28 h-6 rounded-full bg-cyan-400/15" />
        <div className="h-8 sm:h-10 w-2/3 max-w-md rounded-xl bg-white/[0.09]" />
        <div className="h-4 w-4/5 max-w-lg rounded-md bg-white/[0.05]" />
      </div>

      {/* Grid of Skeleton Cards */}
      <ListingsGridSkeleton count={6} />
    </div>
  );
};
