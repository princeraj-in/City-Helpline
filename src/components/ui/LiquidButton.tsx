import React from 'react';
import { cn } from '../../lib/utils';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  glowColor?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  variant = 'primary',
  glowColor,
  children,
  className,
  isLoading,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#00E5FF]/20 to-[#8A2BE2]/20 border-[#00E5FF]/50 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[#00E5FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.35)]';
      case 'secondary':
        return 'bg-[rgba(255,255,255,0.05)] border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/10 hover:border-white/30';
      case 'danger':
        return 'bg-[#FF3B3B]/20 border-[#FF3B3B]/50 text-[#FF3B3B] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#FF3B3B]/30';
      case 'ghost':
        return 'bg-transparent border-transparent text-gray-300 hover:text-white hover:bg-white/5';
      default:
        return 'bg-[rgba(255,255,255,0.05)] border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]';
    }
  };

  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-[40px] px-6 py-3 font-medium backdrop-blur-sm border transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        getVariantStyles(),
        className
      )}
      style={{
        transform: 'translateZ(0)',
      }}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </span>
    </button>
  );
};
