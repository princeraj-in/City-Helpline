import React, { useState, useEffect } from 'react';
import { RoommateProfile, RoommatePrivateContact } from '../../types';
import { motion } from 'motion/react';
import { 
  X, MessageCircle, Phone, BedDouble, 
  MapPin, IndianRupee, Send, CheckCircle2, ShieldCheck, Lock, Loader2, LogIn
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getRoommateContactDetails } from '../../lib/roommateService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatWhatsAppUrl } from '../../lib/utils';

interface RoommateConnectModalProps {
  profile: RoommateProfile | null;
  onClose: () => void;
}

export function RoommateConnectModal({ profile, onClose }: RoommateConnectModalProps) {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState(
    'Hi! I saw your roommate requirement on Studolink. I would like to discuss room sharing and visit the place.'
  );
  const [sentSuccess, setSentSuccess] = useState(false);
  const [contact, setContact] = useState<RoommatePrivateContact | null>(null);
  const [loadingContact, setLoadingContact] = useState(false);

  useEffect(() => {
    if (!profile) return;
    if (!currentUser) return; // Unauthenticated users cannot view private subcollections

    let isMounted = true;
    const loadContact = async () => {
      setLoadingContact(true);
      try {
        const data = await getRoommateContactDetails(profile.id, profile.userId);
        if (isMounted && data) {
          setContact(data);
        }
      } catch (err) {
        console.warn('Could not load protected roommate contact:', err);
      } finally {
        if (isMounted) setLoadingContact(false);
      }
    };

    loadContact();
    return () => { isMounted = false; };
  }, [profile, currentUser]);

  if (!profile) return null;

  const phone = contact?.userPhone || profile.userPhone || '';
  const whatsapp = contact?.whatsappNumber || contact?.userPhone || profile.whatsappNumber || profile.userPhone || '';

  const handleWhatsApp = () => {
    if (!currentUser) {
      toast.error('Please sign in to view contact details and chat with this roommate.');
      return;
    }
    if (!whatsapp) {
      toast.error('WhatsApp number is not provided by this student.');
      return;
    }
    const text = `Hi ${profile.userName}, I saw your Roommate listing for ${profile.locality}, ${profile.city} on Studolink. I am preparing for ${profile.targetExam} and would like to connect!\n\nMessage: ${message}`;
    window.open(formatWhatsAppUrl(whatsapp, text), '_blank');
  };

  const handleCall = () => {
    if (!currentUser) {
      toast.error('Please sign in to view phone details.');
      return;
    }
    if (!phone) {
      toast.error('Phone number is not provided by this student.');
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const handleSendInApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to send a connect request.');
      return;
    }
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

            {/* Privacy Gate: Unauthenticated vs Authenticated */}
            {!currentUser ? (
              <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-[#00E5FF]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Student Contact Details Protected</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    To prevent harassment and protect student privacy, direct phone numbers and WhatsApp chats are only available to signed-in students.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:brightness-110 active:scale-95 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to View Contact & Connect</span>
                </button>
              </div>
            ) : loadingContact ? (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center gap-3 text-xs text-cyan-300">
                <Loader2 className="w-4 h-4 animate-spin text-[#00E5FF]" />
                <span>Securely decrypting contact details...</span>
              </div>
            ) : (
              /* Direct Connect Buttons for Authenticated Students */
              <div className="space-y-3">
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

                <div className="flex items-center gap-2 text-[11px] text-gray-400 px-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified contact loaded securely from protected student database.</span>
                </div>
              </div>
            )}

            {/* Custom note form */}
            <form onSubmit={handleSendInApp} className="space-y-3 pt-2 border-t border-white/10">
              <label className="block text-xs font-bold text-gray-300">
                Send In-App Connect Request:
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
                placeholder="Write a message to introduce yourself..."
              />

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
