import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  X, 
  Loader2, 
  Crosshair,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useLocationContext } from '../../contexts/LocationContext';

export function LocationPermissionModal() {
  const { 
    userLocation, 
    isLoadingLocation, 
    requestLiveLocation, 
    openLocationModal,
    hasPrompted 
  } = useLocationContext();

  const [isOpen, setIsOpen] = useState(false);
  const [successDetectedCity, setSuccessDetectedCity] = useState<string | null>(null);
  const [hasError, setHasError] = useState<string | null>(null);

  useEffect(() => {
    // Show modern Android-style permission dialog on first open if location is not set yet
    if (!userLocation && !hasPrompted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [userLocation, hasPrompted]);

  const handleAllowLocation = async () => {
    setHasError(null);
    const loc = await requestLiveLocation(false);
    if (loc) {
      setSuccessDetectedCity(loc.city);
      setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    } else {
      setHasError('Could not fetch GPS. You can select your city manually below.');
    }
  };

  const handleSelectCityManually = () => {
    setIsOpen(false);
    openLocationModal();
  };

  const handleDismiss = () => {
    localStorage.setItem('studolink_location_prompted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        {/* Android Material-3 Inspired Bottom Sheet / Card */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '100%', opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#0E131F] border border-cyan-500/30 rounded-t-[36px] sm:rounded-[36px] shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Subtle Android Drag Handle (Mobile) */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5 sm:hidden" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success State Animation */}
          {successDetectedCity ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">Location Detected!</h3>
                <p className="text-sm font-semibold text-[#00E5FF]">
                  Showing hostels, PGs & libraries near <span className="text-white font-bold">{successDetectedCity}</span>
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Header with Pulsing Radar Icon */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8A2BE2]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.3)]">
                    <Crosshair className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00E5FF]" />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[11px] font-bold text-[#00E5FF] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Android Location Access
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Find Student Habitats Near You
                  </h2>
                </div>
              </div>

              {/* Description Body */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Allow Studolink to access your device&apos;s location to automatically find verified student PGs, silent 24/7 libraries, and hygienic mess services in your coaching locality.
              </p>

              {/* Android Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/15 flex items-center justify-center text-[#00E5FF] shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Nearest PGs</div>
                    <div className="text-[10px] text-gray-400">0% Brokerage</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Study Hubs</div>
                    <div className="text-[10px] text-gray-400">1–3 km radius</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">100% Private</div>
                    <div className="text-[10px] text-gray-400">Zero phone leak</div>
                  </div>
                </div>
              </div>

              {hasError && (
                <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-center">
                  {hasError}
                </p>
              )}

              {/* Android System Style Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {/* 1. Primary Action: While using the app (Live GPS) */}
                <button
                  type="button"
                  onClick={handleAllowLocation}
                  disabled={isLoadingLocation}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#38bdf8] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Detecting Precise Location...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 fill-black" />
                      <span>While using the app (Allow Precise Location)</span>
                    </>
                  )}
                </button>

                {/* 2. Secondary Action: Select City Manually */}
                <button
                  type="button"
                  onClick={handleSelectCityManually}
                  className="w-full py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#00E5FF]" />
                  <span>Choose City Manually (Kota, Patna, Delhi, Nawada...)</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </button>

                {/* 3. Dismiss Option */}
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full py-2 text-center text-xs text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                >
                  Don&apos;t ask again / Browse all cities
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
