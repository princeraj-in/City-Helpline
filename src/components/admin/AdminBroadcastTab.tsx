import React, { useState, useEffect } from 'react';
import { Megaphone, CheckCircle2, AlertTriangle, Info, Eye, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface SystemBroadcast {
  enabled: boolean;
  message: string;
  type: 'info' | 'warning' | 'success';
  actionText?: string;
  actionUrl?: string;
  updatedAt: number;
}

export const DEFAULT_BROADCAST: SystemBroadcast = {
  enabled: true,
  message: 'Exam Season 24/7 Helpline is Live! Verified student PGs and food meal facilities across Kota, Patna & Delhi.',
  type: 'info',
  actionText: 'Explore Verified PGs',
  actionUrl: '/search',
  updatedAt: Date.now(),
};

export const AdminBroadcastTab: React.FC = () => {
  const [broadcast, setBroadcast] = useState<SystemBroadcast>(() => {
    const saved = localStorage.getItem('systemBroadcast');
    return saved ? JSON.parse(saved) : DEFAULT_BROADCAST;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...broadcast, updatedAt: Date.now() };
    localStorage.setItem('systemBroadcast', JSON.stringify(updated));
    setBroadcast(updated);
    toast.success('System broadcast updated and pushed to student portal');
  };

  return (
    <div className="max-w-3xl space-y-6">
      
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Megaphone className="w-5 h-5 text-[#8A2BE2]" />
          Platform System Broadcast Manager
        </h3>
        <p className="text-xs text-gray-400">
          Publish real-time announcement banners to all students visiting Studolink.
        </p>
      </div>

      {/* Live Preview */}
      <div className="p-5 rounded-3xl bg-black/40 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#00E5FF]" /> Live Student Portal Preview
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
            broadcast.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-gray-400'
          }`}>
            {broadcast.enabled ? 'Banner Active' : 'Banner Disabled'}
          </span>
        </div>

        {broadcast.enabled ? (
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            broadcast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' :
            broadcast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' :
            'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {broadcast.type === 'warning' ? <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" /> :
               broadcast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> :
               <Info className="w-4 h-4 shrink-0 text-[#00E5FF]" />}
              <span className="truncate">{broadcast.message}</span>
            </div>
            {broadcast.actionText && (
              <span className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold shrink-0">
                {broadcast.actionText} &rarr;
              </span>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-gray-500">
            Banner is currently toggled OFF and hidden from students.
          </div>
        )}
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-5">
        
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div>
            <p className="text-sm font-bold text-white">Display Broadcast to Students</p>
            <p className="text-xs text-gray-400">Toggle whether the announcement ribbon is visible at top of student app</p>
          </div>
          <button
            type="button"
            onClick={() => setBroadcast(b => ({ ...b, enabled: !b.enabled }))}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${
              broadcast.enabled ? 'bg-[#00E5FF]' : 'bg-white/15'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-black transition-transform ${
              broadcast.enabled ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300">Announcement Message</label>
          <textarea
            rows={3}
            value={broadcast.message}
            onChange={(e) => setBroadcast(b => ({ ...b, message: e.target.value }))}
            required
            placeholder="Type your message to students..."
            className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/50 leading-relaxed"
          />
        </div>

        {/* Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300">Style / Alert Severity</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'info', label: 'Cyan / General Info', color: 'border-[#00E5FF]/40 text-[#00E5FF]' },
              { id: 'warning', label: 'Amber / Urgent Alert', color: 'border-amber-500/40 text-amber-300' },
              { id: 'success', label: 'Emerald / Good News', color: 'border-emerald-500/40 text-emerald-400' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setBroadcast(b => ({ ...b, type: t.id as any }))}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                  broadcast.type === t.id ? `bg-white/10 ${t.color}` : 'bg-white/[0.02] border-white/10 text-gray-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Call to Action Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Button Label (Optional)</label>
            <input
              type="text"
              value={broadcast.actionText || ''}
              onChange={(e) => setBroadcast(b => ({ ...b, actionText: e.target.value }))}
              placeholder="e.g. Learn More / View PGs"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Destination Route / URL</label>
            <input
              type="text"
              value={broadcast.actionUrl || ''}
              onChange={(e) => setBroadcast(b => ({ ...b, actionUrl: e.target.value }))}
              placeholder="e.g. /search or /budget"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/50"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] hover:brightness-110 text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save & Deploy Broadcast</span>
        </button>

      </form>

    </div>
  );
};
