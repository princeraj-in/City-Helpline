import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, LucideIcon } from 'lucide-react';

interface PersonalPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon?: LucideIcon;
  iconColor?: string;
  exitUrl?: string;
  backLabel?: string;
  onClose?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const PersonalPageHeader: React.FC<PersonalPageHeaderProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20',
  icon: Icon,
  iconColor = 'text-[#00E5FF]',
  exitUrl = '/',
  backLabel = 'Back',
  onClose,
  rightAction,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (exitUrl && exitUrl !== '/') {
      navigate(exitUrl);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else if (exitUrl) {
      navigate(exitUrl);
    } else {
      navigate('/');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (exitUrl && exitUrl !== '/') {
      navigate(exitUrl);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else if (exitUrl) {
      navigate(exitUrl);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      className={`sticky top-16 z-30 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Side: Back Button & Title Info */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go Back"
            title="Go Back (Peeche jayein)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] active:scale-95 border border-white/10 text-gray-300 hover:text-white transition-all text-xs font-bold cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#00E5FF]" />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>

          {Icon && (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight truncate">
                {title}
              </h1>
              {badge && (
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}
                >
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium truncate max-w-xs sm:max-w-md md:max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Optional Actions + Dedicated X Close / Exit Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {rightAction}

          {/* High-visibility circular X Close / Cut Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close and return"
            title="Cut / Close (Bahar niklein)"
            className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.07] hover:bg-rose-500/20 active:scale-90 border border-white/15 hover:border-rose-400/50 text-gray-300 hover:text-rose-300 transition-all duration-200 shadow-lg cursor-pointer"
          >
            <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
            <span className="sr-only">Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
