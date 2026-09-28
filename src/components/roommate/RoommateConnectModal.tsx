import React, { useState } from 'react';
import { RoommateProfile } from '../../types';
import { motion } from 'motion/react';
import { 
  X, MessageCircle, Phone, BedDouble, 
  MapPin, IndianRupee, Send, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { formatWhatsAppUrl } from '../../lib/utils';

interface RoommateConnectModalProps {
  profile: RoommateProfile | null;
  onClose: () => void;
}

export function RoommateConnectModal({ profile, onClose }: RoommateConnectModalProps) {
  const { currentUser, userProfile } = useAuth();
  const [message, setMessage] = useState(
    'Hi! I saw your roommate requirement on Studolink. I would like to discuss room sharing and visit the place.'
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!profile) return null;

  const handleWhatsApp = () => {
    const phone = profile.whatsappNumber || profile.userPhone;
    const text = `Hi ${profile.userName}, I saw your Roommate listing for ${profile.locality}, ${profile.city} on Studolink. I am preparing for ${profile.targetExam} and would like to connect!\n\nMessage: ${message}`;
    window.open(formatWhatsAppUrl(phone, text), '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${profile.userPhone}`;
  };

  const handleSendInApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    toast.success(`Booking inquiry sent to ${profile.userName}! They will contact you shortly.`);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-[#0A0E17] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,229,255,0.2)]"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-[#00E5FF]">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Connect with {profile.userName}</h3>
              <p className="text-xs text-gray-400">{profile.targetExam} • {profile.locality}, {profile.city}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Inquiry Sent Successfully!</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              {profile.userName} has been notified. You can also chat directly on WhatsApp for faster response.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick summary box */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Budget Share</span>
                <span className="text-emerald-300 font-bold">₹{profile.budgetMin.toLocaleString()} - ₹{profile.budgetMax.toLocaleString()}/mo</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Room Type</span>
                <span className="text-white font-bold">{profile.roomType}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Move-in</span>
                <span className="text-cyan-300 font-bold">{profile.moveInDate || 'Flexible'}</span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCall}
                className="py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Direct Call</span>
              </button>
            </div>

            {/* Custom note form */}
            <form onSubmit={handleSendInApp} className="space-y-3 pt-2 border-t border-white/10">
              <label className="block text-xs font-bold text-gray-300">
                Or Send In-App Connect Request:
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
                placeholder="Write a message to introduce yourself..."
              />

              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your contact details are shared safely only for accommodation discussions.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Connect Request</span>
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
