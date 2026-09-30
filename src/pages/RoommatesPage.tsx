import React, { useState, useEffect, useMemo } from 'react';
import { RoommateProfile } from '../types';
import { getRoommateProfiles } from '../lib/roommateService';
import { RoommateCard } from '../components/roommate/RoommateCard';
import { RoommateModal } from '../components/roommate/RoommateModal';
import { RoommateConnectModal } from '../components/roommate/RoommateConnectModal';
import { RoommatesGridSkeleton } from '../components/common/SkeletonLoaders';
import { useLocationContext } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import { ALL_CITIES } from '../lib/constants';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { SEOHead } from '../components/common/SEOHead';
import { motion } from 'motion/react';
import { 
  BedDouble, Search, PlusCircle, Filter, 
  MapPin, Moon, Sun, Utensils, Users, Sparkles, X, ShieldCheck 
} from 'lucide-react';
import { toast } from 'sonner';

export default function RoommatesPage() {
  const { userLocation, openLocationModal } = useLocationContext();
  const { currentUser } = useAuth();

  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [examFilter, setExamFilter] = useState<string>('All');
  const [studyTimeFilter, setStudyTimeFilter] = useState<string>('All');
  const [dietFilter, setDietFilter] = useState<string>('All');

  // Modals
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<RoommateProfile | null>(null);
  const [connectingProfile, setConnectingProfile] = useState<RoommateProfile | null>(null);

  // Default city to userLocation on initial load
  useEffect(() => {
    if (userLocation?.city && !selectedCity) {
      setSelectedCity(userLocation.city);
    }
  }, [userLocation?.city]);

  // Load profiles
  useEffect(() => {
    const fetchRoommates = async () => {
      setLoading(true);
      try {
        const data = await getRoommateProfiles();
        setProfiles(data);
      } catch (err) {
        console.warn('Error loading roommates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoommates();
  }, []);

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      // 1. City Filter
      if (selectedCity && selectedCity !== 'All' && selectedCity.trim() !== '') {
        const pCity = p.city?.toLowerCase().trim() || '';
        const target = selectedCity.toLowerCase().trim();
        if (!pCity.includes(target) && !target.includes(pCity)) {
          return false;
        }
      }

      // 2. Gender
      if (genderFilter !== 'all' && p.gender !== genderFilter) {
        return false;
      }

      // 3. Exam
      if (examFilter !== 'All') {
        const examLower = p.targetExam.toLowerCase();
        if (!examLower.includes(examFilter.toLowerCase())) {
          return false;
        }
      }

      // 4. Study Habit
      if (studyTimeFilter !== 'All') {
        if (!p.habits.studyTime.toLowerCase().includes(studyTimeFilter.toLowerCase())) {
          return false;
        }
      }

      // 5. Diet
      if (dietFilter !== 'All') {
        if (!p.habits.dietary.toLowerCase().includes(dietFilter.toLowerCase())) {
          return false;
        }
      }

      // 6. Search query
      if (searchQuery.trim() !== '') {
        const queryLower = searchQuery.toLowerCase().trim();
        const matchName = p.userName.toLowerCase().includes(queryLower);
        const matchLoc = p.locality.toLowerCase().includes(queryLower);
        const matchExam = p.targetExam.toLowerCase().includes(queryLower);
        const matchBio = p.bio.toLowerCase().includes(queryLower);
        if (!matchName && !matchLoc && !matchExam && !matchBio) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, selectedCity, genderFilter, examFilter, studyTimeFilter, dietFilter, searchQuery]);

  const handleOpenListModal = () => {
    if (!currentUser) {
      toast.error('Please sign in first to list your roommate requirements');
      return;
    }
    const myProfile = profiles.find(p => p.userId === currentUser.uid);
    setEditingProfile(myProfile || null);
    setIsListModalOpen(true);
  };

  const handleSaved = (saved: RoommateProfile) => {
    setProfiles(prev => {
      const idx = prev.findIndex(p => p.id === saved.id || p.userId === saved.userId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-12"
    >
      <SEOHead />
      {/* Top Banner Card */}
      <LiquidGlassCard className="p-6 sm:p-10 mb-8 relative overflow-hidden" glowColor="rgba(0, 229, 255, 0.3)">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[11px] font-bold text-cyan-300 tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <BedDouble className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
              <span>Student Roommate & Flatmate Finder • रूममेट खोजें</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Find Ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-indigo-300">Roommates</span>
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Match with focused students preparing for NEET, JEE, or UPSC. Filter by study hours (Night Owl / Early Bird), diet, budget, and book a room sharing partner directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenListModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-cyan-400 to-indigo-500 hover:brightness-110 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Myself as Roommate</span>
            </button>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.03] border border-white/10 mb-8 space-y-3.5 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search locality, coaching, name..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#00E5FF]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* City Select */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#00E5FF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
            >
              <option value="All">All Cities (Pan-India)</option>
              {ALL_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex rounded-xl bg-white/[0.04] border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setGenderFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                genderFilter === 'all' ? 'bg-[#00E5FF] text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('male')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                genderFilter === 'male' ? 'bg-[#00E5FF] text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              👨 Boys
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('female')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                genderFilter === 'female' ? 'bg-[#00E5FF] text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              👩 Girls
            </button>
          </div>

          {/* Exam Filter */}
          <select
            value={examFilter}
            onChange={e => setExamFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="All">All Exam Courses</option>
            <option value="NEET">NEET UG</option>
            <option value="JEE">JEE Main / Adv</option>
            <option value="UPSC">UPSC Civil Services</option>
            <option value="College">College / University</option>
          </select>
        </div>

        {/* Habits secondary chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06] text-xs">
          <span className="text-gray-400 text-[11px] font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Living Habits:
          </span>

          <button
            type="button"
            onClick={() => setStudyTimeFilter(studyTimeFilter === 'Night Owl' ? 'All' : 'Night Owl')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              studyTimeFilter === 'Night Owl'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-white/[0.04] text-gray-300 border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Night Owl</span>
          </button>

          <button
            type="button"
            onClick={() => setStudyTimeFilter(studyTimeFilter === 'Early Bird' ? 'All' : 'Early Bird')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              studyTimeFilter === 'Early Bird'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/[0.04] text-gray-300 border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Early Bird</span>
          </button>

          <button
            type="button"
            onClick={() => setDietFilter(dietFilter === 'Vegetarian' ? 'All' : 'Vegetarian')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              dietFilter === 'Vegetarian'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/[0.04] text-gray-300 border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            <Utensils className="w-3 h-3" />
            <span>Strict Veg</span>
          </button>

          {(selectedCity !== (userLocation?.city || 'All') || genderFilter !== 'all' || examFilter !== 'All' || studyTimeFilter !== 'All' || dietFilter !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCity(userLocation?.city || 'All');
                setGenderFilter('all');
                setExamFilter('All');
                setStudyTimeFilter('All');
                setDietFilter('All');
                setSearchQuery('');
              }}
              className="text-[11px] text-[#00E5FF] hover:underline ml-auto font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Roommates */}
      {loading ? (
        <RoommatesGridSkeleton count={6} />
      ) : filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfiles.map(p => (
            <RoommateCard
              key={p.id}
              profile={p}
              onConnect={item => setConnectingProfile(item)}
              isCurrentUser={currentUser ? p.userId === currentUser.uid : false}
              onEdit={() => {
                setEditingProfile(p);
                setIsListModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-3 text-[#00E5FF]">
            <BedDouble className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Flatmates Found</h3>
          <p className="text-xs text-gray-400 mb-5 leading-relaxed">
            No active roommate requests match your selected filters in {selectedCity || 'this city'}. Be the first student to post your room requirements!
          </p>
          <button
            type="button"
            onClick={handleOpenListModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-slate-950 font-bold text-xs shadow-lg active:scale-95"
          >
            + Post Your Roommate Requirement
          </button>
        </div>
      )}

      {/* Modals */}
      <RoommateModal
        isOpen={isListModalOpen}
        onClose={() => {
          setIsListModalOpen(false);
          setEditingProfile(null);
        }}
        existingProfile={editingProfile}
        onSaved={handleSaved}
      />

      <RoommateConnectModal
        profile={connectingProfile}
        onClose={() => setConnectingProfile(null)}
      />
    </motion.div>
  );
}
