import React, { useState } from 'react';
import { History, Shield, CheckCircle2, XCircle, Ban, Star, Trash2, UserCheck, RefreshCw, Download, Tag } from 'lucide-react';

export interface AuditLogEntry {
  id: string;
  actorUid?: string;
  actorEmail?: string;
  action: 'approve_listing' | 'reject_listing' | 'toggle_featured' | 'delete_listing' | 'change_role' | 'ban_user' | 'unban_user' | 'broadcast_update' | string;
  targetId?: string;
  targetUid?: string;
  details: string;
  actor?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface AdminAuditTabProps {
  logs: AuditLogEntry[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AdminAuditTab: React.FC<AdminAuditTabProps> = ({ logs, onRefresh, isLoading }) => {
  const [filterAction, setFilterAction] = useState<string>('all');

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approve_listing':
      case 'approve_pg_badge':
      case 'approve_student_badge':
        return <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />;
      case 'reject_listing':
      case 'reject_pg_badge':
      case 'reject_student_badge':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'toggle_featured':
        return <Star className="w-4 h-4 text-[#8A2BE2]" />;
      case 'ban_user':
      case 'unban_user':
        return <Ban className="w-4 h-4 text-amber-400" />;
      case 'delete_listing':
      case 'delete_user':
        return <Trash2 className="w-4 h-4 text-rose-400" />;
      case 'change_role':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Shield className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('approve')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (action.includes('reject') || action.includes('delete')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    if (action.includes('ban')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (action.includes('role')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  };

  const exportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `studolink_audit_trail_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = filterAction === 'all' 
    ? logs 
    : logs.filter(l => l.action.toLowerCase().includes(filterAction.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            Tamper-Proof Audit Trail (Firestore Persistent)
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#00E5FF]" />
            Administrative Operations & Security Trail
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Immutable log of role updates, listing moderation, security bans, and administrative actions stored securely in Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}

          {logs.length > 0 && (
            <button
              onClick={exportAuditLogs}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {['all', 'role', 'approve', 'reject', 'ban', 'delete'].map(chip => (
          <button
            key={chip}
            onClick={() => setFilterAction(chip)}
            className={`px-3 py-1.5 rounded-xl border capitalize transition-all shrink-0 ${
              filterAction === chip
                ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF] font-bold shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {chip === 'all' ? 'All Operations' : chip}
          </button>
        ))}
        <span className="text-gray-500 text-xs ml-auto shrink-0 font-mono">
          Showing {filteredLogs.length} of {logs.length} records
        </span>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const actorDisplay = log.actorEmail || log.actor || 'Admin';
          const target = log.targetId || log.targetUid;

          return (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                  {getActionIcon(log.action)}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getActionBadgeColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <p className="text-xs font-semibold text-white break-words">{log.details}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                    <span>
                      Actor: <strong className="text-gray-200 font-mono">{actorDisplay}</strong>
                      {log.actorUid && <span className="text-gray-500 text-[10px] ml-1">({log.actorUid.substring(0, 8)}...)</span>}
                    </span>

                    {target && (
                      <span className="inline-flex items-center gap-1 text-cyan-400/90 font-mono text-[10px] bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                        <Tag className="w-2.5 h-2.5" />
                        Target: {target.length > 20 ? `${target.substring(0, 16)}...` : target}
                      </span>
                    )}
                  </div>

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="text-[10px] font-mono text-gray-500 bg-black/30 px-2 py-1 rounded border border-white/5 inline-block">
                      Metadata: {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-gray-400 font-mono block">
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
                <span className="text-[10px] text-gray-500 font-mono block">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="py-16 text-center rounded-3xl bg-white/[0.01] border border-dashed border-white/10 text-gray-500">
            <History className="w-10 h-10 mx-auto mb-2 opacity-40 text-cyan-400" />
            <p className="text-sm font-bold text-white">No Moderation Events Found</p>
            <p className="text-xs text-gray-500 mt-1">
              Administrative operations performed by authorized admins are logged here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
