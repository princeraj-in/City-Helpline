import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MarketplaceItem, MarketplaceCategory, ItemCondition } from '../types';
import { INITIAL_MARKETPLACE_ITEMS } from '../lib/marketplaceData';
import { MARKETPLACE_CATEGORIES, STATE_CITIES } from '../lib/constants';
import { MarketplaceCard } from '../components/marketplace/MarketplaceCard';
import { MarketplaceDetailModal } from '../components/marketplace/MarketplaceDetailModal';
import { MarketplaceGridSkeleton } from '../components/common/SkeletonLoaders';
import { useLocationContext } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, Search, PlusCircle, MapPin, Navigation, 
  Filter, Tag, Sparkles, X, Loader2, ArrowUpDown, ShieldCheck, BookOpen, Wind, Bike, Armchair, Gift, Heart
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { motion } from 'motion/react';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategoryParam = searchParams.get('category');

  const { userLocation, openLocationModal, requestLiveLocation, isLoadingLocation } = useLocationContext();
  const { currentUser } = useAuth();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategoryParam === 'FreeStudy' || initialCategoryParam === 'Free Books & Notes') {
      return 'FreeStudy';
    }
    return 'All';
  });
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  
  // Default to user's detected city if available, otherwise 'All'
  const [selectedCity, setSelectedCity] = useState<string>('');

  const [selectedItemForModal, setSelectedItemForModal] = useState<MarketplaceItem | null>(null);

  // Sync city with userLocation on load
  useEffect(() => {
    if (userLocation?.city && !selectedCity) {
      setSelectedCity(userLocation.city);
    }
  }, [userLocation?.city]);

  useEffect(() => {
    const fetchMarketplaceItems = async () => {
      try {
        const q = query(
          collection(db, 'marketplace_items'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await Promise.race([
          getDocs(q),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Marketplace fetch timeout')), 5000))
        ]);

        const firestoreData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as MarketplaceItem));

        if (firestoreData.length > 0) {
          // Merge firestore with initial demo items that aren't duplicated
          const existingIds = new Set(firestoreData.map(d => d.id));
          const demoRemaining = INITIAL_MARKETPLACE_ITEMS.filter(demo => !existingIds.has(demo.id));
          setItems([...firestoreData, ...demoRemaining]);
        } else {
          setItems(INITIAL_MARKETPLACE_ITEMS);
        }
      } catch (err) {
        console.warn('Notice: Marketplace fetch delayed or offline, using demo essentials:', err);
        setItems(INITIAL_MARKETPLACE_ITEMS);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplaceItems();
  }, []);

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. City Filter
      if (selectedCity && selectedCity.trim() !== '') {
        const itemCity = item.city?.toLowerCase().trim() || '';
        const targetCity = selectedCity.toLowerCase().trim();
        if (!itemCity.includes(targetCity) && !targetCity.includes(itemCity)) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory === 'FreeStudy') {
        const isFree = item.price === 0 || item.title.toLowerCase().includes('free');
        if (!isFree) return false;
      } else if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Condition Filter
      if (selectedCondition !== 'All' && item.condition !== selectedCondition) {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim() !== '') {
        const queryLower = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(queryLower);
        const matchDesc = item.description.toLowerCase().includes(queryLower);
        const matchArea = item.area?.toLowerCase().includes(queryLower) || false;
        const matchCat = item.category.toLowerCase().includes(queryLower);
        if (!matchTitle && !matchDesc && !matchArea && !matchCat) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price_desc') {
        return b.price - a.price;
      }
      return b.createdAt - a.createdAt;
    });
  }, [items, selectedCity, selectedCategory, selectedCondition, searchQuery, sortBy]);

  const categoryChips = [
    { label: 'All Items', value: 'All', icon: Sparkles },
    { label: '🎁 Free Notes & Books (₹0)', value: 'FreeStudy', icon: Gift },
    { label: 'Books & Notes', value: 'Books & Notes', icon: BookOpen },
    { label: 'Coolers & Fans', value: 'Coolers & Fans', icon: Wind },
    { label: 'Cycles & Bikes', value: 'Cycles & Bikes', icon: Bike },
    { label: 'Study Furniture', value: 'Study Furniture', icon: Armchair },
    { label: 'Electronics', value: 'Electronics & Gadgets', icon: Tag },
    { label: 'Mattress & Bedding', value: 'Mattress & Bedding', icon: ShoppingBag }
  ];

  const handleItemUpdated = (updatedItem: MarketplaceItem) => {
    setItems(prev => prev.map(it => it.id === updatedItem.id ? updatedItem : it));
    if (selectedItemForModal?.id === updatedItem.id) {
      setSelectedItemForModal(updatedItem);
    }
  };

  const handleItemDeleted = (itemId: string) => {
    setItems(prev => prev.filter(it => it.id !== itemId));
    setSelectedItemForModal(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-0"
    >
      {/* Top Banner Card */}
      <LiquidGlassCard className="p-6 sm:p-10 mb-8 overflow-visible relative" glowColor="rgba(0, 229, 255, 0.3)">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 backdrop-blur-md text-[11px] font-semibold text-cyan-300 tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <ShoppingBag className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
              <span>Student Marketplace • छात्र बाज़ार</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Buy & Sell <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-indigo-300">Second-Hand</span>
            </h1>
            <p className="text-gray-300 text-sm mt-2 max-w-xl">
              Get Allen modules, coolers, study tables, cycles, and mattress from seniors at 50%–70% discount. No middlemen, directly contact student sellers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/sell-item">
              <LiquidButton
                variant="primary"
                className="px-6 py-3 font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell an Item / Post Ad</span>
              </LiquidButton>
            </Link>
          </div>
        </div>

        {/* Location & Search Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books, coolers, cycles, study tables..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#00E5FF] text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Selector Pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openLocationModal}
              className="h-10 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-gray-200 flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>{selectedCity ? `City: ${selectedCity}` : 'All Hubs (India)'}</span>
            </button>

            {selectedCity ? (
              <button
                type="button"
                onClick={() => setSelectedCity('')}
                className="h-10 px-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Show all cities"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">All Hubs</span>
              </button>
            ) : userLocation?.city ? (
              <button
                type="button"
                onClick={() => setSelectedCity(userLocation.city)}
                className="h-10 px-2.5 rounded-xl bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Show in {userLocation.city}</span>
              </button>
            ) : null}

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="h-10 px-3 rounded-xl bg-slate-900 border border-white/15 text-xs font-semibold text-gray-200 focus:outline-none focus:border-[#00E5FF] cursor-pointer"
            >
              <option value="newest">Latest Posted</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-2 pb-1 scrollbar-none">
          {categoryChips.map(chip => {
            const Icon = chip.icon;
            const isSelected = selectedCategory === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => setSelectedCategory(chip.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#00E5FF] text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </LiquidGlassCard>

      {/* Free Books & Notes Giveaway Special Banner */}
      {selectedCategory === 'FreeStudy' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-purple-500/10 to-cyan-500/15 border border-emerald-400/30 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base font-black text-white">
                  Free Books & Coaching Notes Exchange (₹0)
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Student Giveaway
                </span>
              </div>
              <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                All study materials listed here are 100% Free! Donated by seniors, rankers, and ex-students to help juniors in need. Contact donors on WhatsApp to collect directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <Link
              to="/sell-item?type=free"
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Donate Free Study Material</span>
            </Link>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">
            Available Items
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/[0.08] text-cyan-300 border border-white/10">
            {filteredItems.length}
          </span>
          {selectedCity && (
            <span className="text-xs text-gray-400 font-medium">
              in <strong className="text-gray-200">{selectedCity}</strong>
            </span>
          )}
        </div>

        {/* Condition Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">Condition:</span>
          <select
            value={selectedCondition}
            onChange={e => setSelectedCondition(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/15 text-xs text-gray-200 focus:outline-none focus:border-[#00E5FF] cursor-pointer"
          >
            <option value="All">All Conditions</option>
            <option value="Like New">Like New</option>
            <option value="Good Condition">Good Condition</option>
            <option value="Fair / Usable">Fair / Usable</option>
          </select>
        </div>
      </div>

      {/* Grid of Items */}
      {loading ? (
        <MarketplaceGridSkeleton count={8} />
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MarketplaceCard
              key={item.id}
              item={item}
              onOpenDetails={setSelectedItemForModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <GlassCard className="p-12 text-center border-dashed border-2 border-white/15 rounded-3xl" intensity="low">
          <div className="w-20 h-20 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center mx-auto mb-4 border border-[#00E5FF]/30">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {selectedCity ? `No items found in ${selectedCity}` : 'No marketplace items found'}
          </h3>
          <p className="text-gray-400 max-w-md mx-auto text-sm mb-6">
            {selectedCity 
              ? `Currently there are no active ads in ${selectedCity}. You can clear the city filter to browse across all student hubs or be the first student to post an ad!`
              : 'Try clearing your search terms or selecting a different category.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {selectedCity && (
              <LiquidButton
                variant="secondary"
                onClick={() => setSelectedCity('')}
                className="px-5 py-2.5 text-xs font-bold"
              >
                Browse Across All Cities
              </LiquidButton>
            )}
            <Link to="/sell-item">
              <LiquidButton
                variant="primary"
                className="px-6 py-2.5 text-xs font-bold"
              >
                Post First Ad in {selectedCity || 'Your City'}
              </LiquidButton>
            </Link>
          </div>
        </GlassCard>
      )}

      {/* Detail Modal */}
      {selectedItemForModal && (
        <MarketplaceDetailModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          onItemUpdated={handleItemUpdated}
          onItemDeleted={handleItemDeleted}
        />
      )}
    </motion.div>
  );
}
