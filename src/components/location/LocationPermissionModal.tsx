import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Loader2, 
  CheckCircle2,
  MapPin
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
    // Show friendly onboarding-style permission dialog on first open if location is not set yet
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
      setHasError('Could not detect GPS. You can choose your city manually below.');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="location-permission-modal-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Friendly Illustrated Permission Card (Exact Reference Design) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-sm sm:max-w-[390px] bg-[#0F1420] border border-white/10 rounded-[38px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden z-10 p-7 sm:p-9 text-center"
          >
            {/* Ambient Background Glow behind Card */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-gradient-to-b from-amber-400/15 via-rose-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Subtle Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success State */}
            {successDetectedCity ? (
              <motion.div 
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-6 text-center space-y-3"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-white">Location Enabled!</h3>
                <p className="text-xs sm:text-sm text-cyan-300 font-semibold">
                  Personalized for student habitats near <strong className="text-white underline">{successDetectedCity}</strong>
                </p>
              </motion.div>
            ) : (
              <div className="relative z-10 flex flex-col items-center">
                {/* Centerpiece: Glowing Badge with Illustrated Pin and 4-point Sparkles */}
                <div className="relative w-36 h-36 mx-auto mb-5 flex items-center justify-center select-none">
                  {/* Outer Ambient Glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/25 via-orange-500/20 to-rose-500/15 blur-xl animate-pulse" />

                  {/* Main Warm Circle Badge */}
                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#FFF5D1] via-[#FFE28A] to-[#FFC738] shadow-[0_12px_35px_rgba(255,184,0,0.35)] flex items-center justify-center border-4 border-white/20">
                    {/* Illustrated 3D-effect Location Pin */}
                    <div className="relative flex items-center justify-center transform hover:scale-105 transition-transform">
                      <svg
                        className="w-16 h-16 drop-shadow-[0_8px_12px_rgba(217,119,6,0.45)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Pin Body */}
                        <path
                          d="M12 2C8.134 2 5 5.134 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.134 15.866 2 12 2Z"
                          fill="url(#pin_gradient)"
                          stroke="#E11D48"
                          strokeWidth="1.2"
                        />
                        {/* Pin Hole */}
                        <circle cx="12" cy="9" r="3.2" fill="#FFF5D1" stroke="#E11D48" strokeWidth="0.8" />
                        <defs>
                          <linearGradient id="pin_gradient" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FBBF24" />
                            <stop offset="0.6" stopColor="#F59E0B" />
                            <stop offset="1" stopColor="#EA580C" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* 4-Point Floating Sparkle Stars (Exact Match to Screenshot) */}
                  {/* Top-Right Star */}
                  <span className="absolute top-2 right-4 text-[#F97316] text-sm animate-bounce">✦</span>
                  {/* Bottom-Right Star */}
                  <span className="absolute bottom-3 right-3 text-[#E11D48] text-base animate-pulse">✦</span>
                  {/* Top-Left Star */}
                  <span className="absolute top-4 left-4 text-[#F59E0B] text-xs">✦</span>
                  {/* Bottom-Left Star */}
                  <span className="absolute bottom-4 left-5 text-[#FB923C] text-xs">✦</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-[26px] font-black tracking-tight text-white mb-2">
                  Enable Location
                </h2>

                {/* Friendly Benefit Description */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-[280px] mx-auto mb-6">
                  Allow location so you can discover verified student PGs, hygienic mess & 24/7 quiet libraries closest to your coaching.
                </p>

                {hasError && (
                  <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 py-2 px-3 rounded-xl mb-4 text-center w-full">
                    {hasError}
                  </p>
                )}

                {/* Primary Button: Vibrant "Allow" CTA */}
                <button
                  type="button"
                  onClick={handleAllowLocation}
                  disabled={isLoadingLocation}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-[#FF2D55] via-[#FF3B65] to-[#E61E4D] hover:brightness-110 active:scale-[0.98] text-white font-black text-base tracking-wide transition-all shadow-[0_10px_25px_rgba(255,45,85,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <span>Allow</span>
                  )}
                </button>

                {/* Secondary Actions: "Maybe later" & "Select City Manually" */}
                <div className="mt-4 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer py-1"
                  >
                    Maybe later
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectCityManually}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Or choose city manually</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
