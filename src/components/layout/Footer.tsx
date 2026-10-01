import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, ShieldCheck, CheckCircle2, Zap, HeartHandshake, 
  MapPin, ArrowUp, Mail, Phone, Lock, Sparkles, 
  ShoppingBag, Calculator, PlusCircle, ExternalLink, Globe, Scale, FileText, HelpCircle, Wrench
} from 'lucide-react';
import { useLocationContext } from '../../contexts/LocationContext';
import { APP_CONFIG } from '../../lib/appConfig';

export function Footer() {
  const { userLocation, openLocationModal } = useLocationContext();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#090D16]/95 backdrop-blur-2xl text-gray-400 overflow-hidden">
      {/* Subtle background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#8A2BE2]/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Value Proposition Strip */}
      <div className="border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Zero Brokerage Always</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Connect directly with PG, hostel, and mess owners. Never pay broker commission or hidden fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">100% Verified Places</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Photos, real amenities (AC, RO water, Wi-Fi, power backup), and genuine student reviews.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Hyper-Local Hub Search</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Filter by major coaching centers, silent libraries, metro stations, and university zones.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Student Community Driven</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Buy & sell study modules, chairs, coolers, and calculate precise monthly living expenses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Col (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#E5AA38]/40 via-transparent to-[#38BDF8]/40 border border-[#F5B731]/40 group-hover:border-[#FFE58F] transition-all duration-300 shadow-[0_0_18px_rgba(245,183,49,0.3)] group-hover:shadow-[0_0_28px_rgba(245,183,49,0.6)] group-hover:scale-105">
                <img
                  src="/logo.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                  }}
                  alt="Studolink 3D Logo"
                  className="h-9 w-9 object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-white tracking-tight">
                  Studo<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2]">link</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-[#F5B731]/10 text-[#F5B731] border border-[#F5B731]/30">
                  OFFICIAL 3D
                </span>
              </div>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed">
              Studolink — Your City. Your Student Ecosystem. India's student-first zero-brokerage educational helpline & habitat directory. Supporting aspirants in Kota, Patna, Delhi, Sikar, and 20+ study hubs with verified PGs, clean food & quiet libraries.
            </p>

            {/* Official Domain & Server Status */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <Globe className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="text-gray-400">Web Portal:</span>
                <a 
                  href="https://studolink.imprince.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-[#00E5FF] hover:underline inline-flex items-center gap-1"
                >
                  studolink.imprince.me
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 font-medium">All Educational Hubs Active</span>
              </div>
            </div>

            {/* Active City Pill */}
            <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="text-gray-300">
                City: <strong className="text-white">{userLocation?.city || 'All India'}</strong>
              </span>
              <button
                type="button"
                onClick={openLocationModal}
                className="text-[11px] font-bold text-[#00E5FF] hover:underline px-1.5 py-0.5 rounded bg-[#00E5FF]/10 cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>

          {/* Student Services (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Student Services</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/search?category=PG%20%2F%20Hostel" className="hover:text-[#00E5FF] transition-colors">
                  PGs & Hostels
                </Link>
              </li>
              <li>
                <Link to="/search?category=Mess%20%2F%20Tiffin" className="hover:text-[#00E5FF] transition-colors">
                  Mess & Tiffin Food
                </Link>
              </li>
              <li>
                <Link to="/search?category=Library" className="hover:text-[#00E5FF] transition-colors">
                  AC Study Libraries
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  <span>Student Marketplace</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#00E5FF]/20 text-[#00E5FF]">New</span>
                </Link>
              </li>
              <li>
                <Link to="/budget" className="hover:text-[#00E5FF] transition-colors">
                  Budget Calculator
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5 font-bold text-white">
                  <span className="text-[#00E5FF]">✨ AI Mitra Guide</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-gradient-to-r from-[#8A2BE2] to-[#00E5FF] text-white">24/7</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Hubs (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Top Coaching Hubs</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/search" state={{ city: 'Kota' }} className="hover:text-[#00E5FF] transition-colors flex items-center justify-between">
                  <span>Kota, Rajasthan</span>
                  <span className="text-[10px] text-gray-500">JEE/NEET</span>
                </Link>
              </li>
              <li>
                <Link to="/search" state={{ city: 'Patna' }} className="hover:text-[#00E5FF] transition-colors flex items-center justify-between">
                  <span>Patna, Bihar</span>
                  <span className="text-[10px] text-gray-500">BPSC/Govt</span>
                </Link>
              </li>
              <li>
                <Link to="/search" state={{ city: 'Delhi' }} className="hover:text-[#00E5FF] transition-colors flex items-center justify-between">
                  <span>Delhi NCR</span>
                  <span className="text-[10px] text-gray-500">UPSC/DU</span>
                </Link>
              </li>
              <li>
                <Link to="/search" state={{ city: 'Sikar' }} className="hover:text-[#00E5FF] transition-colors flex items-center justify-between">
                  <span>Sikar, Rajasthan</span>
                  <span className="text-[10px] text-gray-500">Piprali Rd</span>
                </Link>
              </li>
              <li>
                <Link to="/search" state={{ city: 'Prayagraj' }} className="hover:text-[#00E5FF] transition-colors flex items-center justify-between">
                  <span>Prayagraj, UP</span>
                  <span className="text-[10px] text-gray-500">State PCS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Section (2 cols) - Enhanced with Real Platform Information */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Legal & Support</span>
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/help" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5 font-bold text-white">
                  <HelpCircle className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Help & Support</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#00E5FF]/20 text-[#00E5FF]">24x7</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#00E5FF]" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-[#8A2BE2]" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Student Safety & Scams</span>
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=listing-policy" className="hover:text-[#00E5FF] transition-colors">
                  Listing & Verification Rules
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=grievance" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                  <span>Grievance Officer</span>
                  <span className="text-[9px] text-[#00E5FF] font-mono">IT Act</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Owners & Quick Actions (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">For Owners & Students</h5>
            <div className="space-y-2.5">
              <Link 
                to="/add-listing" 
                className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-white/15 hover:border-[#00E5FF]/40 transition-all block group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] group-hover:bg-[#00E5FF] group-hover:text-black transition-colors">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                      List Property For Free
                    </h6>
                    <p className="text-[10px] text-gray-400 mt-0.5">Reach 10,000+ verified students directly</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/sell-item" 
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all block group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-300 group-hover:bg-[#00E5FF] group-hover:text-black transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                      Sell Second-Hand Gear
                    </h6>
                    <p className="text-[10px] text-gray-400 mt-0.5">Books, study tables, coolers & cycles</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Student Safety & Emergency Support Strip */}
      <div className="border-t border-b border-white/10 bg-white/[0.02] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-center md:text-left flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold uppercase tracking-wider text-[10px]">
              <Phone className="w-3 h-3" />
              Student Support & Safety
            </span>
            <span className="text-gray-300">
              National Student Mental Health Tele-MANAS: <strong className="text-white">14416</strong> (Toll Free) • Police: <strong className="text-white">112</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Support: <a href={`mailto:${APP_CONFIG.supportEmail}`} className="text-white hover:underline">{APP_CONFIG.supportEmail}</a></span>
            </span>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-purple-400" />
              <span>App Issues: <a href={`mailto:${APP_CONFIG.developerEmail}`} className="text-white hover:underline">{APP_CONFIG.developerEmail}</a></span>
            </span>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-gray-400">
              <Lock className="w-3 h-3 text-[#00E5FF]" />
              <span>SSL Secured & Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3.5 Intermediary Disclaimer Bar */}
      <div className="border-t border-white/5 py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[11px] text-gray-500 text-center leading-relaxed">
        <p>
          <strong className="text-gray-400">Intermediary Notice:</strong> Studolink is a technology directory connecting students with independent property owners under Section 79 of the Information Technology Act, 2000. We do not own, manage, or operate listed properties. Please physically inspect premises, verify identity, and review our{' '}
          <Link to="/terms" className="text-[#00E5FF] hover:underline font-semibold">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/safety" className="text-amber-400 hover:underline font-semibold">
            Safety Advisory
          </Link>{' '}
          before paying deposits or moving in.
        </p>
      </div>

      {/* 4. Bottom Copyright, Legal Quick Links & Back to Top */}
      <div className="py-6 pb-24 md:pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} <strong>Studolink</strong> (studolink.imprince.me).
          </p>
          <span className="hidden sm:inline text-gray-600">•</span>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 text-gray-300 transition-all group"
          >
            <img
              src="/founder.jpg"
              alt="Prince Raj"
              className="w-5 h-5 rounded-full object-cover border border-cyan-400/40 group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-[11px]">
              Crafted with ❤️ by <strong className="text-white group-hover:text-cyan-300 font-bold transition-colors">Prince Raj</strong>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link to="/help" className="text-[#00E5FF] font-bold hover:underline transition-colors">Help & FAQs</Link>
          <Link to="/privacy" className="hover:text-[#00E5FF] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#00E5FF] transition-colors">Terms of Service</Link>
          <Link to="/safety" className="hover:text-amber-300 transition-colors">Safety Advisory</Link>
          <Link to="/legal?tab=grievance" className="hover:text-white transition-colors">Grievance</Link>
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-[#00E5FF]/20 text-gray-400 hover:text-[#00E5FF] border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer ml-1"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold hidden sm:inline">Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
