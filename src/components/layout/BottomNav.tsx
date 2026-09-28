import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, PlusCircle, User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { UserAvatar } from '../common/UserAvatar';

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  const { currentUser, userProfile, isAdmin } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Services', path: '/search' },
    { icon: PlusCircle, label: 'List', path: '/add-listing', isSpecial: true },
    { icon: ShoppingBag, label: 'Market', path: '/marketplace' },
    { 
      icon: isAdmin ? ShieldCheck : User, 
      label: isAdmin ? 'Admin' : 'Profile', 
      path: isAdmin ? '/admin' : '/profile',
      isProfile: !isAdmin && !!currentUser
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full glass-bottom-nav z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-16 h-full min-h-[44px] py-1 select-none active:scale-95 transition-transform group"
              >
                <div className="w-10 h-10 -mt-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.6)] border-2 border-[#0B0F1A] group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5 text-slate-950 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-[#00E5FF] tracking-tight mt-0.5">
                  + List
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (item.path === '/admin') {
                  localStorage.setItem('admin_view_mode', 'admin');
                  window.dispatchEvent(new Event('admin_mode_change'));
                }
              }}
              className="relative flex flex-col items-center justify-center w-16 h-full min-h-[44px] py-1 select-none active:scale-95 transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 w-10 h-1 bg-[#00E5FF] rounded-b-full shadow-[0_0_10px_rgba(0,229,255,0.6)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {item.isProfile ? (
                <div className="mb-0.5 mt-0.5">
                  <UserAvatar
                    photoURL={userProfile?.photoURL || currentUser?.photoURL}
                    name={userProfile?.name || currentUser?.displayName}
                    email={userProfile?.email || currentUser?.email}
                    size="xs"
                    showGlow={isActive}
                  />
                </div>
              ) : (
                <Icon
                  className={`h-5 w-5 mb-1 transition-colors ${
                    isActive ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : 'text-gray-400'
                  }`}
                />
              )}
              <span
                className={`text-[10px] font-semibold tracking-tight transition-colors ${
                  isActive ? 'text-[#00E5FF]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
