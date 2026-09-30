import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Scale, AlertTriangle, Lock, 
  Mail, CheckCircle2, Building2, ShoppingBag, PhoneCall,
  ShieldAlert, Clock, MapPin
} from 'lucide-react';
import { PersonalPageHeader } from '../components/layout/PersonalPageHeader';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LEGAL_TRANSLATIONS } from '../lib/translations/legalTranslations';
import { SEOHead } from '../components/common/SEOHead';

export type LegalTab = 'privacy' | 'terms' | 'safety' | 'listing-policy' | 'grievance';

interface LegalProps {
  defaultTab?: LegalTab;
}

export default function Legal({ defaultTab = 'privacy' }: LegalProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<LegalTab>(defaultTab);
  const { language } = useLanguage();
  const loc = LEGAL_TRANSLATIONS[language] || LEGAL_TRANSLATIONS.hinglish;

  const searchParams = new URLSearchParams(location.search);
  const isFromAdmin = searchParams.get('from') === 'admin' || (isAdmin && localStorage.getItem('admin_view_mode') !== 'student');
  const returnUrl = isFromAdmin ? '/admin' : '/';

  // Sync tab with route query or state if provided
  useEffect(() => {
    if (location.pathname === '/privacy') setActiveTab('privacy');
    else if (location.pathname === '/terms') setActiveTab('terms');
    else if (location.pathname === '/safety') setActiveTab('safety');
    else {
      const params = new URLSearchParams(location.search);
      const tabParam = params.get('tab') as LegalTab;
      if (tabParam && ['privacy', 'terms', 'safety', 'listing-policy', 'grievance'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  const navItems: Array<{ id: LegalTab; label: string; icon: React.ComponentType<{ className?: string }>; tag: string }> = [
    { id: 'safety', label: loc.tabs.safety, icon: ShieldAlert, tag: 'Must Read' },
    { id: 'privacy', label: loc.tabs.privacy, icon: Lock, tag: 'DPDP 2023' },
    { id: 'terms', label: loc.tabs.terms, icon: Scale, tag: 'Zero Brokerage' },
    { id: 'listing-policy', label: loc.tabs.listingPolicy, icon: Building2, tag: 'Verification' },
    { id: 'grievance', label: loc.tabs.grievance, icon: Mail, tag: 'Official SLA' },
  ];

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'safety':
        return {
          title: loc.safety.title,
          subtitle: loc.safety.subtitle,
          badge: 'Safety First',
          badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: ShieldAlert,
          iconColor: 'text-amber-400'
        };
      case 'terms':
        return {
          title: loc.terms.title,
          subtitle: loc.terms.subtitle,
          badge: 'User Terms',
          badgeColor: 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30',
          icon: Scale,
          iconColor: 'text-[#00E5FF]'
        };
      case 'listing-policy':
        return {
          title: loc.listingPolicy.title,
          subtitle: loc.listingPolicy.subtitle,
          badge: 'Verification',
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: Building2,
          iconColor: 'text-emerald-400'
        };
      case 'grievance':
        return {
          title: loc.grievance.title,
          subtitle: loc.grievance.subtitle,
          badge: 'Grievance Cell',
          badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: Mail,
          iconColor: 'text-rose-400'
        };
      case 'privacy':
      default:
        return {
          title: loc.privacy.title,
          subtitle: loc.privacy.subtitle,
          badge: 'DPDP 2023',
          badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: Lock,
          iconColor: 'text-purple-400'
        };
    }
  };

  const headerMeta = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#07090E] text-white pt-2 pb-24 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        customTitle={`${headerMeta.title} | Studolink`}
        customDescription={headerMeta.subtitle}
      />
      {/* Top Navigation Header */}
      <PersonalPageHeader
        title={headerMeta.title}
        subtitle={headerMeta.subtitle}
        badge={headerMeta.badge}
        badgeColor={headerMeta.badgeColor}
        icon={headerMeta.icon}
        iconColor={headerMeta.iconColor}
        backLabel={isFromAdmin ? "Admin Console" : "Back"}
        exitUrl={returnUrl}
        onClose={() => {
          if (isFromAdmin) {
            navigate('/admin');
          } else if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/');
          }
        }}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Language Selection Banner */}
        <LanguageSelector variant="banner" />

        {/* Header Hero */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 overflow-hidden shadow-2xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#8A2BE2]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{loc.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {loc.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
              {loc.heroIntro}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                {loc.lastUpdated}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#8A2BE2]" />
                {loc.jurisdiction}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {loc.zeroBrokerageBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#8A2BE2]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00E5FF]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                  isActive ? 'bg-[#00E5FF] text-black' : 'bg-white/10 text-gray-500'
                }`}>
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Document Content Area */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 shadow-2xl">
          
          {/* ========================================================================= */}
          {/* 1. STUDENT SAFETY & ANTI-FRAUD ADVISORY */}
          {/* ========================================================================= */}
          {activeTab === 'safety' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 text-sm text-gray-300 leading-relaxed"
            >
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                  {loc.safety.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {loc.safety.subtitle}
                </p>
              </div>

              {/* Critical Alert Warning Box */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="text-sm font-black text-white">{loc.safety.alertTitle}</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {loc.safety.alertDesc}
                  </p>
                </div>
              </div>

              {/* Golden Safety Rules Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-black/40 to-transparent border border-amber-500/30 space-y-4">
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  {loc.safety.goldenRulesTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loc.safety.rules.map((rule, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                      <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider block">
                        {rule.title}
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Scams Recognition */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-black flex items-center justify-center">!</span>
                  {loc.safety.antiFraudTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {loc.safety.antiFraudPoints.map((pt, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-gray-300">
                      <p className="leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mental Health & Emergency Hotlines */}
              <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300">
                    <PhoneCall className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{loc.safety.helplineTitle}</h3>
                    <p className="text-xs text-rose-300">{loc.safety.helplineSubtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <p className="text-xs text-gray-400">National Tele-MANAS</p>
                    <p className="text-xl font-black text-white mt-1">14416</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Toll-Free 24x7</p>
                    <p className="text-[10px] text-gray-400 mt-1">{loc.safety.teleManasDesc}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <p className="text-xs text-gray-400">National Emergency Support</p>
                    <p className="text-xl font-black text-white mt-1">112</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Police, Ambulance, Fire</p>
                    <p className="text-[10px] text-gray-400 mt-1">{loc.safety.emergencyDesc}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <p className="text-xs text-gray-400">Women & Girl Student Helpline</p>
                    <p className="text-xl font-black text-white mt-1">1090 / 181</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Safety & Support</p>
                    <p className="text-[10px] text-gray-400 mt-1">{loc.safety.womenHelplineDesc}</p>
                  </div>
                </div>
              </div>

              {/* Pre-Move Checklist */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {loc.safety.checklistTitle}
                </h3>
                <ul className="space-y-2 text-xs text-gray-300">
                  {loc.safety.checklistItems.map((item, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* 2. PRIVACY POLICY */}
          {/* ========================================================================= */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 text-sm text-gray-300 leading-relaxed"
            >
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Lock className="w-6 h-6 text-[#00E5FF]" />
                  {loc.privacy.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {loc.privacy.subtitle}
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-black flex items-center justify-center">1</span>
                  {loc.privacy.introTitle}
                </h3>
                <p>{loc.privacy.introText}</p>
              </div>

              {/* Section 2 */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-black flex items-center justify-center">2</span>
                  {loc.privacy.dataCollectTitle}
                </h3>
                <p className="text-xs text-gray-400">{loc.privacy.dataCollectIntro}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]">{loc.privacy.studentDataTitle}</h4>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
                      {loc.privacy.studentDataItems.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A2BE2]">{loc.privacy.ownerDataTitle}</h4>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
                      {loc.privacy.ownerDataItems.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-black flex items-center justify-center">3</span>
                  {loc.privacy.geoTitle}
                </h3>
                <p className="text-xs text-gray-300">{loc.privacy.geoText}</p>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-black flex items-center justify-center">4</span>
                  {loc.privacy.dataUsageTitle}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                  {loc.privacy.dataUsageItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Section 5 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-black flex items-center justify-center">5</span>
                  {loc.privacy.dataSharingTitle}
                </h3>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed">
                  <strong className="text-white block mb-1">Zero Commercial Data Monetization:</strong>
                  {loc.privacy.dataSharingHighlight}
                </div>
              </div>

              {/* Section 6 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-black flex items-center justify-center">6</span>
                  {loc.privacy.rightsTitle}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                  {loc.privacy.rightsItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* 3. TERMS & CONDITIONS */}
          {/* ========================================================================= */}
          {activeTab === 'terms' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 text-sm text-gray-300 leading-relaxed"
            >
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Scale className="w-6 h-6 text-[#00E5FF]" />
                  {loc.terms.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {loc.terms.subtitle}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{loc.terms.acceptTitle}</h3>
                <p>{loc.terms.acceptText}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{loc.terms.intermediaryTitle}</h3>
                <p className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-gray-300">
                  {loc.terms.intermediaryText}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{loc.terms.zeroBrokerageTitle}</h3>
                <p className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs">
                  {loc.terms.zeroBrokerageText}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{loc.terms.conductTitle}</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                  {loc.terms.conductItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{loc.terms.ownerObligationsTitle}</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                  {loc.terms.ownerObligationsItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{loc.terms.liabilityTitle}</h3>
                <p className="text-xs text-gray-400">{loc.terms.liabilityText}</p>
              </div>

            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* 4. LISTING & OWNER RULES */}
          {/* ========================================================================= */}
          {activeTab === 'listing-policy' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 text-sm text-gray-300 leading-relaxed"
            >
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-[#00E5FF]" />
                  {loc.listingPolicy.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {loc.listingPolicy.subtitle}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">{loc.listingPolicy.standardsTitle}</h3>
                <div className="space-y-2">
                  {loc.listingPolicy.standardsItems.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white text-rose-300">{loc.listingPolicy.bannedPracticesTitle}</h3>
                <div className="space-y-2">
                  {loc.listingPolicy.bannedPracticesItems.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 text-xs text-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{loc.listingPolicy.photoStandardsTitle}</h3>
                <p className="text-xs text-gray-400">{loc.listingPolicy.photoStandardsText}</p>
              </div>

            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* 5. GRIEVANCE REDRESSAL & CONTACT */}
          {/* ========================================================================= */}
          {activeTab === 'grievance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 text-sm text-gray-300 leading-relaxed"
            >
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Mail className="w-6 h-6 text-[#00E5FF]" />
                  {loc.grievance.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {loc.grievance.subtitle}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white">{loc.grievance.officerTitle}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-gray-400">Designated Officer:</span>
                    <p className="text-white font-bold text-sm">{loc.grievance.officerName}</p>
                    <p className="text-gray-400">{loc.grievance.officerRole}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-gray-400">Direct Emails:</span>
                    <p className="text-[#00E5FF] font-bold text-sm">
                      <a href="mailto:Support@imprince.me" className="hover:underline">Support@imprince.me</a>
                    </p>
                    <p className="text-gray-400 text-xs">Tech: <a href="mailto:Developer@imprince.me" className="text-[#00E5FF] hover:underline">Developer@imprince.me</a></p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 space-y-1">
                  <strong className="text-white">{loc.grievance.slaTitle}:</strong>
                  <p>{loc.grievance.slaText}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-gray-400 space-y-1">
                <strong className="text-white">{loc.grievance.cyberCoopTitle}</strong>
                <p>{loc.grievance.cyberCoopText}</p>
              </div>

              {/* Fast Feedback / Inquiry Form CTA */}
              <div className="p-6 rounded-3xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Report a Fraudulent PG, Fake Listing or Abuse</h4>
                  <p className="text-xs text-gray-400 mt-1">Our moderation desk takes immediate action against deceptive listings or scammers.</p>
                </div>
                <a
                  href="mailto:support@imprince.me?subject=Reporting%20Listing%20or%20Security%20Issue%20-%20City%20Helpline"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-black text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] shrink-0"
                >
                  Send Grievance Report &rarr;
                </a>
              </div>

            </motion.div>
          )}

        </div>

        {/* Bottom Quick Links / Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <Link
            to="/search"
            className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 transition-all group"
          >
            <Building2 className="w-5 h-5 text-[#00E5FF] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">Find Verified PGs & Libraries</h4>
            <p className="text-[11px] text-gray-400 mt-1">Browse verified student accommodations in your city.</p>
          </Link>

          <Link
            to="/marketplace"
            className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 transition-all group"
          >
            <ShoppingBag className="w-5 h-5 text-[#8A2BE2] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-white group-hover:text-[#8A2BE2] transition-colors">Student Marketplace</h4>
            <p className="text-[11px] text-gray-400 mt-1">Buy and sell books, cycles, coolers from peers safely.</p>
          </Link>

          <Link
            to="/budget"
            className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 transition-all group"
          >
            <Scale className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Student Budget Calculator</h4>
            <p className="text-[11px] text-gray-400 mt-1">Plan monthly living allowance with zero hidden costs.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
