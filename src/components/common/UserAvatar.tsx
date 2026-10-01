import React, { useState } from 'react';

interface UserAvatarProps {
  photoURL?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoURL,
  name,
  email,
  size = 'sm',
  className = '',
  showGlow = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Derive initial letter from name or email
  const displayName = name || email || 'User';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.sm;

  const hasPhoto = photoURL && !imgError;

  return (
    <div
      className={`relative rounded-full p-[1.5px] bg-gradient-to-tr from-[#00E5FF] via-[#8A2BE2] to-[#F5B731] shrink-0 ${
        showGlow ? 'shadow-[0_0_10px_rgba(0,229,255,0.35)] hover:shadow-[0_0_16px_rgba(0,229,255,0.55)]' : ''
      } transition-all duration-300 ${className}`}
    >
      <div
        className={`${selectedSizeClass} rounded-full bg-slate-900 border border-white/20 flex items-center justify-center overflow-hidden relative select-none`}
      >
        {hasPhoto ? (
          <img
            src={photoURL}
            alt={displayName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top rounded-full"
          />
        ) : (
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00E5FF] via-white to-[#8A2BE2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {initial}
          </span>
        )}
      </div>
    </div>
  );
};
