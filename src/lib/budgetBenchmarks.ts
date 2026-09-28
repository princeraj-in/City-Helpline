export interface CityBudgetBenchmark {
  city: string;
  state: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  avgTotalMonthly: number;
  rentRanges: {
    singleAC: number;
    singleNonAC: number;
    doubleAC: number;
    doubleNonAC: number;
    tripleSharing: number;
  };
  messRanges: {
    fullMess3Meals: number;
    twoMealsTiffin: number;
    selfCooking: number;
    budgetThali: number;
  };
  libraryRanges: {
    twentyFourSevenAC: number;
    twelveHourShift: number;
    sixHourShift: number;
    none: number;
  };
  commuteRanges: {
    walking: number;
    bicycle: number;
    autoRickshaw: number;
    twoWheelerPetrol: number;
  };
  laundryRanges: {
    selfWash: number;
    maidOrHostelService: number;
    commercialLaundry: number;
  };
  miscAllowance: number;
  description: string;
  savingTips: string[];
}

export const CITY_BENCHMARKS: Record<string, CityBudgetBenchmark> = {
  'Kota': {
    city: 'Kota',
    state: 'Rajasthan',
    tier: 'tier2',
    avgTotalMonthly: 11500,
    rentRanges: {
      singleAC: 9500,
      singleNonAC: 6500,
      doubleAC: 6000,
      doubleNonAC: 4200,
      tripleSharing: 3200
    },
    messRanges: {
      fullMess3Meals: 3400,
      twoMealsTiffin: 2800,
      selfCooking: 2200,
      budgetThali: 2400
    },
    libraryRanges: {
      twentyFourSevenAC: 1100,
      twelveHourShift: 800,
      sixHourShift: 500,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 150,
      autoRickshaw: 800,
      twoWheelerPetrol: 1500
    },
    laundryRanges: {
      selfWash: 150,
      maidOrHostelService: 500,
      commercialLaundry: 900
    },
    miscAllowance: 800,
    description: 'Premier coaching capital (Allen, PW, Motion). Landmark City, Talwandi, Rajiv Gandhi Nagar, and Coral Park are the major student clusters.',
    savingTips: [
      'Take a room in Talwandi or Vigyan Nagar rather than Landmark City to save ₹2,000/mo.',
      'Opt for double-sharing rooms to reduce electricity and AC power bills by 50%.',
      'Buy second-hand cycle on Studolink Marketplace instead of taking auto daily.'
    ]
  },
  'Patna': {
    city: 'Patna',
    state: 'Bihar',
    tier: 'tier2',
    avgTotalMonthly: 8500,
    rentRanges: {
      singleAC: 6500,
      singleNonAC: 4500,
      doubleAC: 4200,
      doubleNonAC: 3000,
      tripleSharing: 2200
    },
    messRanges: {
      fullMess3Meals: 3000,
      twoMealsTiffin: 2400,
      selfCooking: 1800,
      budgetThali: 2000
    },
    libraryRanges: {
      twentyFourSevenAC: 800,
      twelveHourShift: 600,
      sixHourShift: 400,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 100,
      autoRickshaw: 600,
      twoWheelerPetrol: 1200
    },
    laundryRanges: {
      selfWash: 100,
      maidOrHostelService: 400,
      commercialLaundry: 700
    },
    miscAllowance: 600,
    description: 'Hub for NEET, JEE & Government competitive exams (BPSC, SSC, Railway). Hotspots: Boring Road, Kankarbagh, Bazar Samiti, Musallahpur Hat.',
    savingTips: [
      'Bazar Samiti & Musallahpur have rooms starting as low as ₹2,500/month.',
      'Monthly mess packages in Boring Canal Rd provide substantial savings compared to daily dhabas.',
      'Self-study libraries offer group discount passes for 3+ months subscription.'
    ]
  },
  'New Delhi': {
    city: 'New Delhi',
    state: 'Delhi',
    tier: 'tier1',
    avgTotalMonthly: 15500,
    rentRanges: {
      singleAC: 13000,
      singleNonAC: 9000,
      doubleAC: 8500,
      doubleNonAC: 6000,
      tripleSharing: 4500
    },
    messRanges: {
      fullMess3Meals: 4200,
      twoMealsTiffin: 3400,
      selfCooking: 2800,
      budgetThali: 3000
    },
    libraryRanges: {
      twentyFourSevenAC: 1600,
      twelveHourShift: 1100,
      sixHourShift: 700,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 150,
      autoRickshaw: 1200,
      twoWheelerPetrol: 2000
    },
    laundryRanges: {
      selfWash: 200,
      maidOrHostelService: 700,
      commercialLaundry: 1200
    },
    miscAllowance: 1200,
    description: 'National hub for UPSC, IIT-JEE & GATE. Famous areas: Mukherjee Nagar, Old Rajinder Nagar, Jia Sarai, Kalu Sarai, and Laxmi Nagar.',
    savingTips: [
      'Look for PG in Nehru Vihar or Gandhi Vihar instead of Mukherjee Nagar main road to save up to 30%.',
      'Use the Delhi Metro Student pass or travel by walking in Mukherjee Nagar study hub.',
      'Split grocery & cook costs in a 2BHK flat with 3-4 batchmates.'
    ]
  },
  'Sikar': {
    city: 'Sikar',
    state: 'Rajasthan',
    tier: 'tier3',
    avgTotalMonthly: 8900,
    rentRanges: {
      singleAC: 7000,
      singleNonAC: 4800,
      doubleAC: 4500,
      doubleNonAC: 3200,
      tripleSharing: 2400
    },
    messRanges: {
      fullMess3Meals: 3000,
      twoMealsTiffin: 2500,
      selfCooking: 1900,
      budgetThali: 2200
    },
    libraryRanges: {
      twentyFourSevenAC: 850,
      twelveHourShift: 650,
      sixHourShift: 400,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 100,
      autoRickshaw: 500,
      twoWheelerPetrol: 1100
    },
    laundryRanges: {
      selfWash: 100,
      maidOrHostelService: 450,
      commercialLaundry: 700
    },
    miscAllowance: 600,
    description: 'Rapidly expanding education hub (PCP, Matrix, Gurukripa). Piprali Road and Nawalgarh Road are the focal centers.',
    savingTips: [
      'Piprali Road hostels often bundle mess and laundry into room rent for big combined discounts.',
      'Bicycle is the best mode of transport here since institutes and PGs are closely clustered.'
    ]
  },
  'Lucknow': {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    tier: 'tier2',
    avgTotalMonthly: 9600,
    rentRanges: {
      singleAC: 7500,
      singleNonAC: 5000,
      doubleAC: 4800,
      doubleNonAC: 3500,
      tripleSharing: 2500
    },
    messRanges: {
      fullMess3Meals: 3200,
      twoMealsTiffin: 2600,
      selfCooking: 2000,
      budgetThali: 2300
    },
    libraryRanges: {
      twentyFourSevenAC: 900,
      twelveHourShift: 650,
      sixHourShift: 450,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 100,
      autoRickshaw: 700,
      twoWheelerPetrol: 1400
    },
    laundryRanges: {
      selfWash: 150,
      maidOrHostelService: 450,
      commercialLaundry: 800
    },
    miscAllowance: 700,
    description: 'Prominent educational and administrative hub. Key clusters: Aliganj, Kapoorthala, Hazratganj, and Indira Nagar.',
    savingTips: [
      'Aliganj and Kapoorthala have multiple budget tiffin vendors competing with quality trial meals.',
      'Metro connectivity connects Munshipulia to Charbagh economically.'
    ]
  },
  'Prayagraj': {
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    tier: 'tier2',
    avgTotalMonthly: 8200,
    rentRanges: {
      singleAC: 6000,
      singleNonAC: 4000,
      doubleAC: 3800,
      doubleNonAC: 2800,
      tripleSharing: 2000
    },
    messRanges: {
      fullMess3Meals: 2800,
      twoMealsTiffin: 2300,
      selfCooking: 1700,
      budgetThali: 2000
    },
    libraryRanges: {
      twentyFourSevenAC: 750,
      twelveHourShift: 550,
      sixHourShift: 350,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 100,
      autoRickshaw: 500,
      twoWheelerPetrol: 1100
    },
    laundryRanges: {
      selfWash: 100,
      maidOrHostelService: 400,
      commercialLaundry: 650
    },
    miscAllowance: 600,
    description: 'Renowned capital of UP civil services and judiciary prep. Areas: Katra, Civil Lines, Colonelganj, and Allahpur.',
    savingTips: [
      'Katra and Allahpur offer some of India’s most budget-friendly student lodges and libraries.',
      'Self-cooking is extremely popular among civil service aspirants and reduces meal costs to under ₹1,800/mo.'
    ]
  },
  'Pune': {
    city: 'Pune',
    state: 'Maharashtra',
    tier: 'tier1',
    avgTotalMonthly: 14000,
    rentRanges: {
      singleAC: 11500,
      singleNonAC: 8500,
      doubleAC: 7500,
      doubleNonAC: 5500,
      tripleSharing: 3800
    },
    messRanges: {
      fullMess3Meals: 3800,
      twoMealsTiffin: 3000,
      selfCooking: 2400,
      budgetThali: 2700
    },
    libraryRanges: {
      twentyFourSevenAC: 1200,
      twelveHourShift: 900,
      sixHourShift: 600,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 150,
      autoRickshaw: 1000,
      twoWheelerPetrol: 1800
    },
    laundryRanges: {
      selfWash: 200,
      maidOrHostelService: 600,
      commercialLaundry: 1000
    },
    miscAllowance: 1000,
    description: 'Oxford of the East. Notable student zones: FC Road, Kothrud, Viman Nagar, Hinjewadi, and Shivajinagar.',
    savingTips: [
      'Mess culture in Sadashiv Peth / Kothrud offers unlimited Maharashtrian & North Indian thali at student rates.',
      'Sharing a 2BHK flat in Kothrud with 4 people drastically cuts individual expenses.'
    ]
  },
  'Jaipur': {
    city: 'Jaipur',
    state: 'Rajasthan',
    tier: 'tier2',
    avgTotalMonthly: 10500,
    rentRanges: {
      singleAC: 8500,
      singleNonAC: 5800,
      doubleAC: 5400,
      doubleNonAC: 3800,
      tripleSharing: 2800
    },
    messRanges: {
      fullMess3Meals: 3300,
      twoMealsTiffin: 2700,
      selfCooking: 2100,
      budgetThali: 2400
    },
    libraryRanges: {
      twentyFourSevenAC: 950,
      twelveHourShift: 700,
      sixHourShift: 450,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 100,
      autoRickshaw: 800,
      twoWheelerPetrol: 1500
    },
    laundryRanges: {
      selfWash: 150,
      maidOrHostelService: 500,
      commercialLaundry: 850
    },
    miscAllowance: 800,
    description: 'Hub for engineering, medical & RAS aspirants. Key areas: Gopalpura Bypass, Tonk Phatak, Malviya Nagar, and Pratap Nagar.',
    savingTips: [
      'Gopalpura Bypass has India’s highest density of libraries offering competitive monthly pass discounts.',
      'Tonk Phatak area has great affordable tiffin services with doorstep delivery.'
    ]
  },
  'Indore': {
    city: 'Indore',
    state: 'Madhya Pradesh',
    tier: 'tier2',
    avgTotalMonthly: 9800,
    rentRanges: {
      singleAC: 7800,
      singleNonAC: 5200,
      doubleAC: 5000,
      doubleNonAC: 3600,
      tripleSharing: 2600
    },
    messRanges: {
      fullMess3Meals: 3200,
      twoMealsTiffin: 2600,
      selfCooking: 2000,
      budgetThali: 2300
    },
    libraryRanges: {
      twentyFourSevenAC: 900,
      twelveHourShift: 650,
      sixHourShift: 450,
      none: 0
    },
    commuteRanges: {
      walking: 0,
      bicycle: 100,
      autoRickshaw: 700,
      twoWheelerPetrol: 1400
    },
    laundryRanges: {
      selfWash: 150,
      maidOrHostelService: 450,
      commercialLaundry: 800
    },
    miscAllowance: 700,
    description: 'Cleanest city of India and MP’s premier student hub (MPPSC, IIT, IIM). Areas: Bhawarkua, Geeta Bhawan, Vijay Nagar.',
    savingTips: [
      'Bhawarkua square is the ultimate student hub where everything from tea to libraries is tailored for student budgets.',
      'iBus (BRTS) corridor offers high speed air-conditioned travel across Indore at just ₹10–₹20.'
    ]
  }
};

