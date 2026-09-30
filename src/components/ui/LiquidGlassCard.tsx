import React from 'react';
import { cn } from '../../lib/utils';

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  interactive?: boolean;
  overflowVisible?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className,
  glowColor = 'rgba(0, 229, 255, 0.2)',
  interactive = true,
  overflowVisible = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative rounded-3xl transition-all duration-300 select-none',
        overflowVisible ? 'overflow-visible' : 'overflow-hidden',
        'bg-[#0E131F]/80 backdrop-blur-md',
        'border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        interactive && 'hover:border-[#00E5FF]/40 hover:shadow-[0_12px_40px_rgba(0,229,255,0.15)] hover:-translate-y-1',
        className
      )}
      style={{
        transform: 'translateZ(0)',
      }}
      {...props}
    >
      {/* Subtle top glare */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />

      {/* Content Container */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
};
