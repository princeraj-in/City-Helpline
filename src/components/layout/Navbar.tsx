import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, ShieldCheck, Search, Home, ShoppingBag, Calculator, Bot, BedDouble, HelpCircle } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { NavbarChatButton } from './NavbarChatButton';
import { LanguageSelector } from '../common/LanguageSelector';

export function Navbar() {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#E5AA38]/40 via-transparent to-[#38BDF8]/40 border border-[#F5B731]/40 group-hover:border-[#FFE58F] transition-all duration-300 shadow-[0_0_15px_rgba(229,170,56,0.25)] group-hover:shadow-[0_0_24px_rgba(245,183,49,0.5)] group-hover:scale-105 active:scale-95">
                <img
                  src="/logo.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                  }}
                  alt="Studolink 3D Logo"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-xl font-black text-white tracking-tight whitespace-nowrap">
                    Studo<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2]">link</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-black tracking-wider uppercase rounded-full bg-[#F5B731]/10 text-[#F5B731] border border-[#F5B731]/30 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B731] animate-pulse" />
                    OFFICIAL
                  </span>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/') ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/search"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/search') ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
            >
              <Search className="h-4 w-4" />
              <span>Services</span>
            </Link>
            <Link
              to="/marketplace"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors relative ${isActive('/marketplace') ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
            >
              <ShoppingBag className="h-4 w-4 text-[#00E5FF]" />
              <span>Marketplace</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white uppercase tracking-wider shadow-sm">
                New
              </span>
            </Link>
            <Link
              to="/roommates"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/roommates') ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
            >
              <BedDouble className="h-4 w-4 text-[#00E5FF]" />
              <span>Roommates</span>
            </Link>
            <Link
              to="/budget"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/budget') || isActive('/budget-calculator') ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
            >
              <Calculator className="h-4 w-4" />
              <span>Budget</span>
            </Link>
            <Link
              to="/chat"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors relative ${isActive('/chat') ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
            >
              <Bot className="h-4 w-4 text-[#00E5FF]" />
              <span>AI Mitra</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-gradient-to-r from-[#8A2BE2] to-[#00E5FF] text-white uppercase tracking-wider shadow-sm">
                AI
              </span>
            </Link>

            <Link
              to="/help"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/help') ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </Link>

            {/* Desktop Premium Chat Icon */}
            <NavbarChatButton />

            {/* Language Switcher */}
            <LanguageSelector variant="compact" />

            {currentUser ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => {
                      localStorage.setItem('admin_view_mode', 'admin');
                      window.dispatchEvent(new Event('admin_mode_change'));
                    }}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/admin') ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span className="hidden sm:inline">Admin Console</span>
                  </Link>
                )}

                <div className="flex items-center gap-3 ml-1 pl-4 border-l border-white/10">
                  <Link to="/profile" className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-white transition-colors group">
                    <UserAvatar
                      photoURL={userProfile?.photoURL || currentUser?.photoURL}
                      name={userProfile?.name || currentUser?.displayName}
                      email={userProfile?.email || currentUser?.email}
                      size="sm"
                    />
                    <span className="hidden sm:inline font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                      {userProfile?.name || 'Profile'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-[#FF3B3B] transition-colors rounded-full hover:bg-[rgba(255,255,255,0.06)] cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="golden-wrapper">
                  <Link
                    to="/login"
                    className="golden-button flex items-center justify-center"
                  >
                    LOGIN
                  </Link>
                </div>
                <div className="golden-wrapper">
                  <Link
                    to="/signup"
                    className="golden-button flex items-center justify-center"
                  >
                    SIGN UP
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Right Action */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Premium Chat Icon (Strictly NO text, pure logo with glowing badge) */}
            <NavbarChatButton isMobile />

            <Link
              to="/help"
              className={`p-1.5 rounded-xl border transition-colors ${
                isActive('/help') 
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40' 
                  : 'bg-white/[0.04] text-gray-400 border-white/10 hover:text-white'
              }`}
              title="Help & Support"
            >
              <HelpCircle className="h-4 w-4" />
            </Link>

            {currentUser ? (
              <Link 
                to="/profile" 
                className="flex items-center justify-center p-0.5 active:scale-95 transition-transform"
                title={userProfile?.name || currentUser?.email || "Profile"}
              >
                <UserAvatar
                  photoURL={userProfile?.photoURL || currentUser?.photoURL}
                  name={userProfile?.name || currentUser?.displayName}
                  email={userProfile?.email || currentUser?.email}
                  size="sm"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[rgba(255,255,255,0.06)] border border-white/10 text-white hover:border-[#00E5FF]/40 transition-colors"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
