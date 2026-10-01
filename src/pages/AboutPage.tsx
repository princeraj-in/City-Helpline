import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Building2, ShieldCheck, HeartHandshake, Sparkles, 
  MapPin, CheckCircle2, ArrowRight, BookOpen, Utensils, 
  BedDouble, ShoppingBag, Calculator, Mail, Phone, ExternalLink, Award
} from 'lucide-react';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { PersonalPageHeader } from '../components/layout/PersonalPageHeader';
import { SEOHead } from '../components/common/SEOHead';
import { APP_CONFIG } from '../lib/appConfig';

export default function AboutPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Verified Habitats',
      desc: 'Physical room checks, security audits, CCTV confirmation, and real student reviews—zero fake listings or hidden charges.',
      color: 'text-[#00E5FF]',
      border: 'border-[#00E5FF]/30',
      bg: 'bg-[#00E5FF]/10',
    },
    {
      icon: HeartHandshake,
      title: 'Zero Brokerage Promise',
      desc: 'Connect directly with PG owners, hostel managers, and roommates. No broker fees or middleman commissions ever.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: BedDouble,
      title: 'Student Roommate Matching',
      desc: 'Find exam-focused, habit-compatible flatmates (NEET, JEE, UPSC) with zero phone leakage and complete privacy protection.',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
    },
    {
      icon: ShoppingBag,
      title: 'Affordable Campus Marketplace',
      desc: 'Buy, resell, or donate study books, notes, desert coolers, cycles, and tables at 50%–70% off from senior students.',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
  ];

  const milestones = [
    { number: '12+', label: 'Premier Coaching Hubs Covered' },
    { number: '100%', label: 'Zero Brokerage Direct Connect' },
    { number: '5,000+', label: 'Aspirants Helped Across India' },
    { number: '24/7', label: 'Student Safety & AI Helpline' },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-white">
      <SEOHead />
      <PersonalPageHeader
        title="About Studolink"
        subtitle="Empowering students across India with verified living habitats & community"
        badge="Our Mission"
        badgeColor="bg-cyan-400/10 text-cyan-300 border-cyan-400/30"
        icon={Building2}
        iconColor="text-[#00E5FF]"
        exitUrl="/"
        backLabel="Home"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 mb-20 md:mb-12">
        
        {/* 1. Hero Vision Banner */}
        <LiquidGlassCard className="p-6 sm:p-12 relative overflow-hidden" glowColor="rgba(0, 229, 255, 0.25)">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[11px] font-bold text-cyan-300 tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Hyper-Local Student Living Ecosystem</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Making Student Life <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-indigo-300">
                Safe, Affordable & Focused
              </span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Studolink was founded with a singular purpose: to solve the everyday living challenges faced by millions of competitive exam aspirants moving to coaching cities like Kota, Patna, Delhi, Pune, Sikar, and Prayagraj.
            </p>
          </div>
        </LiquidGlassCard>

        {/* 2. Key Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m, idx) => (
            <GlassCard key={idx} className="p-6 text-center border-white/10" intensity="low">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-indigo-300 mb-1">
                {m.number}
              </div>
              <p className="text-xs text-gray-400 font-medium">{m.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* 3. Core Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Why Studolink is Different</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Built by engineers and former coaching aspirants who understand the pain of brokers, unhygienic mess food, and noisy hostels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <GlassCard key={idx} className={`p-6 border ${p.border}`} intensity="low">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${p.bg} shrink-0`}>
                      <Icon className={`w-6 h-6 ${p.color}`} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white">{p.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* 4. Complete Student Suite Navigation */}
        <LiquidGlassCard className="p-8 sm:p-10" glowColor="rgba(138, 43, 226, 0.25)">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#00E5FF]" />
            <span>Explore Studolink Services</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link to="/search" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all text-center group">
              <Building2 className="w-5 h-5 text-[#00E5FF] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Hostels & PGs</div>
            </Link>
            <Link to="/roommates" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all text-center group">
              <BedDouble className="w-5 h-5 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Roommates</div>
            </Link>
            <Link to="/marketplace" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all text-center group">
              <ShoppingBag className="w-5 h-5 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Marketplace</div>
            </Link>
            <Link to="/budget" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all text-center group">
              <Calculator className="w-5 h-5 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Budget Tool</div>
            </Link>
            <Link to="/hubs" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all text-center group">
              <MapPin className="w-5 h-5 text-rose-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Student Hubs</div>
            </Link>
            <Link to="/help" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 transition-all text-center group">
              <Phone className="w-5 h-5 text-cyan-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Help & Care</div>
            </Link>
          </div>
        </LiquidGlassCard>

        {/* 5. Contact & Founder Info */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <p className="font-bold text-white">Studolink Platform • Your Student Ecosystem</p>
            <p>Founder & Architect: Prince Raj • Founder@imprince.me</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/legal" className="text-cyan-400 hover:underline">Privacy & Terms</Link>
            <span>•</span>
            <Link to="/help" className="text-cyan-400 hover:underline">Support Desk</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
