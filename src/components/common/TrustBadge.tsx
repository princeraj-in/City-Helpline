import React, { useState } from 'react';
import { ShieldCheck, GraduationCap, Building2, CheckCircle2, X, AlertTriangle, Sparkles, ExternalLink, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface BadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'compact' | 'icon-only';
  className?: string;
  showModalOnClick?: boolean;
}

/**
 * 🎓 Verified Student Badge
 * Displays verification for active students & coaching aspirants
 */
export const VerifiedStudentBadge: React.FC<BadgeProps> = ({
  size = 'md',
  variant = 'pill',
  className = '',
  showModalOnClick = true,
}) => {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const textLabel = language === 'hi' 
    ? 'सत्यापित छात्र' 
    : language === 'hinglish' 
      ? 'Verified Student' 
      : 'Verified Student';

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  const badgeContent = (
    <span
      onClick={(e) => {
        if (showModalOnClick) {
          e.stopPropagation();
          e.preventDefault();
          setShowModal(true);
        }
      }}
      title="Verified Student Aspirant - Studolink Trust"
      className={`inline-flex items-center rounded-full font-bold transition-all ${
        showModalOnClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } bg-gradient-to-r from-[#00E5FF]/15 to-[#8A2BE2]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_12px_rgba(0,229,255,0.25)] backdrop-blur-md ${sizeClasses} ${className}`}
    >
      <div className="p-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] shrink-0">
        <GraduationCap className={iconSizes} />
      </div>
      {variant !== 'icon-only' && (
        <span className="font-extrabold tracking-wide text-white flex items-center gap-1">
          <span>{textLabel}</span>
          <CheckCircle2 className={`${iconSizes} text-[#00E5FF] inline`} />
        </span>
      )}
    </span>
  );

  return (
    <>
      {badgeContent}
      {showModal && <StudentTrustModal onClose={() => setShowModal(false)} />}
    </>
  );
};

/**
 * 🏠 Verified PG / Hostel Badge
 * Displays verification for legitimate, daylight-inspected student accommodations
 */
export const VerifiedPGBadge: React.FC<BadgeProps> = ({
  size = 'md',
  variant = 'pill',
  className = '',
  showModalOnClick = true,
}) => {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const textLabel = language === 'hi' 
    ? 'सत्यापित पीजी' 
    : language === 'hinglish' 
      ? 'Verified PG' 
      : 'Verified PG';

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  const badgeContent = (
    <span
      onClick={(e) => {
        if (showModalOnClick) {
          e.stopPropagation();
          e.preventDefault();
          setShowModal(true);
        }
      }}
      title="Verified PG & Hostel - Physical Daylight Inspection & Zero Brokerage"
      className={`inline-flex items-center rounded-full font-bold transition-all ${
        showModalOnClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-[#00E5FF]/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md ${sizeClasses} ${className}`}
    >
      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
        <Building2 className={iconSizes} />
      </div>
      {variant !== 'icon-only' && (
        <span className="font-extrabold tracking-wide text-white flex items-center gap-1">
          <span>{textLabel}</span>
          <CheckCircle2 className={`${iconSizes} text-emerald-400 inline`} />
        </span>
      )}
    </span>
  );

  return (
    <>
      {badgeContent}
      {showModal && <PGTrustModal onClose={() => setShowModal(false)} />}
    </>
  );
};

/**
 * Interactive Explanatory Modal: Verified Student
 */
export const StudentTrustModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { language } = useLanguage();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[#0c1017] border border-[#00E5FF]/30 p-6 text-white shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8A2BE2]/20 border border-[#00E5FF]/40 text-[#00E5FF]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-white">
                {language === 'hi' ? 'सत्यापित छात्र (Verified Student)' : 'Verified Student Badge'}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <p className="text-xs text-gray-400">
              Studolink Aspirant Community Trust
            </p>
          </div>
        </div>

        {/* What this badge certifies */}
        <div className="space-y-2 text-xs text-gray-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/10">
          <h4 className="font-bold text-[#00E5FF] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? 'यह बैज क्या प्रमाणित करता है?' : 'What does this badge mean?'}
          </h4>
          <ul className="space-y-1.5 pl-1">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-1.5 shrink-0" />
              <span>
                {language === 'hi' 
                  ? 'छात्र ने अपने कोचिंग संस्थान (Allen, PW, Motion आदि) या कॉलेज का मान्य आईडी/रोल नंबर सत्यापित करवाया है।'
                  : 'The student has verified their Coaching Enrollment (Allen, PW, Motion, etc.) or College ID card.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] mt-1.5 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'रूममेट ढूंढने और स्टूडेंट मार्केटप्लेस पर लेनदेन के लिए 100% सुरक्षित और विश्वसनीय प्रोफाइल।'
                  : 'High trust rating for Roommate Finder & safe student marketplace transactions.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'शून्य स्पैम और सत्यापित छात्र रिकॉर्ड।'
                  : 'Zero spam, anti-impersonation community protection.'}
              </span>
            </li>
          </ul>
        </div>

        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            {language === 'hi'
              ? 'क्या आप छात्र हैं? आप भी अपनी प्रोफ़ाइल में जाकर फ्री में यह बैज ले सकते हैं!'
              : 'Are you an aspirant? You can apply for your free badge from your Profile!'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-black text-xs hover:brightness-110 transition-all cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

/**
 * Interactive Explanatory Modal: Verified PG / Hostel
 */
export const PGTrustModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { language } = useLanguage();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[#0c1017] border border-emerald-400/40 p-6 text-white shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-[#00E5FF]/20 border border-emerald-400/40 text-emerald-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-white">
                {language === 'hi' ? 'सत्यापित पीजी (Verified PG / Hostel)' : 'Verified PG / Hostel Badge'}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-gray-400">
              Studolink Anti-Scam Standard
            </p>
          </div>
        </div>

        {/* What this badge certifies */}
        <div className="space-y-2 text-xs text-gray-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/10">
          <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'hi' ? 'सत्यापित पीजी में क्या गारंटी है?' : 'What is guaranteed in a Verified PG?'}
          </h4>
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>100% Zero Brokerage:</strong> {language === 'hi' ? 'मकान मालिक से सीधा संपर्क, कोई दलाल या कमीशन नहीं।' : 'Direct owner contact with no middleman commission.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Daylight Physical Inspection:</strong> {language === 'hi' ? 'कमरे में धूप, हवा, पानी का प्रेशर और सुरक्षा की वास्तविक जांच।' : 'Daylight ventilation, water pressure, and safety verified.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Declared Sub-Meter Rate:</strong> {language === 'hi' ? 'बिजली यूनिट का दर लिखित में पारदर्शी है (कोई मनमाना बिल नहीं)।' : 'Electricity sub-meter rate (₹7-₹10/unit) transparently disclosed.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Owner ID & Electricity Bill:</strong> {language === 'hi' ? 'मकान मालिक के सरकारी दस्तावेज और संपत्ति प्रमाण रिकॉर्ड पर हैं।' : 'Verified property ownership document on file.'}
              </span>
            </li>
          </ul>
        </div>

        {/* Security Alert reminder */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            {language === 'hi'
              ? 'चेतावनी: कभी भी बिना कमरा अपनी आंखों से देखे ऑनलाइन टोकन या एडवांस न भेजें।'
              : 'Golden Rule: Even for verified rooms, never pay token advance before daylight physical inspection.'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00E5FF] text-black font-black text-xs hover:brightness-110 transition-all cursor-pointer"
        >
          Understood
        </button>
      </div>
    </div>
  );
};
