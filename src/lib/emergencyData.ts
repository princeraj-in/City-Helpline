import { EmergencyContact, CityEmergencyInfo } from '../types';

export const NATIONAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: 'National Emergency Response System (Pan-India)',
    number: '112',
    category: 'police',
    description: 'Instant 24x7 unified dispatch for Police, Fire, and Ambulance across all states.',
    is24x7: true,
    priority: 1
  },
  {
    title: 'Tele-MANAS Student Mental Health Helpline',
    number: '14416',
    category: 'suicide_distress',
    description: 'Govt. 24x7 free confidential mental wellness & exam stress counseling in multi-languages.',
    is24x7: true,
    priority: 1
  },
  {
    title: 'National Ambulance Emergency',
    number: '108',
    category: 'ambulance',
    description: 'Free emergency medical ambulance pickup & first response.',
    is24x7: true,
    priority: 2
  },
  {
    title: 'Women in Distress & Safety Helpline',
    number: '1091',
    category: 'women_safety',
    description: '24x7 immediate response & patrol assistance for female students.',
    is24x7: true,
    priority: 2
  },
  {
    title: 'National Cyber Crime Student Helpline',
    number: '1930',
    category: 'cyber',
    description: 'Report financial fraud, cyber blackmail, or online harassment immediately.',
    is24x7: true,
    priority: 3
  },
  {
    title: 'KIRAN Mental Health Rehabilitation',
    number: '18005990019',
    category: 'suicide_distress',
    description: 'Toll-free 24/7 psychological first-aid and anxiety counseling.',
    is24x7: true,
    priority: 3
  }
];

