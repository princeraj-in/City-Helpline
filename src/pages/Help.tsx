import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, Search, Mail, Wrench, 
  PhoneCall, Bot, Sparkles, ChevronDown, 
  Building2, ShoppingBag, BedDouble, 
  CheckCircle2, Send, ArrowRight
} from 'lucide-react';
import { PersonalPageHeader } from '../components/layout/PersonalPageHeader';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { LOCALIZED_FAQS, HELP_UI_TEXT } from '../lib/translations/helpTranslations';
import { APP_CONFIG } from '../lib/appConfig';
import { SEOHead } from '../components/common/SEOHead';
import { toast } from 'sonner';

export default function Help() {
  const { language } = useLanguage();
  const ui = HELP_UI_TEXT[language] || HELP_UI_TEXT.hinglish;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('zero-brokerage');

  // Contact Form State
  const [issueType, setIssueType] = useState<'support' | 'developer'>('support');
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  // Filter FAQs based on search & category
  const filteredFaqs = useMemo(() => {
    return LOCALIZED_FAQS.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const currentQuestion = (faq.question[language] || faq.question.en).toLowerCase();
      const currentAnswer = (faq.answer[language] || faq.answer.en).toLowerCase();
      
      const matchesSearch = !q || currentQuestion.includes(q) || currentAnswer.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, language]);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error(language === 'hi' ? 'कृपया अपनी समस्या या संदेश लिखें।' : 'Please write your message or issue description.');
      return;
    }

    const targetEmail = issueType === 'developer' 
      ? APP_CONFIG.developerEmail 
      : APP_CONFIG.supportEmail;

    const subject = encodeURIComponent(
      issueType === 'developer' 
        ? `[App Bug / Technical Issue] ${name || 'User'}`
        : `[Student Support Inquiry] ${name || 'User'}`
    );

    const body = encodeURIComponent(
      `Name: ${name || 'Not provided'}\nUser Email: ${userEmail || 'Not provided'}\nType: ${issueType === 'developer' ? 'App Working Problem' : 'General / Student Help'}\n\nDescription:\n${message}\n\nDevice & App Info: ${navigator.userAgent}\nURL: ${window.location.href}`
    );

    const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    toast.success(`Opening your email client for ${targetEmail}...`);
  };

  const categoriesList = [
    { id: 'all', label: ui.categories.all },
    { id: 'students', label: ui.categories.students },
    { id: 'owners', label: ui.categories.owners },
    { id: 'marketplace', label: ui.categories.marketplace },
    { id: 'roommates', label: ui.categories.roommates },
    { id: 'technical', label: ui.categories.technical },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-white">
      <SEOHead />
      {/* Reusable Header */}
      <PersonalPageHeader
        title={ui.heroTitle}
        subtitle={ui.heroSubtitle}
        badge="Official Helpdesk"
        badgeColor="bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30"
        icon={HelpCircle}
        iconColor="text-[#00E5FF]"
        exitUrl="/"
        backLabel="Home"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Language Selection Banner */}
        <LanguageSelector variant="banner" />

        {/* Hero Search Section */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-br from-[#00E5FF]/10 via-purple-900/20 to-[#07090E] border border-white/10 shadow-2xl text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              Studolink Aspirant Care
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {ui.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              {ui.heroSubtitle}
            </p>

            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ui.searchPlaceholder}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-black/60 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-all text-xs sm:text-sm shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Official Channels Grid (Support Email, Developer Support, AI Mitra, Emergency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Channel 1: Student & General Support */}
          <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between group shadow-lg">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Student Support</h3>
                <p className="text-xs text-gray-400 mt-1">
                  General queries, room help, owner disputes, or report fraud listings.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-[#00E5FF] break-all select-all">
                {APP_CONFIG.supportEmail}
              </div>
            </div>
            <a
              href={`mailto:${APP_CONFIG.supportEmail}`}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#00E5FF]/10 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Email Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Channel 2: Developer Support */}
          <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-lg">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-white">Developer Support</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300">
                    Tech
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  In case of App working problems, login glitches, crashes, or bugs.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-purple-300 break-all select-all">
                {APP_CONFIG.developerEmail}
              </div>
            </div>
            <a
              href={`mailto:${APP_CONFIG.developerEmail}?subject=%5BApp%20Bug%20Report%5D%20City%20Helpline`}
              className="mt-4 w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Contact Developer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Channel 3: AI Mitra Instant Advisor */}
          <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-lg">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-white">AI Mitra Guide</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Ask rent benchmarks, Kota/Patna coaching areas, food rates & exam areas.
                </p>
              </div>
              <div className="text-xs text-emerald-300 font-medium flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Powered by Gemini 3.8 Flash</span>
              </div>
            </div>
            <Link
              to="/chat"
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Chat with AI Mitra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Channel 4: Emergency & Tele-MANAS */}
          <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 hover:border-rose-500/40 transition-all flex flex-col justify-between group shadow-lg">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Emergency Helplines</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Free 24x7 Government Helplines for exam stress, mental health & safety.
                </p>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Tele-MANAS:</span>
                  <strong className="text-white font-mono">14416</strong>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>National Police:</span>
                  <strong className="text-white font-mono">112</strong>
                </div>
              </div>
            </div>
            <a
              href="tel:14416"
              className="mt-4 w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Call Tele-MANAS (14416)</span>
            </a>
          </div>
        </div>

        {/* Quick Help Guides By Subject */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#00E5FF] font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Room Inspection Checklist</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hamesha din ke ujale me room visit karein. Sub-meter reading note karein (Govt. standard ₹7-10/unit). Water pressure aur cross-ventilation check karein.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>Safe Marketplace Trading</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Books, coolers, ya study tables lene se pehle campus ya public place me meetup karein. Condition physically dekhne ke baad hi UPI karein.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <BedDouble className="w-4 h-4" />
                <span>Finding Ideal Roommates</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Roommate choose karte waqt study timings (night study vs morning), diet habits, aur cleanliness expectations pehle hi clear discuss karein.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Section with Category Filter */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Frequently Asked Questions (FAQs)
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'hi' ? 'सामान्य प्रश्न और उनके उत्तर' : 'Common questions and verified answers'}
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                const qText = faq.question[language] || faq.question.en;
                const aText = faq.answer[language] || faq.answer.en;
                const actionText = faq.action ? (faq.action.text[language] || faq.action.text.en) : '';

                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-white/[0.04] border-[#00E5FF]/40 shadow-lg'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
                    >
                      <span className="font-bold text-sm text-white flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span>{qText}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-[#00E5FF]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-5 pt-1 text-xs text-gray-300 leading-relaxed border-t border-white/5 space-y-3"
                        >
                          <p>{aText}</p>
                          {faq.action && (
                            <Link
                              to={faq.action.url}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-bold text-xs transition-colors"
                            >
                              <span>{actionText}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-gray-400 text-sm">Koi sawaal match nahi hua.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-3 text-xs text-[#00E5FF] hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support Form Section */}
        <div className="rounded-3xl p-6 sm:p-10 bg-white/[0.02] border border-white/10 shadow-2xl space-y-6">
          {/* Founder & Lead Developer Direct Desk */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-cyan-950/40 border border-purple-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="relative shrink-0">
                <img
                  src="/founder.jpg"
                  alt="Prince Raj - Founder of Studolink"
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#07090E]" title="Active" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h4 className="text-sm font-bold text-white">Prince Raj</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Founder & Architect
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Direct developer escalation desk • Personal response for student grievances & bugs
                </p>
              </div>
            </div>
            <a
              href="mailto:Founder@imprince.me?subject=[Founder%20Desk]%20Student%20Inquiry"
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-bold transition-all shrink-0 hover:scale-105 active:scale-95"
            >
              Email Founder Desk
            </a>
          </div>

          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {ui.contactTitle}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {ui.contactSubtitle}
            </p>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-4">
            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">{ui.typeLabel}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIssueType('support')}
                  className={`p-3.5 rounded-xl border text-left transition-all text-xs font-bold flex items-center justify-between ${
                    issueType === 'support'
                      ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF] shadow-sm'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{ui.typeGeneral}</span>
                  <span className="text-[10px] text-gray-400 font-mono">support@imprince.me</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIssueType('developer')}
                  className={`p-3.5 rounded-xl border text-left transition-all text-xs font-bold flex items-center justify-between ${
                    issueType === 'developer'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{ui.typeTech}</span>
                  <span className="text-[10px] text-gray-400 font-mono">developer@imprince.me</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">{ui.nameLabel}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#00E5FF] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">{ui.emailLabel}</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. student@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#00E5FF] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">{ui.messageLabel}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder={ui.messagePlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#00E5FF] transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{ui.submitBtn}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
