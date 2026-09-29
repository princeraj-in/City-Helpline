import React from 'react';
import { RoommateProfile } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { 
  MapPin, IndianRupee, Moon, Sun, Clock, 
  Utensils, Sparkles, MessageCircle, Phone, 
  CheckCircle2, BedDouble, Calendar, UserCheck
} from 'lucide-react';
import { VerifiedStudentBadge } from '../common/TrustBadge';
import { formatWhatsAppUrl } from '../../lib/utils';

export interface RoommateCardProps {
  profile: RoommateProfile;
  onConnect: (profile: RoommateProfile) => void;
  isCurrentUser?: boolean;
  onEdit?: () => void;
}

export const RoommateCard: React.FC<RoommateCardProps> = ({ profile, onConnect, isCurrentUser, onEdit }) => {
  const isNightOwl = profile.habits.studyTime.includes('Night Owl');
  const isVeg = profile.habits.dietary.includes('Vegetarian');

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = profile.whatsappNumber || profile.userPhone;
    const text = `Hi ${profile.userName}, I saw your Roommate / Flatmate profile on Studolink for ${profile.locality}, ${profile.city}. I am preparing for ${profile.targetExam} and looking for a flatmate in budget ₹${profile.budgetMin}-${profile.budgetMax}. Let's connect!`;
    window.open(formatWhatsAppUrl(phone, text), '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${profile.userPhone}`;
  };

  return (
    <GlassCard 
      className="p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.12)] relative overflow-hidden card-content-auto"
      intensity="low"
    >
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Top Header: Avatar, Name, Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E5FF]/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center text-white font-black text-lg overflow-hidden shadow-inner">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt={profile.userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#00E5FF] font-black">{profile.userName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${profile.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-black text-white group-hover:text-[#00E5FF] transition-colors truncate">
                  {profile.userName}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-400/15 text-[#00E5FF] border border-cyan-400/30">
                  {profile.gender === 'female' ? '👩 Girls' : profile.gender === 'male' ? '👨 Boys' : 'Any'}
                </span>
                {profile.isStudentVerified && (
                  <VerifiedStudentBadge size="sm" />
                )}
              </div>
              <p className="text-xs text-cyan-200 font-semibold truncate mt-0.5">
                {profile.targetExam}
              </p>
            </div>
          </div>

          {/* Budget Badge */}
          <div className="text-right shrink-0">
            <div className="text-sm sm:text-base font-black text-emerald-300 flex items-center justify-end">
              <span>₹{profile.budgetMin.toLocaleString()} - {profile.budgetMax.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">per month / share</span>
          </div>
        </div>

        {/* Location & Room Type */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs text-gray-300">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="truncate max-w-[150px]">{profile.locality}, {profile.city}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">
            <BedDouble className="w-3.5 h-3.5 text-indigo-300" />
            <span>{profile.roomType}</span>
          </div>
          {profile.moveInDate && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.moveInDate}</span>
            </div>
          )}
        </div>

        {/* Habits Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            isNightOwl 
              ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' 
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}>
            {isNightOwl ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            {profile.habits.studyTime.split(' ')[0]} {profile.habits.studyTime.includes('Night') ? 'Night Owl' : 'Early Bird'}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Utensils className="w-3 h-3" />
            {isVeg ? 'Veg Only' : 'Non-Veg Friendly'}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <Sparkles className="w-3 h-3" />
            {profile.habits.cleanliness.split('/')[0]}
          </span>

          {profile.habits.smokingDrinking && (
            <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-300 border border-white/10">
              🚭 {profile.habits.smokingDrinking}
            </span>
          )}
        </div>

        {/* Bio text */}
        <p className="text-xs text-gray-300 line-clamp-3 mb-5 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
          "{profile.bio}"
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        {isCurrentUser ? (
          <div className="w-full flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#00E5FF] flex items-center gap-1">
              <UserCheck className="w-4 h-4" /> Your Profile
            </span>
            <button
              type="button"
              onClick={onEdit}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold transition-all border border-white/15 cursor-pointer"
            >
              Edit Preferences
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onConnect(profile)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-400 hover:brightness-110 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BedDouble className="w-4 h-4" />
              <span>Book / Connect</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              title="Chat on WhatsApp"
              className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCall}
              title="Call Student"
              className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Phone className="w-4 h-4 text-cyan-300" />
            </button>
          </>
        )}
      </div>
    </GlassCard>
  );
}