export const DEFAULT_BENCHMARK: CityBudgetBenchmark = {
  city: 'General Student Hub',
  state: 'India',
  tier: 'tier2',
  avgTotalMonthly: 9500,
  rentRanges: {
    singleAC: 7500,
    singleNonAC: 5000,
    doubleAC: 4800,
    doubleNonAC: 3400,
    tripleSharing: 2500
  },
  messRanges: {
    fullMess3Meals: 3200,
    twoMealsTiffin: 2600,
    selfCooking: 2000,
    budgetThali: 2300
  },
  libraryRanges: {
    twentyFourSevenAC: 900,
    twelveHourShift: 650,
    sixHourShift: 450,
    none: 0
  },
  commuteRanges: {
    walking: 0,
    bicycle: 100,
    autoRickshaw: 700,
    twoWheelerPetrol: 1400
  },
  laundryRanges: {
    selfWash: 150,
    maidOrHostelService: 450,
    commercialLaundry: 800
  },
  miscAllowance: 750,
  description: 'Estimated student living budget based on typical Indian tier-2 coaching and university towns.',
  savingTips: [
    'Choose double sharing accommodation to save up to 40% on room rent.',
    'Opt for monthly meal subscriptions instead of ordering food via delivery apps.',
    'Walk or use bicycle for daily trips between hostel and coaching.'
  ]
};

export function getCityBenchmark(cityName?: string): CityBudgetBenchmark {
  if (!cityName) return DEFAULT_BENCHMARK;
  const match = Object.keys(CITY_BENCHMARKS).find(
    k => k.toLowerCase() === cityName.toLowerCase() || cityName.toLowerCase().includes(k.toLowerCase())
  );
  if (match) {
    const found = CITY_BENCHMARKS[match];
    if (found) return found;
  }
  return {
    ...DEFAULT_BENCHMARK,
    city: cityName
  };
}
