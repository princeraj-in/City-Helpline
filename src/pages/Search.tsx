import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Listing } from '../types';
import { Search as SearchIcon, MapPin, Tag, Sparkles, X, Droplets, Navigation, Loader2, CheckCircle2, PlusCircle } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CATEGORIES, STATE_CITIES } from '../lib/constants';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { CategorySelect } from '../components/ui/CategorySelect';
import { LocationSelect } from '../components/ui/LocationSelect';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { ListingCard } from '../components/ListingCard';
import { useLocationContext } from '../contexts/LocationContext';
import { ListingsGridSkeleton } from '../components/common/SkeletonLoaders';

export default function Search() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { userLocation, openLocationModal, requestLiveLocation, isLoadingLocation } = useLocationContext();

  const initialQuery = location.state?.query || '';
  const initialCategory = location.state?.category || '';
  const initialCity = location.state?.city || userLocation?.city || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'city' | null>(null);

  // If userLocation updates and user hasn't explicitly chosen another city or cleared it initially
  useEffect(() => {
    if (!location.state?.city && userLocation?.city && !selectedCity) {
      setSelectedCity(userLocation.city);
    }
  }, [userLocation?.city, location.state?.city]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, 'listings'), 
          where('status', '==', 'approved')
        );
        const snapshot = await Promise.race([
          getDocs(q),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), 5000))
        ]);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setListings(data);
      } catch (error) {
        console.warn('Notice: Search listings fetch delayed or offline:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const categoryOptions = CATEGORIES.map(cat => ({ value: cat, label: cat }));
  
  const cityOptions = Object.entries(STATE_CITIES).flatMap(([state, cities]) => 
    cities.map(city => ({ value: city, label: city, group: state }))
  );

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? listing.category === selectedCategory : true;
    const matchesCity = selectedCity ? listing.city === selectedCity : true;
    
    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0"
    >
      <LiquidGlassCard className="p-8 md:p-10 mb-10 relative z-30 overflow-visible" overflowVisible={true} glowColor="rgba(0, 229, 255, 0.3)">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 backdrop-blur-md text-[11px] font-semibold text-cyan-300 tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <Droplets className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                <span>Liquid Optical Filter • Live Directory</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-indigo-300">Services</span>
              </h1>
              <p className="text-gray-300/80 text-sm mt-1">Explore verified student accommodations, silent libraries, coaching & dining</p>
            </div>

            <div className="self-start sm:self-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-xl text-xs font-semibold text-gray-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                {filteredListings.length} {filteredListings.length === 1 ? 'Place Found' : 'Places Found'}
              </span>
            </div>
          </div>

          {/* Amazon / Flipkart style Location bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
                Location:
              </span>
              {selectedCity ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] font-bold">
                  {selectedCity}
                  {userLocation?.city === selectedCity && userLocation?.isLiveDetected && (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      <Navigation className="w-2.5 h-2.5" /> GPS
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedCity('')}
                    className="hover:bg-cyan-500/20 rounded-full p-0.5 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                    title="Clear city filter (Show all cities)"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : (
                <span className="text-gray-400 font-medium">All Cities (Nationwide)</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              {userLocation?.city && userLocation.city !== selectedCity ? (
                <button
                  type="button"
                  onClick={() => setSelectedCity(userLocation.city)}
                  className="px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-gray-200 hover:text-white font-medium flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-[#00E5FF]" />
                  <span>Show My City ({userLocation.city})</span>
                </button>
              ) : !userLocation ? (
                <button
                  type="button"
                  onClick={() => requestLiveLocation(false)}
                  disabled={isLoadingLocation}
                  className="px-2.5 py-1 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/30 text-[#00E5FF] font-medium flex items-center gap-1 transition-all cursor-pointer"
                >
                  {isLoadingLocation ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Navigation className="w-3 h-3" />
                  )}
                  <span>Detect GPS Location</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={openLocationModal}
                className="px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-cyan-300 hover:text-white font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <MapPin className="w-3 h-3" />
                <span>{selectedCity ? 'Change City' : 'Choose City'}</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Search Input Inset Glass Chamber */}
            <div className="relative z-10 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00E5FF]/40 to-[#8A2BE2]/40 rounded-2xl blur-md opacity-30 group-focus-within:opacity-80 transition duration-500"></div>
              <div className="relative flex items-center bg-[rgba(255,255,255,0.06)] rounded-2xl border border-white/20 backdrop-blur-2xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.3)] focus-within:bg-[rgba(255,255,255,0.1)] focus-within:border-[#00E5FF]/60 transition-all duration-300">
                <SearchIcon className="absolute left-4 h-5 w-5 text-gray-400 group-focus-within:text-[#00E5FF] transition-colors" />
                <input
                  type="text"
                  placeholder="Search services, places, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 rounded-2xl text-sm md:text-base font-medium"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Category Select Glass Chamber */}
            <div className={`relative transition-all duration-300 ${activeDropdown === 'category' ? 'z-50' : activeDropdown === 'city' ? 'z-10' : 'z-20'} group`}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00E5FF]/30 to-[#8A2BE2]/30 rounded-2xl blur-md opacity-20 group-focus-within:opacity-70 transition duration-500"></div>
              <div className="relative bg-[rgba(255,255,255,0.06)] rounded-2xl border border-white/20 backdrop-blur-2xl h-full shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.3)] focus-within:bg-[rgba(255,255,255,0.1)] focus-within:border-[#00E5FF]/60 transition-all duration-300">
                <CategorySelect
                  value={selectedCategory}
                  onChange={(cat) => {
                    setSelectedCategory(cat);
                    setActiveDropdown(null);
                  }}
                  placeholder="All Categories"
                  isOpen={activeDropdown === 'category'}
                  onToggle={(open) => setActiveDropdown(open ? 'category' : null)}
                />
              </div>
            </div>
            
            {/* City Select Glass Chamber */}
            <div className={`relative transition-all duration-300 ${activeDropdown === 'city' ? 'z-50' : activeDropdown === 'category' ? 'z-10' : 'z-20'} group`}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8A2BE2]/30 to-[#00E5FF]/30 rounded-2xl blur-md opacity-20 group-focus-within:opacity-70 transition duration-500"></div>
              <div className="relative bg-[rgba(255,255,255,0.06)] rounded-2xl border border-white/20 backdrop-blur-2xl h-full shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.3)] focus-within:bg-[rgba(255,255,255,0.1)] focus-within:border-purple-400/60 transition-all duration-300">
                <LocationSelect
                  value={selectedCity}
                  onChange={(ct) => {
                    setSelectedCity(ct);
                    setActiveDropdown(null);
                  }}
                  placeholder="All Cities"
                  isOpen={activeDropdown === 'city'}
                  onToggle={(open) => setActiveDropdown(open ? 'city' : null)}
                />
              </div>
            </div>
          </div>

          {/* Quick Filter Droplet Pills */}
          <div className="flex flex-wrap items-center gap-3 mt-7 pt-6 border-t border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mr-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Filters:
            </span>
            {['PG', 'Hostel', 'Library', 'Mess', 'Coaching Institute', 'Study Room'].map((chip) => {
              const active = selectedCategory === chip;
              return (
                <button
                  key={chip}
                  onClick={() => {
                    setSelectedCategory(active ? '' : chip);
                    setActiveDropdown(null);
                  }}
                  className={`relative group px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
                    active
                      ? 'bg-gradient-to-r from-[#00E5FF]/25 to-blue-500/25 text-[#00E5FF] border-[#00E5FF]/70 shadow-[0_0_20px_rgba(0,229,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] scale-105'
                      : 'bg-white/[0.05] text-gray-300 border-white/15 hover:bg-white/[0.12] hover:border-white/30 hover:text-white hover:scale-102 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                  } backdrop-blur-xl`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />}
                    {chip}
                  </span>
                  {/* Subtle glass reflection highlight */}
                  <span className="absolute top-0 inset-x-2 h-[1px] bg-white/40 rounded-full pointer-events-none" />
                </button>
              );
            })}
            {(searchTerm || selectedCategory || selectedCity) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedCity('');
                  setActiveDropdown(null);
                }}
                className="ml-auto text-xs font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </LiquidGlassCard>

      {loading ? (
        <ListingsGridSkeleton count={6} />
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              key={listing.id}
              className="h-full card-content-auto"
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8"
        >
          <GlassCard className="p-16 text-center border-dashed border-2 border-white/10 relative overflow-hidden" intensity="low">
            {/* Decorative background for empty state */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 to-[#8A2BE2]/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="h-32 w-32 bg-[rgba(255,255,255,0.06)] backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-2xl relative z-10">
                  <SearchIcon className="h-12 w-12 text-gray-400" />
                  <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg">
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#00E5FF] to-[#8A2BE2]">?</span>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                {selectedCity ? `No results found in ${selectedCity}` : 'No results found'}
              </h3>
              <p className="text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
                {selectedCity 
                  ? `There are currently no listings matching your criteria in ${selectedCity}. Try clearing the city filter to browse across other hubs.`
                  : "We couldn't find any listings matching your search criteria. Try adjusting your filters or search terms."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {selectedCity && (
                  <LiquidButton 
                    onClick={() => setSelectedCity('')}
                    variant="primary"
                    className="px-6 py-2.5 text-xs font-bold"
                  >
                    View Places Across All Cities
                  </LiquidButton>
                )}
                <LiquidButton 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedCity('');
                  }}
                  variant="secondary"
                  className="px-6 py-2.5 text-xs font-bold"
                >
                  Clear All Filters
                </LiquidButton>
                <Link
                  to="/add-listing"
                  className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                >
                  <PlusCircle className="w-4 h-4 text-[#00E5FF]" />
                  <span>+ List Your PG / Service</span>
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}
