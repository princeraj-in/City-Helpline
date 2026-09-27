import React, { useState, useEffect } from 'react';
import { useLocationContext } from '../../contexts/LocationContext';
import { getCityEmergencyInfo, NATIONAL_EMERGENCY_CONTACTS } from '../../lib/emergencyData';
import { UserSosContact, CityEmergencyInfo } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { 
  AlertTriangle, Phone, ShieldAlert, HeartPulse, 
  MapPin, Shield, Users, MessageCircle, Edit2, 
  Check, X, LifeBuoy, AlertCircle, PhoneCall
} from 'lucide-react';
import { toast } from 'sonner';
import { formatWhatsAppUrl } from '../../lib/utils';

export function ProfileEmergencySection() {
  const { userLocation, openLocationModal } = useLocationContext();
  const currentCity = userLocation?.city || 'Kota';
  
  const [cityData, setCityData] = useState<CityEmergencyInfo>(() => getCityEmergencyInfo(currentCity));

  // Personal Emergency Contact state
  const [sosContact, setSosContact] = useState<UserSosContact | null>(() => {
    try {
      const saved = localStorage.getItem('user_sos_guardian_contact');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isEditingSos, setIsEditingSos] = useState(false);
  const [sosName, setSosName] = useState(sosContact?.name || '');
  const [sosRelation, setSosRelation] = useState(sosContact?.relation || 'Parent / Guardian');
  const [sosPhone, setSosPhone] = useState(sosContact?.phone || '');

  // Keep city emergency data in sync with location updates
  useEffect(() => {
    setCityData(getCityEmergencyInfo(currentCity));
  }, [currentCity]);

  const handleSaveSos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosName.trim() || !sosPhone.trim()) {
      toast.error('Please enter name and phone number');
      return;
    }
    const newContact: UserSosContact = {
      name: sosName.trim(),
      relation: sosRelation.trim(),
      phone: sosPhone.trim()
    };
    setSosContact(newContact);
    localStorage.setItem('user_sos_guardian_contact', JSON.stringify(newContact));
    setIsEditingSos(false);
    toast.success('Emergency Guardian contact saved safely!');
  };

  const handleTriggerParentSos = () => {
    if (!sosContact) return;
    const locationStr = userLocation 
      ? `${userLocation.area ? userLocation.area + ', ' : ''}${userLocation.city}${userLocation.state ? ', ' + userLocation.state : ''}` 
      : currentCity;
    const message = `🚨 EMERGENCY SOS ALERT! I need immediate help. My current location is: ${locationStr}. Please call me back right now!`;
    window.open(formatWhatsAppUrl(sosContact.phone, message), '_blank');
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                24/7 Student Safety & Emergency SOS
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                Location Aware
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Verified local student suicide distress cells, police patrols, and trauma care.
            </p>
          </div>
        </div>

        {/* Location selector indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs shrink-0">
          <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="text-gray-300 font-semibold">{cityData.city} ({cityData.state})</span>
          <button
            type="button"
            onClick={openLocationModal}
            className="text-[11px] font-bold text-[#00E5FF] hover:underline ml-1 cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      {/* Primary SOS Block: Parent Guardian + City Student Distress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Personal Guardian SOS */}
        <GlassCard className="p-5 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-[#0B0F19] to-slate-900 flex flex-col justify-between shadow-lg relative overflow-hidden" intensity="low">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Personal Guardian SOS</h3>
                  <span className="text-[11px] text-gray-400">1-Tap Parent Alert</span>
                </div>
              </div>

              {sosContact && !isEditingSos && (
                <button
                  type="button"
                  onClick={() => setIsEditingSos(true)}
                  className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white transition-all text-xs"
                  title="Edit Contact"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isEditingSos || !sosContact ? (
              <form onSubmit={handleSaveSos} className="space-y-2.5 my-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Guardian Name (e.g. Papa)"
                    value={sosName}
                    onChange={e => setSosName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-rose-400"
                  />
                  <input
                    type="text"
                    placeholder="Relation (e.g. Father)"
                    value={sosRelation}
                    onChange={e => setSosRelation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-rose-400"
                  />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Guardian Phone Number"
                  value={sosPhone}
                  onChange={e => setSosPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-rose-400"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  {sosContact && (
                    <button
                      type="button"
                      onClick={() => setIsEditingSos(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-gray-400 text-xs"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md"
                  >
                    Save Guardian SOS
                  </button>
                </div>
              </form>
            ) : (
              <div className="my-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{sosContact.name} ({sosContact.relation})</h4>
                  <p className="text-xs text-rose-300 font-mono font-bold mt-0.5">{sosContact.phone}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Ready
                </span>
              </div>
            )}
          </div>

          {sosContact && !isEditingSos && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleCall(sosContact.phone)}
                className="py-2.5 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Guardian</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerParentSos}
                className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp SOS</span>
              </button>
            </div>
          )}
        </GlassCard>

        {/* Card 2: Student Mental Wellness & Suicide Distress Cell */}
        {cityData.studentDistressHelpline && (
          <GlassCard className="p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-[#0B0F19] to-slate-900 flex flex-col justify-between shadow-lg relative overflow-hidden" intensity="low">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[#00E5FF]">
                  <HeartPulse className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{cityData.studentDistressHelpline.title}</h3>
                  <span className="text-[11px] text-cyan-300 font-semibold">24x7 Confidential • Free Counseling</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                {cityData.studentDistressHelpline.description} Exam stress, anxiety, or emotional burden? Talk to professional counselors anytime without hesitation.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-gray-400 block">Direct Helpline</span>
                <span className="text-sm font-black text-[#00E5FF] tracking-wide font-mono">
                  {cityData.studentDistressHelpline.number}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCall(cityData.studentDistressHelpline!.number)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-400 hover:brightness-110 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Counselor Now</span>
              </button>
            </div>
          </GlassCard>
        )}
      </div>

      {/* City-Specific Emergency Table Grid: Police, Hospital Trauma, Women Safety */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Police */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-bold text-white truncate">{cityData.policeControl.title}</h4>
            </div>
            <p className="text-[11px] text-gray-400 line-clamp-2 mb-3">
              {cityData.policeControl.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCall(cityData.policeControl.number)}
            className="w-full py-2 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3 h-3" />
            <span>Call Police ({cityData.policeControl.number})</span>
          </button>
        </div>

        {/* Hospital */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white truncate">{cityData.primaryHospital.title}</h4>
            </div>
            <p className="text-[11px] text-gray-400 line-clamp-2 mb-3">
              {cityData.primaryHospital.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCall(cityData.primaryHospital.number)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3 h-3" />
            <span>Call Hospital ({cityData.primaryHospital.number})</span>
          </button>
        </div>

        {/* Women Helpline */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-400/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Users className="w-4 h-4 text-pink-400" />
              <h4 className="text-xs font-bold text-white truncate">{cityData.womenHelpline.title}</h4>
            </div>
            <p className="text-[11px] text-gray-400 line-clamp-2 mb-3">
              {cityData.womenHelpline.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCall(cityData.womenHelpline.number)}
            className="w-full py-2 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3 h-3" />
            <span>Women Helpline ({cityData.womenHelpline.number})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
