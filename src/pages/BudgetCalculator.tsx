import React, { useState, useEffect, useMemo } from 'react';
import { useLocationContext } from '../../src/contexts/LocationContext';
import { STATE_CITIES } from '../lib/constants';
import { getCityBenchmark, CITY_BENCHMARKS } from '../lib/budgetBenchmarks';
import { BudgetChart, BudgetCategoryItem } from '../components/budget/BudgetChart';
import { RecommendedServices } from '../components/budget/RecommendedServices';
import { BudgetShareModal } from '../components/budget/BudgetShareModal';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { PersonalPageHeader } from '../components/layout/PersonalPageHeader';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calculator, IndianRupee, MapPin, Sparkles, Building2, Utensils, 
  BookOpen, Bike, Shirt, Sliders, Share2, ArrowRight, Lightbulb, 
  CheckCircle2, AlertCircle, ShoppingBag, ShieldCheck, Zap, 
  RotateCcw, Plus, Trash2, Edit3, Coins, HelpCircle
} from 'lucide-react';

interface CustomExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export default function BudgetCalculator() {
  const { userLocation } = useLocationContext();

  const [selectedCity, setSelectedCity] = useState<string>(userLocation?.city || 'Kota');
  const [mode, setMode] = useState<'manual' | 'custom' | 'autofit'>('manual');

  // Auto-fit target budget state
  const [targetBudget, setTargetBudget] = useState<number>(10000);

  // Guided choices state
  const [roomType, setRoomType] = useState<'singleAC' | 'singleNonAC' | 'doubleAC' | 'doubleNonAC' | 'tripleSharing'>('doubleNonAC');
  const [foodPlan, setFoodPlan] = useState<'fullMess3Meals' | 'twoMealsTiffin' | 'selfCooking' | 'budgetThali'>('fullMess3Meals');
  const [libraryShift, setLibraryShift] = useState<'twentyFourSevenAC' | 'twelveHourShift' | 'sixHourShift' | 'none'>('twelveHourShift');
  const [commuteMode, setCommuteMode] = useState<'walking' | 'bicycle' | 'autoRickshaw' | 'twoWheelerPetrol'>('walking');
  const [laundryMode, setLaundryMode] = useState<'selfWash' | 'maidOrHostelService' | 'commercialLaundry'>('maidOrHostelService');
  const [guidedMiscAmount, setGuidedMiscAmount] = useState<number>(750);

  // Manual Freeform Entry State
  const [manualRent, setManualRent] = useState<number>(5000);
  const [manualElectricity, setManualElectricity] = useState<number>(500);
  const [manualMess, setManualMess] = useState<number>(2800);
  const [manualLibrary, setManualLibrary] = useState<number>(800);
  const [manualCommute, setManualCommute] = useState<number>(400);
  const [manualLaundry, setManualLaundry] = useState<number>(400);
  const [manualCoaching, setManualCoaching] = useState<number>(0);
  const [manualPersonal, setManualPersonal] = useState<number>(600);

  // User-defined custom extra expenses
  const [customExpenses, setCustomExpenses] = useState<CustomExpenseItem[]>([
    { id: 'custom-1', name: 'Mobile & Wi-Fi Recharge', amount: 350 }
  ]);
  const [newCustomName, setNewCustomName] = useState<string>('');
  const [newCustomAmount, setNewCustomAmount] = useState<string>('');
  const [showAddCustomRow, setShowAddCustomRow] = useState<boolean>(false);

  // Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync city when user location resolves if not changed
  useEffect(() => {
    if (userLocation?.city && !selectedCity) {
      setSelectedCity(userLocation.city);
    }
  }, [userLocation?.city]);

  const benchmark = useMemo(() => {
    return getCityBenchmark(selectedCity);
  }, [selectedCity]);

