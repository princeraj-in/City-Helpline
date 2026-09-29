import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, MapPin, 
  Megaphone, History, ChevronRight, Sparkles, ShieldCheck,
  ChevronLeft, Layers, ExternalLink, LogOut
} from 'lucide-react';

export type AdminTab = 
  | 'overview' 
  | 'listings' 
  | 'users' 
  | 'marketplace' 
  | 'hubs' 
  | 'broadcast' 
  | 'audit';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingCount: number;
  totalListingsCount: number;
  totalUsersCount: number;
  totalMarketplaceCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  totalListingsCount,
  totalUsersCount,
  totalMarketplaceCount,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
    description: string;
  }> = [
    {
      id: 'overview',
      label: 'Command Center',
      icon: LayoutDashboard,
      description: 'Platform KPIs & Telemetry',
    },
    {
      id: 'listings',
      label: 'Listings Directory',
      icon: Building2,
      badge: pendingCount > 0 ? pendingCount : totalListingsCount,
      badgeColor: pendingCount > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-white/10 text-gray-300 border-white/10',
      description: 'Review PGs, Mess & Libraries',
    },
    {
      id: 'users',
      label: 'User & RBAC Access',
      icon: Users,
      badge: totalUsersCount,
      badgeColor: 'bg-white/10 text-gray-300 border-white/10',
      description: 'Roles, Contributors, Bans',
    },
    {
      id: 'marketplace',
      label: 'Student Marketplace',
      icon: ShoppingBag,
      badge: totalMarketplaceCount,
      badgeColor: 'bg-white/10 text-gray-300 border-white/10',
      description: 'Books, cycles, room goods',
    },
    {
      id: 'hubs',
      label: 'Educational Hubs',
      icon: MapPin,
      badge: '8 Hubs',
      badgeColor: 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30',
      description: 'Kota, Patna, Delhi, Sikar...',
    },
    {
      id: 'broadcast',
      label: 'System Broadcasts',
      icon: Megaphone,
      badge: 'Active',
      badgeColor: 'bg-[#8A2BE2]/20 text-[#8A2BE2] border-[#8A2BE2]/40',
      description: 'Global Student Alerts',
    },
    {
      id: 'audit',
      label: 'Audit & Activity Log',
      icon: History,
      description: 'Real-time moderation audit',
    },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col bg-[#07090E]/95 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Sidebar Header / Section Tag */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-xs font-black tracking-wider uppercase text-gray-400">
              Operations Control
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/10 ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full group relative flex items-center gap-3.5 p-3 rounded-2xl transition-all text-left ${
                isActive
                  ? 'bg-gradient-to-r from-[#00E5FF]/20 via-[#8A2BE2]/15 to-transparent text-white border border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.15)] font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00E5FF] rounded-r-full shadow-[0_0_10px_#00E5FF]" />
              )}

              {/* Icon */}
              <div 
                className={`p-2 rounded-xl transition-all shrink-0 ${
                  isActive 
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]' 
                    : 'bg-white/5 text-gray-400 group-hover:text-[#00E5FF] group-hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>

              {/* Text & Badges (when expanded) */}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold truncate group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-wider shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 font-normal truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Info Card */}
      {!isCollapsed && (
        <div className="p-3.5 border-t border-white/5 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
            <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
            <span>Admin Guardrail</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            All approvals, status updates and user bans sync directly to Cloud Firestore in real time.
          </p>
          <Link
            to="/legal?from=admin"
            className="mt-2 text-[10px] font-bold text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Compliance & Legal Docs</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Logout Action at bottom of Sidebar */}
      {onLogout && (
        <div className="p-3 border-t border-white/10 mt-auto">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 border border-rose-500/25 transition-all text-xs font-bold active:scale-95 cursor-pointer shadow-sm ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Sign Out of Admin Console"
          >
            <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <span className="block font-bold">Log Out Admin</span>
                <span className="block text-[10px] text-rose-400/80 font-normal">End session</span>
              </div>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};
