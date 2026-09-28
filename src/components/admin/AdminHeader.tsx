import React from 'react';
import { 
  Building2, Search, Bell, Sparkles, ExternalLink, 
  LogOut, RefreshCw, PlusCircle, Shield, Radio, CheckCircle2,
  AlertTriangle, Eye, ArrowUpRight
} from 'lucide-react';
import { UserProfile, isSuperAdminEmail } from '../../types';

interface AdminHeaderProps {
  userProfile: UserProfile | null;
  pendingCount: number;
  totalListings: number;
  totalUsers: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  onSwitchToStudentView: () => void;
  onOpenCreateListing: () => void;
  onLogout: () => void;
  loading: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  userProfile,
  pendingCount,
  totalListings,
  totalUsers,
  searchQuery,
  onSearchChange,
  onRefresh,
  onSwitchToStudentView,
  onOpenCreateListing,
  onLogout,
  loading,
}) => {
  const isSuper = isSuperAdminEmail(userProfile?.email);

  return (
    <header className="sticky top-0 z-40 bg-[#07090E]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-[1920px] mx-auto">
        
        {/* Brand & Console Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#8A2BE2] shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              <Building2 className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#07090E]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white tracking-wider">Studolink</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                OPS CONSOLE
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Radio className="w-3 h-3 animate-pulse" />
                Live Cloud Sync
              </span>
              <span>•</span>
              <span className="text-gray-400">{totalListings} Listings</span>
              <span>•</span>
              <span className="text-gray-400">{totalUsers} Users</span>
            </div>
          </div>
        </div>

        {/* Global Quick Search Palette */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00E5FF]/30 to-[#8A2BE2]/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-white/10 group-focus-within:border-[#00E5FF]/50 rounded-xl px-3 py-2 transition-colors">
              <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#00E5FF] transition-colors shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search listings, student users, marketplace items..."
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="text-xs text-gray-500 hover:text-white px-1.5 py-0.5 rounded bg-white/10 ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Actions & Profile Suite */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Pending Alerts Pill */}
          {pendingCount > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{pendingCount} Pending Approvals</span>
            </div>
          )}

          {/* Quick Refresh */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh database records"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#00E5FF]' : ''}`} />
          </button>

          {/* Create Listing Shortcut */}
          <button
            onClick={onOpenCreateListing}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF]/20 to-[#8A2BE2]/20 hover:from-[#00E5FF]/30 hover:to-[#8A2BE2]/30 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add Listing</span>
          </button>

          {/* Switch to Student Portal Preview Mode */}
          <button
            onClick={onSwitchToStudentView}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white text-xs font-bold transition-all shadow-sm active:scale-95 group"
            title="Preview how normal students experience the app"
          >
            <Eye className="w-3.5 h-3.5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Student View</span>
            <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-white" />
          </button>

          {/* Admin Profile Pill & Logout Action */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8A2BE2] flex items-center justify-center text-black font-black text-xs shadow-md shrink-0">
              {userProfile?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden xl:block text-left leading-tight mr-1">
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{userProfile?.name || 'Administrator'}</p>
              <p className="text-[10px] font-semibold text-[#00E5FF] tracking-wider uppercase">
                {isSuper ? 'Super Admin' : 'Admin'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-100 border border-rose-500/30 hover:border-rose-500/50 transition-all active:scale-95 text-xs font-bold cursor-pointer shadow-sm"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