  // When city changes, update manual defaults if user wants
  const prefillWithCityAverage = () => {
    setManualRent(benchmark.rentRanges.doubleNonAC);
    setManualElectricity(500);
    setManualMess(benchmark.messRanges.fullMess3Meals);
    setManualLibrary(benchmark.libraryRanges.twelveHourShift);
    setManualCommute(benchmark.commuteRanges.walking || 250);
    setManualLaundry(benchmark.laundryRanges.selfWash || 250);
    setManualCoaching(0);
    setManualPersonal(benchmark.miscAllowance);
  };

  const resetAllManual = () => {
    setManualRent(0);
    setManualElectricity(0);
    setManualMess(0);
    setManualLibrary(0);
    setManualCommute(0);
    setManualLaundry(0);
    setManualCoaching(0);
    setManualPersonal(0);
    setCustomExpenses([]);
  };

  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomName.trim()) return;
    const amt = parseFloat(newCustomAmount) || 0;
    const newItem: CustomExpenseItem = {
      id: `custom-${Date.now()}`,
      name: newCustomName.trim(),
      amount: amt
    };
    setCustomExpenses(prev => [...prev, newItem]);
    setNewCustomName('');
    setNewCustomAmount('');
    setShowAddCustomRow(false);
  };

  const handleDeleteCustomExpense = (id: string) => {
    setCustomExpenses(prev => prev.filter(item => item.id !== id));
  };

  const cityOptions = Object.entries(STATE_CITIES).flatMap(([state, cities]) => 
    cities.map(c => ({ value: c, label: c, group: state }))
  );

  // Quick preset cities for easy tabs
  const topHubs = ['Kota', 'Patna', 'New Delhi', 'Sikar', 'Lucknow', 'Prayagraj', 'Pune', 'Indore', 'Jaipur'];

  // Palette for custom colors
  const customColors = ['#06B6D4', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316', '#EAB308'];

  // Calculate numbers based on Mode
  const { rentAmount, messAmount, libAmount, commuteAmount, laundryAmount, totalCalculated, chartItems } = useMemo(() => {
    if (mode === 'manual') {
      const customSum = customExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const total = (Number(manualRent) || 0) +
                    (Number(manualElectricity) || 0) +
                    (Number(manualMess) || 0) +
                    (Number(manualLibrary) || 0) +
                    (Number(manualCommute) || 0) +
                    (Number(manualLaundry) || 0) +
                    (Number(manualCoaching) || 0) +
                    (Number(manualPersonal) || 0) +
                    customSum;

      const safeTotal = total > 0 ? total : 1;

      const items: BudgetCategoryItem[] = [
        {
          id: 'rent',
          name: 'Room / PG Rent',
          amount: Number(manualRent) || 0,
          color: '#00E5FF',
          percentage: Math.round(((Number(manualRent) || 0) / safeTotal) * 100)
        },
        {
          id: 'electricity',
          name: 'Electricity & AC Bill',
          amount: Number(manualElectricity) || 0,
          color: '#38BDF8',
          percentage: Math.round(((Number(manualElectricity) || 0) / safeTotal) * 100)
        },
        {
          id: 'mess',
          name: 'Mess & Food',
          amount: Number(manualMess) || 0,
          color: '#F59E0B',
          percentage: Math.round(((Number(manualMess) || 0) / safeTotal) * 100)
        },
        {
          id: 'library',
          name: 'Study Library',
          amount: Number(manualLibrary) || 0,
          color: '#A855F7',
          percentage: Math.round(((Number(manualLibrary) || 0) / safeTotal) * 100)
        },
        {
          id: 'commute',
          name: 'Commute & Travel',
          amount: Number(manualCommute) || 0,
          color: '#10B981',
          percentage: Math.round(((Number(manualCommute) || 0) / safeTotal) * 100)
        },
        {
          id: 'laundry',
          name: 'Laundry & Personal',
          amount: Number(manualLaundry) || 0,
          color: '#F43F5E',
          percentage: Math.round(((Number(manualLaundry) || 0) / safeTotal) * 100)
        }
      ];

      if (Number(manualCoaching) > 0) {
        items.push({
          id: 'coaching',
          name: 'Coaching / Books / Test Series',
          amount: Number(manualCoaching) || 0,
          color: '#818CF8',
          percentage: Math.round(((Number(manualCoaching) || 0) / safeTotal) * 100)
        });
      }

      if (Number(manualPersonal) > 0) {
        items.push({
          id: 'personal',
          name: 'Snacks & Pocket Money',
          amount: Number(manualPersonal) || 0,
          color: '#FB923C',
          percentage: Math.round(((Number(manualPersonal) || 0) / safeTotal) * 100)
        });
      }

      customExpenses.forEach((c, idx) => {
        if (Number(c.amount) > 0) {
          items.push({
            id: c.id,
            name: c.name,
            amount: Number(c.amount) || 0,
            color: customColors[idx % customColors.length] || '#00E5FF',
            percentage: Math.round(((Number(c.amount) || 0) / safeTotal) * 100)
          });
        }
      });

      return {
        rentAmount: (Number(manualRent) || 0) + (Number(manualElectricity) || 0),
        messAmount: Number(manualMess) || 0,
        libAmount: Number(manualLibrary) || 0,
        commuteAmount: Number(manualCommute) || 0,
        laundryAmount: (Number(manualLaundry) || 0) + (Number(manualPersonal) || 0) + customSum,
        totalCalculated: total,
        chartItems: items
      };
    } else if (mode === 'autofit') {
      const baseRent = targetBudget * 0.48;
      const baseMess = targetBudget * 0.28;
      const baseLib = targetBudget * 0.08;
      const baseCommute = targetBudget * 0.05;
      const baseMisc = targetBudget * 0.11;

      const r = Math.round(baseRent);
      const m = Math.round(baseMess);
      const l = Math.round(baseLib);
      const c = Math.round(baseCommute);
      const lnd = Math.round(baseMisc);

      const items: BudgetCategoryItem[] = [
        { id: 'rent', name: 'Room / PG Rent', amount: r, color: '#00E5FF', percentage: Math.round((r / targetBudget) * 100) },
        { id: 'mess', name: 'Mess & Food', amount: m, color: '#F59E0B', percentage: Math.round((m / targetBudget) * 100) },
        { id: 'library', name: 'Study Library', amount: l, color: '#A855F7', percentage: Math.round((l / targetBudget) * 100) },
        { id: 'commute', name: 'Commute & Travel', amount: c, color: '#10B981', percentage: Math.round((c / targetBudget) * 100) },
        { id: 'misc', name: 'Laundry & Misc', amount: lnd, color: '#F43F5E', percentage: Math.round((lnd / targetBudget) * 100) }
      ];

      return {
        rentAmount: r,
        messAmount: m,
        libAmount: l,
        commuteAmount: c,
        laundryAmount: lnd,
        totalCalculated: targetBudget,
        chartItems: items
      };
    } else {
      const r = benchmark.rentRanges[roomType];
      const m = benchmark.messRanges[foodPlan];
      const l = benchmark.libraryRanges[libraryShift];
      const c = benchmark.commuteRanges[commuteMode];
      const lnd = benchmark.laundryRanges[laundryMode];
      const total = r + m + l + c + lnd + guidedMiscAmount;

      const items: BudgetCategoryItem[] = [
        { id: 'rent', name: 'Room / PG Rent', amount: r, color: '#00E5FF', percentage: Math.round((r / total) * 100) },
        { id: 'mess', name: 'Mess & Food', amount: m, color: '#F59E0B', percentage: Math.round((m / total) * 100) },
        { id: 'library', name: 'Study Library', amount: l, color: '#A855F7', percentage: Math.round((l / total) * 100) },
        { id: 'commute', name: 'Commute & Travel', amount: c, color: '#10B981', percentage: Math.round((c / total) * 100) },
        { id: 'misc', name: 'Laundry & Misc', amount: lnd + guidedMiscAmount, color: '#F43F5E', percentage: Math.round(((lnd + guidedMiscAmount) / total) * 100) }
      ];

      return {
        rentAmount: r,
        messAmount: m,
        libAmount: l,
        commuteAmount: c,
        laundryAmount: lnd + guidedMiscAmount,
        totalCalculated: total,
        chartItems: items
      };
    }
  }, [
    mode, targetBudget, benchmark, roomType, foodPlan, libraryShift, commuteMode, laundryMode, guidedMiscAmount,
    manualRent, manualElectricity, manualMess, manualLibrary, manualCommute, manualLaundry, manualCoaching, manualPersonal, customExpenses
  ]);

  // Feasibility tier indicator
  const feasibility = useMemo(() => {
    if (totalCalculated < 6500) {
      return {
        title: 'Tight / Ultra-Budget',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        desc: 'Great for high savings! Best suited with shared double/triple rooms and walking commute.'
      };
    } else if (totalCalculated <= 12000) {
      return {
        title: 'Balanced & Optimal (Recommended)',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        desc: 'Most popular student bracket in Kota & Patna. Covers comfortable double/single room, healthy 3 meals, and AC library.'
      };
    } else if (totalCalculated <= 18000) {
      return {
        title: 'Comfortable Living',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        desc: 'Includes single room with AC, premium mess subscription, and 24/7 library reservation.'
      };
    } else {
      return {
        title: 'Premium Comfort',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        desc: 'Luxury student studio / single AC PG with commercial laundry and personal transport.'
      };
    }
  }, [totalCalculated]);

  const readableRoomType = mode === 'manual' 
    ? `Custom Rent ₹${manualRent}` 
    : {
        singleAC: 'Single AC Room',
        singleNonAC: 'Single Non-AC Room',
        doubleAC: 'Double Sharing AC',
        doubleNonAC: 'Double Sharing Non-AC',
        tripleSharing: 'Triple Sharing Room'
      }[roomType];

  const readableFoodPlan = mode === 'manual'
    ? `Custom Food ₹${manualMess}`
    : {
        fullMess3Meals: '3 Meals Full Mess',
        twoMealsTiffin: '2 Meals Tiffin',
        selfCooking: 'Self Cooking',
        budgetThali: 'Basic Thali'
      }[foodPlan];

  const readableLibShift = mode === 'manual'
    ? `Custom Library ₹${manualLibrary}`
    : {
        twentyFourSevenAC: '24/7 AC Seat',
        twelveHourShift: '12-Hour Shift',
        sixHourShift: '6-Hour Shift',
        none: 'Hostel Study'
      }[libraryShift];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-20 md:mb-0"
    >
      <PersonalPageHeader
        title="Student Living Budget"
        subtitle="Estimate & plan monthly PG rent, mess food, library seat and living costs"
        badge="Budget Tool"
        badgeColor="bg-cyan-400/10 text-cyan-300 border-cyan-400/30"
        icon={Calculator}
        iconColor="text-[#00E5FF]"
        exitUrl="/profile"
        backLabel="Profile"
      />

      {/* Top Banner Card */}
      <LiquidGlassCard className="p-4 sm:p-8 md:p-10 mb-8 overflow-visible" glowColor="rgba(0, 229, 255, 0.25)">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 backdrop-blur-md text-[11px] font-semibold text-cyan-300 tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Calculator className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
              <span>Student Budget Estimator • मासिक खर्च कैलकुलेटर</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-indigo-300">Monthly Expenses</span>
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Type your own exact amounts manually or use guided options for room, mess, library pass, electricity, and custom expenses across Kota, Patna, Delhi, and other study hubs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#00E5FF]" />
              <span>Share with Parents</span>
            </button>
          </div>
        </div>

        {/* City Selection Bar */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#00E5FF]" />
              <span>Select Your Target Student City / Hub:</span>
            </label>

            <div className="w-full sm:w-64">
              <SearchableSelect
                options={cityOptions}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Choose city..."
                className="w-full text-xs"
              />
            </div>
          </div>

          {/* Quick Hub Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {topHubs.map(hub => (
              <button
                key={hub}
                onClick={() => setSelectedCity(hub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCity.toLowerCase() === hub.toLowerCase()
                    ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 border border-white/10'
                }`}
              >
                {hub}
              </button>
            ))}
          </div>
        </div>
      </LiquidGlassCard>

      {/* Main Grid: Calculator Inputs & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* Left Column: Calculation Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-4 sm:p-8 rounded-3xl" intensity="medium">
            
            {/* Mobile live total bar visible on phones & tablets */}
            <div className="lg:hidden flex items-center justify-between p-3.5 rounded-2xl bg-cyan-500/10 border border-[#00E5FF]/30 mb-6 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Live Estimated Total</span>
                <span className="text-xl font-black text-white">₹{totalCalculated.toLocaleString('en-IN')}<span className="text-xs text-cyan-300 font-semibold">/month</span></span>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Share</span>
              </button>
            </div>

            {/* Mode Switcher: 3 Tabs */}
            <div className="flex items-center p-1.5 rounded-2xl bg-white/[0.05] border border-white/10 mb-6 gap-1">
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                  mode === 'manual'
                    ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 shrink-0" />
                <span>Manual</span>
                <span className="hidden sm:inline">Entry</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                  mode === 'custom'
                    ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                <span>Guided</span>
                <span className="hidden sm:inline">Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('autofit')}
                className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                  mode === 'autofit'
                    ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Auto-Fit</span>
              </button>
            </div>

            {/* MODE 1: MANUAL CUSTOM ENTRY */}
            {mode === 'manual' && (
              <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#00E5FF]" />
                      <span>Custom Expense Breakdown (अपना खर्च दर्ज करें)</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Type your exact monthly numbers. The chart updates instantly.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prefillWithCityAverage}
                      className="px-3 py-1.5 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 text-[#00E5FF] border border-cyan-400/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Prefill using typical city rates"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Prefill {selectedCity} Avg</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetAllManual}
                      className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-all cursor-pointer"
                      title="Reset all fields to 0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Input Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Room Rent */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-cyan-400/50 transition-all">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                        <span>Room / PG Rent (कमरा किराया)</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Monthly</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={manualRent === 0 ? '' : manualRent}
                        onChange={e => setManualRent(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  {/* Electricity & AC */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-cyan-400/50 transition-all">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Electricity & AC (बिजली बिल)</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Monthly</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={manualElectricity === 0 ? '' : manualElectricity}
                        onChange={e => setManualElectricity(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  {/* Mess & Food */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-amber-400/50 transition-all">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mess / Tiffin / Food (मेस व खाना)</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Monthly</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={manualMess === 0 ? '' : manualMess}
                        onChange={e => setManualMess(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Library & Study Room */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-purple-400/50 transition-all">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>Study Library (लाइब्रेरी पास)</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Monthly</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={manualLibrary === 0 ? '' : manualLibrary}
                        onChange={e => setManualLibrary(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {/* Commute & Auto */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-emerald-400/50 transition-all">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Bike className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Commute / Travel (आवागमन / ऑटो)</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Monthly</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={manualCommute === 0 ? '' : manualCommute}
                        onChange={e => setManualCommute(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Laundry & Care */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-rose-400/50 transition-all">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Shirt className="w-3.5 h-3.5 text-rose-400" />
                        <span>Laundry (धुलाई / इस्त्री)</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Monthly</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={manualLaundry === 0 ? '' : manualLaundry}
                        onChange={e => setManualLaundry(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  {/* Coaching / Test Series */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-indigo-400/50 transition-all">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Books / Test Series / EMI (किताबें)</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Optional</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={manualCoaching === 0 ? '' : manualCoaching}
                        onChange={e => setManualCoaching(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  {/* Personal Buffer & Snacks */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-amber-400/50 transition-all">
                    <label className="text-xs font-bold text-gray-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Snacks, Milk & Pocket Buffer</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">Monthly</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={manualPersonal === 0 ? '' : manualPersonal}
                        onChange={e => setManualPersonal(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-amber-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Expenses List */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Extra Custom Items ({customExpenses.length})
                    </span>
                    {!showAddCustomRow && (
                      <button
                        type="button"
                        onClick={() => setShowAddCustomRow(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold border border-[#00E5FF]/30 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Custom Expense</span>
                      </button>
                    )}
                  </div>

                  {/* Add Row Form */}
                  {showAddCustomRow && (
                    <form onSubmit={handleAddCustomExpense} className="p-3 rounded-2xl bg-cyan-400/[0.06] border border-cyan-400/30 mb-3 flex flex-col sm:flex-row gap-2.5 items-end">
                      <div className="flex-1 w-full">
                        <label className="text-[10px] uppercase font-bold text-cyan-300 block mb-1">
                          Item Name (e.g. Gym, Milk & Fruits, Medicine)
                        </label>
                        <input
                          type="text"
                          value={newCustomName}
                          onChange={e => setNewCustomName(e.target.value)}
                          placeholder="e.g. Gym Membership"
                          required
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                      <div className="w-full sm:w-36">
                        <label className="text-[10px] uppercase font-bold text-cyan-300 block mb-1">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={newCustomAmount}
                          onChange={e => setNewCustomAmount(e.target.value)}
                          placeholder="₹ Amount"
                          min="0"
                          required
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-bold focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-all cursor-pointer shadow-sm"
                        >
                          Add Item
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddCustomRow(false)}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.08] text-gray-300 text-xs hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of custom items */}
                  {customExpenses.length > 0 && (
                    <div className="space-y-2">
                      {customExpenses.map((c, idx) => (
                        <div key={c.id} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: customColors[idx % customColors.length] }}
                            />
                            <span className="text-xs font-bold text-white truncate">{c.name}</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-black text-cyan-300">
                              ₹{c.amount.toLocaleString('en-IN')}/mo
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomExpense(c.id)}
                              className="p-1 rounded-lg text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete custom item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODE 2: GUIDED PRESET OPTIONS */}
            {mode === 'custom' && (
              <div className="space-y-6">
                {/* 1. Room Type */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#00E5FF]" />
                      <span>1. Accommodation & Room Type</span>
                    </label>
                    <span className="text-xs font-black text-[#00E5FF]">
                      ₹{benchmark.rentRanges[roomType].toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { key: 'doubleNonAC', label: 'Double Non-AC', tag: 'Most Popular' },
                      { key: 'doubleAC', label: 'Double AC', tag: 'Comfort' },
                      { key: 'singleNonAC', label: 'Single Non-AC', tag: 'Quiet Study' },
                      { key: 'singleAC', label: 'Single AC', tag: 'Private' },
                      { key: 'tripleSharing', label: 'Triple / Dorm', tag: 'Economy' },
                    ].map(r => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setRoomType(r.key as any)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative ${
                          roomType === r.key
                            ? 'bg-cyan-500/15 border-[#00E5FF] text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                            : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="block text-xs font-bold">{r.label}</span>
                        <span className="block text-[11px] text-gray-400 mt-0.5">
                          ₹{benchmark.rentRanges[r.key as keyof typeof benchmark.rentRanges].toLocaleString('en-IN')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Food & Mess Plan */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-amber-400" />
                      <span>2. Mess & Daily Meals</span>
                    </label>
                    <span className="text-xs font-black text-amber-400">
                      ₹{benchmark.messRanges[foodPlan].toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'fullMess3Meals', label: 'Full Mess (3 Meals + Special)' },
                      { key: 'twoMealsTiffin', label: '2 Meals Tiffin (Lunch + Dinner)' },
                      { key: 'budgetThali', label: 'Basic Student Thali' },
                      { key: 'selfCooking', label: 'Self Cooking / Maid Cook' },
                    ].map(m => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setFoodPlan(m.key as any)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          foodPlan === m.key
                            ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                            : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="block text-xs font-bold">{m.label}</span>
                        <span className="block text-[11px] text-gray-400 mt-0.5">
                          ₹{benchmark.messRanges[m.key as keyof typeof benchmark.messRanges].toLocaleString('en-IN')}/mo
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Study Library */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>3. Self-Study Library Pass</span>
                    </label>
                    <span className="text-xs font-black text-purple-400">
                      ₹{benchmark.libraryRanges[libraryShift].toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'twentyFourSevenAC', label: '24/7 Dedicated AC' },
                      { key: 'twelveHourShift', label: '12-Hour Shift' },
                      { key: 'sixHourShift', label: '6-Hour Shift' },
                      { key: 'none', label: 'Study in Room (₹0)' },
                    ].map(l => (
                      <button
                        key={l.key}
                        type="button"
                        onClick={() => setLibraryShift(l.key as any)}
                        className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          libraryShift === l.key
                            ? 'bg-purple-500/15 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                            : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{l.label}</span>
                        <span className="block text-[11px] text-gray-400 mt-1">
                          ₹{benchmark.libraryRanges[l.key as keyof typeof benchmark.libraryRanges].toLocaleString('en-IN')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Commute & Transport */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                      <Bike className="w-4 h-4 text-emerald-400" />
                      <span>4. Daily Commute to Coaching</span>
                    </label>
                    <span className="text-xs font-black text-emerald-400">
                      ₹{benchmark.commuteRanges[commuteMode].toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'walking', label: 'Walking (< 500m)' },
                      { key: 'bicycle', label: 'Bicycle (Free)' },
                      { key: 'autoRickshaw', label: 'E-Rickshaw / Auto' },
                      { key: 'twoWheelerPetrol', label: 'Scooty / Bike' },
                    ].map(c => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setCommuteMode(c.key as any)}
                        className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          commuteMode === c.key
                            ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{c.label}</span>
                        <span className="block text-[11px] text-gray-400 mt-1">
                          ₹{benchmark.commuteRanges[c.key as keyof typeof benchmark.commuteRanges].toLocaleString('en-IN')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Laundry & Extras */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5 mb-2">
                      <Shirt className="w-4 h-4 text-rose-400" />
                      <span>5. Laundry Plan</span>
                    </label>
                    <select
                      value={laundryMode}
                      onChange={e => setLaundryMode(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs cursor-pointer focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="selfWash">Self Wash in Hostel (₹{benchmark.laundryRanges.selfWash})</option>
                      <option value="maidOrHostelService">Hostel Laundry / Maid (₹{benchmark.laundryRanges.maidOrHostelService})</option>
                      <option value="commercialLaundry">Dry Cleaner & Press (₹{benchmark.laundryRanges.commercialLaundry})</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                        Stationery & Pocket Buffer
                      </label>
                      <span className="text-xs font-bold text-white">
                        ₹{guidedMiscAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="3000"
                      step="100"
                      value={guidedMiscAmount}
                      onChange={e => setGuidedMiscAmount(Number(e.target.value))}
                      className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-[#00E5FF] mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODE 3: AUTO-FIT TARGET BUDGET */}
            {mode === 'autofit' && (
              <div className="space-y-6 py-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-gray-200">
                      What is your Target Monthly Budget?
                    </label>
                    <span className="text-2xl font-black text-[#00E5FF]">
                      ₹{targetBudget.toLocaleString('en-IN')}/mo
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5000"
                    max="25000"
                    step="500"
                    value={targetBudget}
                    onChange={e => setTargetBudget(Number(e.target.value))}
                    className="w-full h-2.5 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>₹5,000 (Budget)</span>
                    <span>₹12,000 (Average)</span>
                    <span>₹25,000+ (Luxury)</span>
                  </div>
                </div>

                {/* Quick Budget Chips */}
                <div>
                  <span className="text-xs text-gray-400 block mb-2 font-medium">
                    Quick Preset Budgets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[7000, 9000, 11000, 14000, 18000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTargetBudget(amt)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          targetBudget === amt
                            ? 'bg-cyan-500/20 text-[#00E5FF] border border-[#00E5FF]/40'
                            : 'bg-white/[0.04] text-gray-300 border border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}/mo
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-400/[0.06] border border-cyan-400/20 text-xs text-cyan-200 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span>
                    In <strong>{selectedCity}</strong>, an average student spends about <strong>₹{benchmark.avgTotalMonthly.toLocaleString('en-IN')}/month</strong>. We've optimized room, mess, and study space allocations to ensure you don't overspend.
                  </span>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Visual Analytics & City Intelligence (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Donut & Total Overview */}
          <GlassCard className="p-6 sm:p-8 rounded-3xl relative overflow-hidden" intensity="high">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Monthly Breakdown
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${feasibility.badgeColor}`}>
                {feasibility.title}
              </span>
            </div>

            {/* SVG Donut Chart */}
            <BudgetChart
              items={chartItems}
              total={totalCalculated}
              targetBudget={mode === 'autofit' ? targetBudget : undefined}
              cityName={selectedCity}
            />

            {/* Feasibility Description */}
            <p className="text-xs text-gray-300 mt-2 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              💡 {feasibility.desc}
            </p>

            {/* Comparison with Average */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-gray-400">City Average ({selectedCity}):</span>
              <div className="text-right">
                <span className="font-bold text-white">₹{benchmark.avgTotalMonthly.toLocaleString('en-IN')}</span>
                <span className="block text-[10px] text-gray-400">
                  {totalCalculated < benchmark.avgTotalMonthly ? (
                    <strong className="text-emerald-400">
                      ₹{(benchmark.avgTotalMonthly - totalCalculated).toLocaleString('en-IN')} less than average
                    </strong>
                  ) : (
                    <strong className="text-amber-400">
                      ₹{(totalCalculated - benchmark.avgTotalMonthly).toLocaleString('en-IN')} more than average
                    </strong>
                  )}
                </span>
              </div>
            </div>

            {/* Direct CTA to search */}
            <div className="mt-5">
              <Link to={`/search?city=${encodeURIComponent(selectedCity)}`}>
                <LiquidButton
                  variant="primary"
                  className="w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                >
                  <span>Find PGs & Mess under ₹{totalCalculated.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </LiquidButton>
              </Link>
            </div>
          </GlassCard>

          {/* City Intelligence & Money-Saving Tips */}
          <GlassCard className="p-6 rounded-3xl" intensity="low">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Money-Saving Hacks in {selectedCity}
              </h3>
            </div>

            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              {benchmark.description}
            </p>

            <ul className="space-y-2.5 text-xs text-gray-300">
              {benchmark.savingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>

            {/* Marketplace cross-sell banner */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs text-gray-300">Save ₹5,000+ on books & coolers:</span>
              </div>
              <Link
                to="/marketplace"
                className="text-xs font-bold text-[#00E5FF] hover:underline"
              >
                Browse Marketplace →
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recommended Live Package Section */}
      <section className="mb-12">
        <RecommendedServices
          city={selectedCity}
          rentBudget={rentAmount}
          messBudget={messAmount}
          libraryBudget={libAmount}
        />
      </section>

      {/* Share Modal */}
      <BudgetShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        city={selectedCity}
        totalMonthly={totalCalculated}
        targetBudget={mode === 'autofit' ? targetBudget : undefined}
        items={chartItems}
        roomType={readableRoomType}
        foodPlan={readableFoodPlan}
        libraryShift={readableLibShift}
      />
    </motion.div>
  );
}
