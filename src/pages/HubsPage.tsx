import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, Building2, Search, ArrowRight, Sparkles, 
  BedDouble, Calculator, ShieldCheck, Star, Users, Utensils, BookOpen, Compass
} from 'lucide-react';
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard';
import { GlassCard } from '../components/ui/GlassCard';
import { PersonalPageHeader } from '../components/layout/PersonalPageHeader';
import { SEOHead } from '../components/common/SEOHead';
import { useLocationContext } from '../contexts/LocationContext';

interface HubDetail {
  id: string;
  name: string;
  state: string;
  tagline: string;
  avgRent: string;
  keyInstitutes: string[];
  topClusters: string[];
  popularFor: string;
  image: string;
}

const HUBS_DATA: HubDetail[] = [
  {
    id: 'kota',
    name: 'Kota',
    state: 'Rajasthan',
    tagline: 'India’s Capital for IIT-JEE & NEET-UG',
    avgRent: '₹5,500 – ₹12,000/mo',
    keyInstitutes: ['Allen Career Institute', 'Resonance', 'Motion Education', 'Reliable', 'Unacademy'],
    topClusters: ['Landmark City (Kunhari)', 'Talwandi', 'Vigyan Nagar', 'Mahaveer Nagar', 'Coral Park'],
    popularFor: 'NEET & JEE Coaching Clusters with 24/7 Library Network',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    tagline: 'Premier Bihar Education & Competitive Exam Hub',
    avgRent: '₹4,000 – ₹9,000/mo',
    keyInstitutes: ['Khan Global Studies', 'Goal Institute', 'Mentors Eduserv', 'Rahmani30'],
    topClusters: ['Boring Road', 'Kankarbagh', 'Bazar Samiti', 'Musallahpur Hat', 'Ashok Rajpath'],
    popularFor: 'BPSC, SSC, Railway, NEET & JEE Aspirants',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    state: 'Delhi NCR',
    tagline: 'UPSC Civil Services & University Hub',
    avgRent: '₹8,000 – ₹18,000/mo',
    keyInstitutes: ['Vajiram & Ravi', 'Vision IAS', 'Drishti IAS', 'Next IAS', 'Delhi University'],
    topClusters: ['Mukherjee Nagar', 'Old Rajinder Nagar (ORN)', 'Karol Bagh', 'North Campus', 'Laxmi Nagar'],
    popularFor: 'UPSC, Judiciary, CUET & Post-Graduate Studies',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sikar',
    name: 'Sikar',
    state: 'Rajasthan',
    tagline: 'Shekhawati Rising Medical & Engineering Hub',
    avgRent: '₹4,500 – ₹9,500/mo',
    keyInstitutes: ['PCP Sikar', 'Matrix Academy', 'Gurukripa (GCI)', 'Allen Sikar', 'CLC Sikar'],
    topClusters: ['Piprali Road', 'Nawalgarh Road', 'Silver Jubilee Road', 'Fatehpur Road'],
    popularFor: 'NEET-UG, JEE Main & NDA Defence Coaching',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    tagline: 'Oxford of the East & Engineering Academy Hub',
    avgRent: '₹6,500 – ₹14,000/mo',
    keyInstitutes: ['COEP', 'MIT World Peace', 'Symbiosis', 'Fergusson', 'PICT Pune'],
    topClusters: ['Kothrud', 'Viman Nagar', 'Hinjawadi', 'FC Road', 'Karve Nagar'],
    popularFor: 'Engineering, Design, MBA & MPSC Civil Prep',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    tagline: 'Central UP Competitive & Medical Hub',
    avgRent: '₹4,500 – ₹10,000/mo',
    keyInstitutes: ['Gravity Classes', 'Aakash Lucknow', 'Dhyeya IAS', 'Allen Hazratganj'],
    topClusters: ['Hazratganj', 'Aliganj', 'Indira Nagar', 'Gomti Nagar', 'Mahanagar'],
    popularFor: 'UPPSC, NEET, JEE & Banking Exams',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    tagline: 'MP Education & Cleanest Student City',
    avgRent: '₹5,000 – ₹11,000/mo',
    keyInstitutes: ['Kautilya Academy', 'Allen Indore', 'Aakash', 'Sharma Academy'],
    topClusters: ['Bhawarkua', 'Geeta Bhawan', 'Vijay Nagar', 'Old Palasia'],
    popularFor: 'MPPSC, CAT, NEET & JEE Preparation',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    state: 'Uttar Pradesh',
    tagline: 'Historic Civil Services & University Hub',
    avgRent: '₹3,500 – ₹7,500/mo',
    keyInstitutes: ['Dhyeya IAS', 'Samarpan Academy', 'Civil India', 'Allahabad University'],
    topClusters: ['Katra', 'Civil Lines', 'Salori', 'Allahpur', 'Govindpur'],
    popularFor: 'UPPSC, Judiciary, SSC & Railway Aspirants',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HubsPage() {
  const [search, setSearch] = useState('');
  const { setManualLocation } = useLocationContext();
  const navigate = useNavigate();

  const filteredHubs = HUBS_DATA.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.state.toLowerCase().includes(search.toLowerCase()) ||
    h.topClusters.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
    h.popularFor.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectHub = (hub: HubDetail) => {
    setManualLocation(hub.name, hub.state);
    navigate(`/search`, { state: { city: hub.name } });
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white">
      <SEOHead />
      <PersonalPageHeader
        title="All Students HUB"
        subtitle="Explore top coaching clusters, rent benchmarks & verified hostels across India"
        badge="City Directory"
        badgeColor="bg-cyan-400/10 text-cyan-300 border-cyan-400/30"
        icon={MapPin}
        iconColor="text-[#00E5FF]"
        exitUrl="/"
        backLabel="Home"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 mb-20 md:mb-12">
        
        {/* Top Search & Filter Bar */}
        <LiquidGlassCard className="p-6 sm:p-8" glowColor="rgba(0, 229, 255, 0.25)">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[11px] font-bold text-cyan-300 tracking-wider uppercase mb-2">
                <Compass className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                <span>Premier Coaching Hubs of India</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-indigo-300">Study City</span>
              </h1>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by city, locality, or exam..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors text-sm"
              />
            </div>
          </div>
        </LiquidGlassCard>

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHubs.map((hub) => (
            <GlassCard
              key={hub.id}
              className="overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
              intensity="low"
            >
              <div>
                {/* Hub Thumbnail Header */}
                <div className="h-44 relative overflow-hidden bg-slate-800">
                  <img
                    src={hub.image}
                    alt={hub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/40 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
                    {hub.name}, {hub.state}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-black text-white">{hub.name}</h3>
                    <p className="text-xs text-gray-300 line-clamp-1">{hub.tagline}</p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Avg Student Rent
                    </span>
                    <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block">
                      {hub.avgRent}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Key Student Localities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hub.topClusters.slice(0, 3).map((c, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-gray-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Aspirant Focus
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">{hub.popularFor}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectHub(hub)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00E5FF]/20 to-[#8A2BE2]/20 hover:from-[#00E5FF]/30 hover:to-[#8A2BE2]/30 border border-[#00E5FF]/40 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>View Hostels</span>
                </button>

                <Link
                  to={`/budget?city=${encodeURIComponent(hub.name)}`}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-gray-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <Calculator className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Cost Calc</span>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
}
