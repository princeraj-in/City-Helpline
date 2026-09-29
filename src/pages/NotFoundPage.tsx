import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, MessageSquare, Compass, ArrowLeft } from 'lucide-react';
import { LiquidButton } from '../components/ui/LiquidButton';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-[#0E131F]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Neon Glow Accents */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00E5FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8A2BE2]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#00E5FF]/20 to-[#8A2BE2]/20 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.2)]">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1 rounded-full border border-[#00E5FF]/30">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-400">
            Aap jis page ko dhoondh rahe hain wo exist nahi karta ya move ho chuka hai.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link to="/" className="w-full">
            <LiquidButton variant="primary" className="w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go to Home (मुख्य पृष्ठ)
            </LiquidButton>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/search">
              <LiquidButton variant="secondary" className="w-full text-xs flex items-center justify-center gap-1.5 py-2.5">
                <Search className="w-3.5 h-3.5 text-[#00E5FF]" />
                Find Hostels
              </LiquidButton>
            </Link>
            <Link to="/chat">
              <LiquidButton variant="secondary" className="w-full text-xs flex items-center justify-center gap-1.5 py-2.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#8A2BE2]" />
                Ask AI Mitra
              </LiquidButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
