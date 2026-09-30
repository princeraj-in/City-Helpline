import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Listing } from '../types';
import { 
  Search, 
  Building2, 
  BookOpen, 
  Coffee, 
  GraduationCap, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Compass, 
  Zap, 
  ChevronRight,
  TrendingUp,
  HeartHandshake,
  Calculator,
  Utensils,
  IndianRupee,
  X
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { motion } from 'motion/react';
import { ListingCard } from '../components/ListingCard';
import { useLocationContext } from '../contexts/LocationContext';
import { Footer } from '../components/layout/Footer';
import { ListingsGridSkeleton } from '../components/common/SkeletonLoaders';
import { SEOHead } from '../components/common/SEOHead';

export default function Home() {
  const { userLocation, openLocationModal } = useLocationContext();
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Fetch approved listings safely with timeout safeguard
      const approvedQ = query(
        collection(db, 'listings'),
        where('status', '==', 'approved')
      );
      const snapshot = await Promise.race([
        getDocs(approvedQ),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), 5000))
      ]);
      const allApproved = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      
      // Sort client-side by createdAt descending
      allApproved.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAllListings(allApproved);
    } catch (error) {
      console.warn("Notice: Initial listing fetch delayed or offline:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Featured places: prioritize places from user's city if available
  const featuredListings = useMemo(() => {
    if (!userLocation?.city) {
      const feat = allListings.filter(l => l.featured);
      return feat.length > 0 ? feat.slice(0, 3) : allListings.slice(0, 3);
    }
    const localFeat = allListings.filter(l => l.featured && l.city?.toLowerCase().trim() === userLocation.city.toLowerCase().trim());
    const otherFeat = allListings.filter(l => l.featured && l.city?.toLowerCase().trim() !== userLocation.city.toLowerCase().trim());
    const combined = [...localFeat, ...otherFeat];
    return combined.length > 0 ? combined.slice(0, 3) : allListings.slice(0, 3);
  }, [allListings, userLocation?.city]);

  // Recently added: prioritize user's city
  const recentListings = useMemo(() => {
    if (!userLocation?.city) return allListings.slice(0, 6);
    const local = allListings.filter(l => l.city?.toLowerCase().trim() === userLocation.city.toLowerCase().trim());
    const others = allListings.filter(l => l.city?.toLowerCase().trim() !== userLocation.city.toLowerCase().trim());
    return [...local, ...others].slice(0, 6);
  }, [allListings, userLocation?.city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search', { 
        state: { 
          query: searchQuery.trim(),
          city: userLocation?.city || ''
        } 
      });
    } else {
      navigate('/search', {
        state: {
          city: userLocation?.city || ''
        }
      });
    }
  };

  const categories = [
    { 
      name: 'PG', 
      title: 'PGs & Hostels',
      description: 'Single, twin & triple sharing with high-speed Wi-Fi, laundry & food',
      price: 'From ₹4,500/mo',
      icon: Building2, 
      color: 'text-[#00E5FF]', 
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      badge: 'Most Popular'
    },
    { 
      name: 'Library', 
      title: 'Silent Study Libraries',
      description: 'Air-conditioned 24/7 reading halls, personal lockers & soundproof cabins',
      price: 'From ₹799/mo',
      icon: BookOpen, 
      color: 'text-[#8A2BE2]', 
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
      badge: '24/7 Access'
    },
    { 
      name: 'Mess', 
      title: 'Hygienic Mess & Tiffin',
      description: 'Nutritious daily meals, North & South Indian kitchens, pure veg options',
      price: 'From ₹2,400/mo',
      icon: Coffee, 
      color: 'text-[#FF3B3B]', 
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      badge: 'FSSAI Verified'
    },
    { 
      name: 'Coaching Institute', 
      title: 'Premier Coaching Hubs',
      description: 'Top faculty centers for NEET, JEE, UPSC, CA & State competitive exams',
      price: 'Top Faculties',
      icon: GraduationCap, 
      color: 'text-[#00E5FF]', 
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      badge: 'Proven Results'
    },
  ];

  const studentHubs = [
    {
      city: 'Kota',
      state: 'Rajasthan',
      tagline: 'The Coaching Capital of India',
      areas: 'Landmark City, Rajiv Gandhi Nagar, Coral Park',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
      count: '350+ Places'
    },
    {
      city: 'Delhi',
      state: 'NCR',
      tagline: 'University & UPSC Hub',
      areas: 'North Campus, Mukherjee Nagar, Karol Bagh, Laxmi Nagar',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      count: '520+ Places'
    },
    {
      city: 'Patna',
      state: 'Bihar',
      tagline: 'Boring Road & Kankarbagh Hub',
      areas: 'Boring Road, Kankarbagh, Bazar Samiti, Musallahpur',
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
      count: '280+ Places'
    },
    {
      city: 'Bengaluru',
      state: 'Karnataka',
      tagline: 'Tech & Professional Academies',
      areas: 'Koramangala, HSR Layout, Electronic City, BTM',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      count: '410+ Places'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white overflow-hidden">
      <SEOHead />
      
      {/* Ambient Visual Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#00E5FF]/15 via-[#8A2BE2]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#8A2BE2]/15 blur-[160px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#00E5FF]/10 blur-[150px] rounded-full" />
      </div>

      {/* 1. HERO SECTION (Split Visual Architecture with Liquid Glass) */}
      <section className="relative pt-12 md:pt-20 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left: High-Impact Typography & Interactive Search */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-[0_0_25px_rgba(0,229,255,0.15)]"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-200">
                Verified Student Habitat Network
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
                0% Brokerage
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-white"
            >
              Find Your Ideal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-indigo-300">
                Student Habitat.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed"
            >
              A hyper-local ecosystem for student accommodations, 24/7 quiet libraries, healthy meal services, and top coaching institutes across India's leading education hubs.
            </motion.p>

            {/* Interactive Liquid Glass Search Engine */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative max-w-2xl z-20"
            >
              <div className="relative p-2 rounded-[28px] bg-slate-950/70 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1.5px_1px_rgba(255,255,255,0.3),0_0_25px_rgba(0,229,255,0.15)] flex flex-col sm:flex-row items-center gap-2 group transition-all duration-300 focus-within:border-[#00E5FF]/60">
                {/* Text query input */}
                <div className="flex items-center flex-grow w-full px-4 py-2">
                  <Search className="h-5 w-5 text-[#00E5FF] mr-3 shrink-0" />
                  <input
                    type="text"
                    placeholder={userLocation?.city ? `Search PGs, libraries, coaching in ${userLocation.city}...` : "Search PG, hostel, library, coaching, area..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-0 font-medium py-1"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors mr-2"
                    >
                      <span className="sr-only">Clear</span>
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Search Submit Button */}
                <LiquidButton
                  type="submit"
                  className="whitespace-nowrap rounded-2xl py-3 px-8 text-sm font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] w-full sm:w-auto shrink-0 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </LiquidButton>
              </div>

              {/* Fast Category Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 pt-4 px-1">
                <span className="text-xs text-gray-400 font-medium mr-1">Trending:</span>
                {['Single Room PG', 'AC Library 24/7', 'Pure Veg Mess', 'Allen / Kota Coaching'].map((trend) => (
                  <button
                    key={trend}
                    type="button"
                    onClick={() => navigate('/search', { state: { query: trend } })}
                    className="text-xs px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-gray-300 hover:text-white transition-all backdrop-blur-md"
                  >
                    {trend}
                  </button>
                ))}
              </div>
            </motion.form>

            {/* Trust Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-xl"
            >
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Direct Owner Contact</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#00E5FF]">₹0</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Brokerage Fees</p>
              </div>
              <div>
                <p className="text-2xl font-black text-purple-400">4.9 ★</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Student Rated</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Right: Multi-layered Glass Visual Showcase with Imagery */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Backing Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#00E5FF]/20 to-[#8A2BE2]/25 rounded-[38px] blur-2xl opacity-70 pointer-events-none" />

              {/* Main Feature Visual Frame */}
              <div className="relative rounded-[32px] overflow-hidden border border-white/20 shadow-2xl bg-slate-900/60 backdrop-blur-xl group">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80"
                    alt="Premium Student Room"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/30 to-transparent" />
                  
                  {/* Category Chip Over Image */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                      Handpicked Student Setup
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-[11px] font-bold text-emerald-300 shadow-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Base Card Info Inside Frame */}
                <div className="p-6 relative z-10 bg-gradient-to-b from-transparent to-[#0B0F1A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]">Deluxe Study Suite PG</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      4.95 (148 reviews)
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white">Scholar’s Haven Co-Living</h3>
                  <p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
                    Landmark City, Kota • 500m from Top Coaching Hubs
                  </p>
                </div>
              </div>

              {/* Floating Liquid Glass Overlay 1: 24/7 Library Pass */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-6 left-2 sm:-bottom-8 sm:-left-8 z-20"
              >
                <div className="p-2.5 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/25 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center gap-2.5 sm:gap-3.5 hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                    <img
                      src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=200&q=80"
                      alt="Study Library"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="inline-block text-[9px] sm:text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider">Silent Library</span>
                    <p className="text-xs font-bold text-white leading-tight">24/7 Soundproof Cabin</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-300">High-speed Wi-Fi & AC</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Liquid Glass Overlay 2: Direct Contact Owner */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -top-4 right-2 sm:-top-6 sm:-right-6 z-20"
              >
                <div className="p-2.5 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/25 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center gap-2.5 sm:gap-3 hover:scale-105 transition-transform duration-300">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Direct Connect</p>
                    <p className="text-[9px] sm:text-[10px] text-emerald-300 font-semibold">Zero Commission Fee</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. VISUAL CATEGORY EXPLORER WITH IMAGERY */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              Categorical Directory
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Essential Student Services
            </h2>
            <p className="text-gray-400 text-sm mt-1">Everything an aspirant needs to live comfortably and excel academically</p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#00E5FF] hover:text-white transition-colors bg-white/[0.05] hover:bg-white/[0.1] px-5 py-2.5 rounded-2xl border border-white/15 backdrop-blur-xl shadow-lg self-start sm:self-auto group"
          >
            Explore All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Link
                  to="/search"
                  state={{ category: cat.name, city: userLocation?.city || '' }}
                  className="block h-full group"
                >
                  <div className="relative h-full rounded-[28px] overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] group-hover:border-[#00E5FF]/50 group-hover:shadow-[0_20px_40px_rgba(0,229,255,0.18)] transition-all duration-500 flex flex-col justify-between">
                    
                    {/* Visual Image Header */}
                    <div className="h-48 w-full relative overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/50 to-transparent" />
                      
                      {/* Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-gray-200 uppercase tracking-wider">
                          {cat.badge}
                        </span>
                      </div>

                      {/* Icon overlay */}
                      <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.1] backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:bg-[#00E5FF] transition-colors duration-300">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-white group-hover:text-[#00E5FF] transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-gray-300/80 mt-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-300">{cat.price}</span>
                        <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center group-hover:bg-[#00E5FF] group-hover:text-black transition-all">
                          <ArrowRight className="w-4 h-4 text-white group-hover:text-slate-950 transition-colors" />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. PREMIER STUDENT HUBS & CITIES WITH PHOTOGRAPHY */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              Major Academic Clusters
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Explore Top Student Cities
            </h2>
            <p className="text-gray-400 text-sm mt-1">Discover prime neighborhoods near institutes, universities, and coaching centers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentHubs.map((hub, index) => (
            <motion.div
              key={hub.city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <button
                type="button"
                onClick={() => navigate('/search', { state: { city: hub.city } })}
                className="w-full text-left h-full group"
              >
                <div className="relative h-full rounded-[28px] overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-xl group-hover:border-purple-400/50 group-hover:shadow-[0_20px_40px_rgba(138,43,226,0.2)] transition-all duration-500 flex flex-col justify-between">
                  <div className="h-52 w-full relative overflow-hidden">
                    <img
                      src={hub.image}
                      alt={hub.city}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/40 to-transparent" />
                    
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-md">
                        {hub.city}, {hub.state}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-400/40 text-[10px] font-bold text-purple-300">
                        {hub.count}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 z-10">
                      <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{hub.tagline}</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      <span className="font-semibold text-white">Popular areas:</span> {hub.areas}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#00E5FF] group-hover:translate-x-1 transition-transform">
                      <span>Browse {hub.city} listings</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. TRUST & STUDENT ASSURANCE (Bento Grid) */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <LiquidGlassCard className="p-8 sm:p-12" glowColor="rgba(0, 229, 255, 0.2)">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
              Built For Aspirants & Parents
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Choose Studolink?
            </h2>
            <p className="text-gray-300/80 text-sm mt-2">
              We eliminate deceptive brokers, hidden charges, and fake listings with direct transparent verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mb-5 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Zero Brokerage Guarantee</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Connect directly with property managers and library coordinators. No hidden agent commissions or middleman markups.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-5 shadow-[0_0_15px_rgba(138,43,226,0.2)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Real Amenities</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Listings clearly state power backup, CCTV security, food quality, Wi-Fi speed, and quiet study room policies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Honest Student Reviews</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Authentic ratings and feedback from students who actually stayed, studied, or dined at the establishment.
              </p>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      {/* 5. FEATURED & RECENT LISTINGS SHOWCASE */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-32 bg-white/[0.08] rounded-full animate-pulse mb-3" />
                <div className="h-8 w-60 bg-white/[0.09] rounded-xl animate-pulse mb-2" />
                <div className="h-4 w-72 bg-white/[0.05] rounded-md animate-pulse" />
              </div>
            </div>
            <ListingsGridSkeleton count={3} />
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {featuredListings.length > 0 && (
              <div className="mb-24">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Star className="h-3 w-3 fill-yellow-400" />
                      Premium Selections
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                      Featured Places
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Highest rated accommodations and study hubs</p>
                  </div>
                  <Link 
                    to="/search" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#00E5FF] hover:text-white transition-colors bg-white/[0.05] hover:bg-white/[0.1] px-5 py-2.5 rounded-2xl border border-white/15 backdrop-blur-xl shadow-lg group"
                  >
                    View All Places <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                  {featuredListings.map((listing, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      key={listing.id}
                      className="h-full card-content-auto"
                    >
                      <ListingCard listing={listing} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Added Section */}
            <div className="mb-20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-2">
                    <TrendingUp className="h-3 w-3" />
                    Fresh on Directory
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    Recently Added
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Newly verified rooms, libraries, and mess facilities</p>
                </div>
                <Link 
                  to="/search" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#00E5FF] hover:text-white transition-colors bg-white/[0.05] hover:bg-white/[0.1] px-5 py-2.5 rounded-2xl border border-white/15 backdrop-blur-xl shadow-lg group"
                >
                  Explore All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {recentListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                  {recentListings.map((listing, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      key={listing.id}
                      className="h-full card-content-auto"
                    >
                      <ListingCard listing={listing} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <GlassCard className="p-16 text-center border-dashed border-2 border-white/10 relative overflow-hidden" intensity="low">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 to-[#8A2BE2]/20 rounded-full blur-xl animate-pulse" />
                      <div className="h-24 w-24 bg-white/[0.06] backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-xl relative z-10">
                        <Search className="h-10 w-10 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">No listings yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto text-base leading-relaxed">
                      Check back later for new places or be the first contributor to add a student listing.
                    </p>
                    <div className="mt-6">
                      <LiquidButton onClick={() => navigate('/add-listing')} className="px-6 py-2.5">
                        Add a Listing
                      </LiquidButton>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          </>
        )}
      </section>

      {/* 5. MONTHLY STUDENT BUDGET ESTIMATOR SECTION */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <LiquidGlassCard className="p-8 sm:p-12 relative overflow-hidden" glowColor="rgba(0, 229, 255, 0.2)">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                <span>Monthly Budget Estimator • खर्च कैलकुलेटर</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Planning to Move to {userLocation?.city || 'a New Study Hub'}? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-indigo-300">
                  Calculate Your Living Cost First
                </span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Get an exact breakdown for Room Rent (Single/Double AC), 3-meal Mess, 24x7 Study Library pass, and Local Commute in Kota, Patna, Delhi, and 20+ student cities.
              </p>

              {/* Sample cost comparison tags */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-gray-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Rooms from <strong>₹3,500/mo</strong></span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-gray-300 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  <span>Healthy Mess from <strong>₹2,400/mo</strong></span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-gray-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>AC Libraries from <strong>₹600/mo</strong></span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link to="/budget">
                  <LiquidButton
                    variant="primary"
                    className="px-7 py-3 text-sm font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.4)]"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Calculate Monthly Budget</span>
                    <ArrowRight className="w-4 h-4" />
                  </LiquidButton>
                </Link>
                <span className="text-xs text-gray-400">
                  Instant WhatsApp breakdown for parents
                </span>
              </div>
            </div>

            {/* Visual Budget Mini Card */}
            <div className="lg:col-span-5">
              <GlassCard className="p-6 rounded-3xl border border-white/15 space-y-4 shadow-2xl relative" intensity="high">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Typical Hub Allocation
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {userLocation?.city || 'Kota / Patna'}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-300">🏠 Double Sharing Room</span>
                      <span className="text-white font-bold">₹4,800/mo (48%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="w-[48%] h-full bg-[#00E5FF] rounded-full shadow-[0_0_8px_#00E5FF]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-300">🍲 Full Mess (3 Meals)</span>
                      <span className="text-white font-bold">₹2,800/mo (28%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="w-[28%] h-full bg-amber-400 rounded-full shadow-[0_0_8px_#F59E0B]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-300">📚 AC Study Library</span>
                      <span className="text-white font-bold">₹800/mo (8%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="w-[8%] h-full bg-purple-400 rounded-full shadow-[0_0_8px_#A855F7]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-300">🚲 Travel, Laundry & Misc</span>
                      <span className="text-white font-bold">₹1,400/mo (16%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="w-[16%] h-full bg-emerald-400 rounded-full shadow-[0_0_8px_#10B981]" />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Optimal Monthly Total:</span>
                  <span className="text-xl font-black text-white">₹9,800 <span className="text-xs font-normal text-gray-400">/ mo</span></span>
                </div>
              </GlassCard>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      {/* 7. HOST / AMBASSADOR CTA LIQUID GLASS BANNER */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <LiquidGlassCard className="p-8 sm:p-14 relative overflow-hidden" glowColor="rgba(138, 43, 226, 0.25)">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                For Property Owners & Educators
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Own a PG, Library or Mess? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-purple-400">
                  List On Studolink Free
                </span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Reach thousands of genuine students moving to Kota, Delhi, Patna, and top study hubs every month. Get direct calls on phone and WhatsApp without brokerage deductions.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
              <LiquidButton
                onClick={() => navigate('/add-listing')}
                className="w-full py-4 text-base font-bold shadow-[0_0_25px_rgba(0,229,255,0.4)]"
              >
                List Your Property
              </LiquidButton>
              <Link
                to="/search"
                className="w-full text-center py-3.5 px-6 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-sm font-semibold text-white backdrop-blur-xl transition-all shadow-md"
              >
                Browse Student Directory
              </Link>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      {/* Footer - Exclusive to Home Page */}
      <Footer />
    </div>
  );
}