export const CITY_EMERGENCY_DATA: Record<string, CityEmergencyInfo> = {
  Kota: {
    city: 'Kota',
    state: 'Rajasthan',
    studentDistressHelpline: {
      title: 'Kota Student Suicide Prevention & Counseling',
      number: '07442433303',
      category: 'suicide_distress',
      description: 'Special 24x7 District Administration & Psychologists cell for coaching students.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: 'Kota Police Control Room & Student Safety',
      number: '07442350700',
      category: 'police',
      description: 'Dedicated student grievance patrol (Kunhari, Talwandi, Vigyan Nagar, Landmark City).',
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: 'MBS Government Hospital Trauma Emergency',
      number: '07442323701',
      category: 'hospital',
      description: 'Nearest 24x7 tertiary care trauma & emergency center in Kota.',
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: 'Kota Women & Girls Safety Patrol',
      number: '1091',
      category: 'women_safety',
      description: 'Immediate women police assistance for female hostellers & PG residents.',
      is24x7: true,
      priority: 2
    },
    localContacts: [
      {
        title: 'Kota Coaching Student Distress Response',
        number: '07442350050',
        category: 'suicide_distress',
        description: 'Joint coaching council student relief response desk.',
        is24x7: true
      },
      {
        title: 'New Medical College Hospital (NMCH) Kota',
        number: '07442470123',
        category: 'hospital',
        description: '24-hour casualty ward and emergency services near Rangbari.',
        is24x7: true
      }
    ]
  },
  'New Delhi': {
    city: 'New Delhi',
    state: 'Delhi',
    studentDistressHelpline: {
      title: 'Delhi Student Tele-MANAS Counseling',
      number: '14416',
      category: 'suicide_distress',
      description: 'Free confidential counseling for DU, IIT, and UPSC aspirants in Delhi.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: 'Delhi Police Emergency Dispatch',
      number: '112',
      category: 'police',
      description: 'Rapid response for Old Rajinder Nagar, Mukherjee Nagar, Kalu Sarai.',
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: 'AIIMS New Delhi Emergency Casualty',
      number: '01126588700',
      category: 'hospital',
      description: 'Apex 24x7 emergency and trauma care center at Ansari Nagar.',
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: 'Delhi Commission for Women (DCW)',
      number: '181',
      category: 'women_safety',
      description: '24x7 helpline for women safety and emergency intervention.',
      is24x7: true,
      priority: 2
    },
    localContacts: [
      {
        title: 'Safdarjung Hospital Emergency Trauma',
        number: '01126165060',
        category: 'hospital',
        description: '24-hour round-the-clock emergency casualty near AIIMS.',
        is24x7: true
      },
      {
        title: 'Delhi Student Safety Cell (Special Branch)',
        number: '1090',
        category: 'police',
        description: 'Anti-harassment and student safety unit.',
        is24x7: true
      }
    ]
  },
  Delhi: {
    city: 'Delhi',
    state: 'Delhi',
    studentDistressHelpline: {
      title: 'Delhi Student Counseling Helpline',
      number: '14416',
      category: 'suicide_distress',
      description: '24x7 free mental wellness for civil services and college students.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: 'Delhi Police Control Room',
      number: '112',
      category: 'police',
      description: 'Unified emergency dispatch across all Delhi NCR districts.',
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: 'AIIMS Emergency Medical Unit',
      number: '01126588700',
      category: 'hospital',
      description: '24x7 emergency department for critical medical aid.',
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: 'Women Safety Helpline Delhi',
      number: '181',
      category: 'women_safety',
      description: '24x7 SOS helpline for female students.',
      is24x7: true,
      priority: 2
    },
    localContacts: [
      {
        title: 'Safdarjung Hospital Casualty',
        number: '01126165060',
        category: 'hospital',
        description: '24-hour trauma and emergency services.',
        is24x7: true
      }
    ]
  },
  Patna: {
    city: 'Patna',
    state: 'Bihar',
    studentDistressHelpline: {
      title: 'Patna Student Distress & Youth Helpline',
      number: '06122219500',
      category: 'suicide_distress',
      description: 'Special mental health and crisis support for students in Patna.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: 'Patna Police Emergency Dial 112',
      number: '112',
      category: 'police',
      description: 'Quick response mobile patrol across Boring Road, Kankarbagh, Bazar Samiti.',
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: 'PMCH Patna Emergency Trauma Ward',
      number: '06122300080',
      category: 'hospital',
      description: 'Patna Medical College Hospital 24x7 emergency services.',
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: 'Bihar Women Safety Helpline',
      number: '181',
      category: 'women_safety',
      description: 'Statewide 24x7 women support line for harassment and assistance.',
      is24x7: true,
      priority: 2
    },
    localContacts: [
      {
        title: 'IGIMS Patna Emergency',
        number: '06122297631',
        category: 'hospital',
        description: 'Indira Gandhi Institute of Medical Sciences 24x7 emergency.',
        is24x7: true
      },
      {
        title: 'Patna Police Control Room',
        number: '06122201977',
        category: 'police',
        description: 'Central police control room Patna.',
        is24x7: true
      }
    ]
  },
  Sikar: {
    city: 'Sikar',
    state: 'Rajasthan',
    studentDistressHelpline: {
      title: 'Sikar Coaching Student Counseling Cell',
      number: '01572251100',
      category: 'suicide_distress',
      description: 'Dedicated student assistance for Piprali Road coaching hub.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: 'Sikar Police Control Room',
      number: '01572250100',
      category: 'police',
      description: 'Piprali Road & Nawalgarh Road special police patrolling unit.',
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: 'SK District Hospital Emergency Sikar',
      number: '01572250220',
      category: 'hospital',
      description: '24-hour civil hospital emergency casualty ward.',
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: 'Women Safety Helpline Sikar',
      number: '1091',
      category: 'women_safety',
      description: 'Instant response for girls hostels and PG accommodations.',
      is24x7: true,
      priority: 2
    },
    localContacts: [
      {
        title: 'Sikar Emergency Ambulance',
        number: '108',
        category: 'ambulance',
        description: 'Immediate ambulance pickup service.',
        is24x7: true
      }
    ]
  },
  Jaipur: {
    city: 'Jaipur',
    state: 'Rajasthan',
    studentDistressHelpline: {
      title: 'Rajasthan State Student Helpline',
      number: '181',
      category: 'suicide_distress',
      description: 'State toll-free helpline for student distress & counseling.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: 'Jaipur Police Commissionerate Control',
      number: '01412565656',
      category: 'police',
      description: 'Gopalpura Bypass & Lal Kothi coaching zone patrol.',
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: 'SMS Government Hospital Trauma Center',
      number: '01412560291',
      category: 'hospital',
      description: 'Premier 24x7 trauma & multi-specialty emergency in Jaipur.',
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: 'Jaipur Women Helpline & Nirbhaya Squad',
      number: '1090',
      category: 'women_safety',
      description: 'Fast response women safety patrol unit.',
      is24x7: true,
      priority: 2
    },
    localContacts: []
  },
  Lucknow: {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    studentDistressHelpline: {
      title: 'UP Student Welfare & Helpline',
      number: '1076',
      category: 'suicide_distress',
      description: 'CM Helpline and student welfare distress support.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: 'UP Police Emergency Dispatch 112',
      number: '112',
      category: 'police',
      description: 'Integrated police quick response dispatch across Lucknow.',
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: 'KGMU Trauma Center Lucknow',
      number: '05222257540',
      category: 'hospital',
      description: 'King George Medical University 24-hour trauma & casualty.',
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: 'UP Women Power Line',
      number: '1090',
      category: 'women_safety',
      description: 'Statewide dedicated women security & emergency helpline.',
      is24x7: true,
      priority: 2
    },
    localContacts: []
  },
  Indore: {
    city: 'Indore',
    state: 'Madhya Pradesh',
    studentDistressHelpline: {
      title: 'MP Student Tele-MANAS Counseling',
      number: '14416',
      category: 'suicide_distress',
      description: '24x7 free mental wellness support for Bhawarkua student hub.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: 'Indore Police Control Room',
      number: '07312527383',
      category: 'police',
      description: 'Bhawarkua & Geeta Bhawan coaching zone emergency desk.',
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: 'MY Hospital Emergency Indore',
      number: '07312527383',
      category: 'hospital',
      description: 'Maharaja Yeshwantrao Hospital 24x7 emergency services.',
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: 'Indore Women Helpline',
      number: '1091',
      category: 'women_safety',
      description: 'Rapid response for female students and working women.',
      is24x7: true,
      priority: 2
    },
    localContacts: []
  }
};

