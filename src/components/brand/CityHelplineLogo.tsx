import React from 'react';

interface CityHelplineLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const CityHelplineLogo: React.FC<CityHelplineLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  glow = true,
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-sm' },
    sm: { icon: 'w-8 h-8', text: 'text-base' },
    md: { icon: 'w-10 h-10', text: 'text-lg' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl' },
    xl: { icon: 'w-20 h-20', text: 'text-3xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 3D Icon Container with Realistic Glassmorphism & Neon Glow */}
      <div className={`relative ${currentSize.icon} shrink-0 group`}>
        {glow && (
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-[#00E5FF] via-[#8A2BE2] to-[#FFD700] opacity-40 blur-md group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />
        )}
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_15px_rgba(245,183,49,0.35)] transition-transform duration-300 group-hover:scale-105 active:scale-95">
          <img
            src="/logo.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo.svg';
            }}
            alt="Studolink Official 3D Logo"
            className="w-full h-full object-contain filter drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-white tracking-tight ${currentSize.text} leading-none`}>
              Studo<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2]">link</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              3D
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">
            Your City. Your Student Ecosystem.
          </span>
        </div>
      )}
    </div>
  );
};

export const StudolinkLogo = CityHelplineLogo;
