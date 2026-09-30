import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowColor = 'rgba(0, 229, 255, 0.1)',
  intensity = 'medium',
  ...props
}) => {
  const getIntensityStyles = () => {
    switch (intensity) {
      case 'low':
        return 'bg-[#0E131F]/60 backdrop-blur-sm border-white/5';
      case 'high':
        return 'bg-[#0E131F]/90 backdrop-blur-lg border-white/15';
      case 'medium':
      default:
        return 'bg-[#0E131F]/75 backdrop-blur-md border-white/10';
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border shadow-[0_4px_24px_rgba(0,0,0,0.35)] group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_35px_rgba(0,229,255,0.15)] hover:border-white/20',
        getIntensityStyles(),
        className
      )}
      style={{
        transform: 'translateZ(0)',
      }}
      {...props}
    >
      {/* Subtle top reflection */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