/**
 * Returns dynamic emergency contacts tailored to the student's active location.
 */
export function getCityEmergencyInfo(cityName?: string): CityEmergencyInfo {
  const defaultKota = CITY_EMERGENCY_DATA['Kota'] as CityEmergencyInfo;
  if (!cityName) {
    return defaultKota;
  }

  const clean = cityName.trim();
  // Exact match
  const exact = CITY_EMERGENCY_DATA[clean];
  if (exact) {
    return exact;
  }

  // Case-insensitive / partial match
  const lower = clean.toLowerCase();
  for (const [key, val] of Object.entries(CITY_EMERGENCY_DATA)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return val;
    }
  }

  // Dynamic fallback for any other city in India
  return {
    city: clean,
    state: 'India',
    studentDistressHelpline: {
      title: `${clean} Student Mental Wellness (Tele-MANAS)`,
      number: '14416',
      category: 'suicide_distress',
      description: 'Govt. 24x7 toll-free exam distress and mental health counseling.',
      is24x7: true,
      priority: 1
    },
    policeControl: {
      title: `${clean} Police Emergency Dispatch`,
      number: '112',
      category: 'police',
      description: `Rapid 24x7 police emergency dispatch service in ${clean}.`,
      is24x7: true,
      priority: 1
    },
    primaryHospital: {
      title: `${clean} District Hospital Ambulance & Casualty`,
      number: '108',
      category: 'hospital',
      description: `Immediate medical emergency & ambulance response for ${clean}.`,
      is24x7: true,
      priority: 2
    },
    womenHelpline: {
      title: `${clean} Women Safety Helpline`,
      number: '1091',
      category: 'women_safety',
      description: `Emergency women protection and distress response in ${clean}.`,
      is24x7: true,
      priority: 2
    },
    localContacts: []
  };
}
