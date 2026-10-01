/**
 * Comprehensive SEO & Metadata Configuration for Studolink
 * Professional, distinct & high-impact titles matching exact Google Search snippets.
 */

export interface PageSeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalPath: string;
  ogType?: 'website' | 'article';
  schemaType?: 'WebApplication' | 'CollectionPage' | 'AboutPage' | 'FAQPage' | 'Service';
  structuredData?: Record<string, any>;
}

export const BASE_APP_URL = 'https://studolink.imprince.me';

export const ROUTE_SEO_CONFIG: Record<string, PageSeoMetadata> = {
  '/': {
    title: 'Studolink – Zero Brokerage Student PGs, Hostels & Study Hubs',
    description: 'Find verified student PGs, hostels, 24/7 quiet libraries, healthy meal services, and flatmates across Kota, Patna, Delhi, Pune, Sikar & more with 0% brokerage.',
    keywords: [
      'Studolink',
      'student housing',
      'verified PG Kota',
      'hostel search Patna',
      'student libraries',
      'mess service',
      'roommate finder',
      'student marketplace'
    ],
    canonicalPath: '/',
    schemaType: 'WebApplication',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Studolink',
      'url': 'https://studolink.imprince.me',
      'applicationCategory': 'EducationalApplication',
      'operatingSystem': 'All',
      'description': 'Hyper-local student ecosystem platform for verified PGs, hostels, study libraries, meal services, and campus marketplace.',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'INR'
      }
    }
  },
  '/search': {
    title: 'Search Verified Student PGs, Hostels & Libraries | Studolink',
    description: 'Browse & compare verified student accommodations, single/sharing rooms, and PGs with daylight inspection badges near coaching hubs in Kota, Patna, Delhi & Sikar.',
    keywords: [
      'student PG search',
      'hostels near Allen Kota',
      'coaching PG Patna',
      'verified student rooms',
      'hostel booking',
      'PG with mess',
      'affordable student room'
    ],
    canonicalPath: '/search',
    schemaType: 'CollectionPage',
  },
  '/marketplace': {
    title: 'Student Marketplace – Buy, Sell & Donate Books, Coolers & Cycles | Studolink',
    description: 'Peer-to-peer campus marketplace. Buy and sell second-hand study books, NEET/JEE notes, room coolers, study tables, cycles, and electronics directly with coaching peers.',
    keywords: [
      'student marketplace',
      'buy used books Kota',
      'second hand cooler student',
      'study table for sale',
      'used cycle campus',
      'NEET notes resale',
      'free student giveaways',
      'donate free student items'
    ],
    canonicalPath: '/marketplace',
    schemaType: 'CollectionPage',
  },
  '/roommates': {
    title: 'Roommate & Flatmate Finder for Students | Studolink',
    description: 'Connect with verified exam-focused students (JEE, NEET, UPSC, Banking) for room sharing and flatmate requirements with protected in-app chat and zero phone leak.',
    keywords: [
      'roommate finder',
      'flatmate in Kota',
      'NEET roommate',
      'JEE flatmate',
      'room sharing Patna',
      'female student roommate',
      'budget flatmate'
    ],
    canonicalPath: '/roommates',
    schemaType: 'Service',
  },
  '/budget': {
    title: 'Student Monthly Living Cost & Budget Calculator | Studolink',
    description: 'Estimate total monthly student expenses including room rent, mess food, AC library fees, and study supplies across Indian coaching cities with real benchmarks.',
    keywords: [
      'student budget calculator',
      'living cost in Kota',
      'monthly expense for NEET student',
      'PG expense calculator Patna',
      'student cost of living'
    ],
    canonicalPath: '/budget',
    schemaType: 'WebApplication',
  },
  '/hubs': {
    title: 'Top Coaching Clusters & Student Hubs in India | Studolink',
    description: 'Explore student localities: Landmark City & Talwandi (Kota), Boring Road & Bazar Samiti (Patna), Mukherjee Nagar (Delhi), Sikar, and Indore with rent guides.',
    keywords: [
      'student hubs Kota',
      'Landmark City Kunhari',
      'Boring Road Patna PGs',
      'Mukherjee Nagar student hub',
      'coaching clusters India'
    ],
    canonicalPath: '/hubs',
    schemaType: 'CollectionPage',
  },
  '/help': {
    title: 'Help & Support Center – Student FAQs & Contact | Studolink',
    description: 'Need help with PG booking, listing verification, or student marketplace? Check our comprehensive FAQs or contact Studolink support directly.',
    keywords: [
      'Studolink support',
      'student help desk',
      'PG booking FAQ',
      'student verification help',
      'contact Studolink'
    ],
    canonicalPath: '/help',
    schemaType: 'FAQPage',
  },
  '/about': {
    title: 'About Studolink – India\'s Dedicated Student Ecosystem',
    description: 'Learn about Studolink\'s mission to eliminate broker exploitation and empower students with safe, verified, affordable habitats, healthy food, and community.',
    keywords: [
      'about Studolink',
      'Prince Raj founder',
      'student habitat platform',
      'mission Studolink',
      'student welfare India'
    ],
    canonicalPath: '/about',
    schemaType: 'AboutPage',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About Studolink & Founder Prince Raj',
      'url': 'https://studolink.imprince.me/about',
      'description': 'Learn about Studolink and its founder Prince Raj.',
      'mainEntity': {
        '@type': 'Person',
        'name': 'Prince Raj',
        'jobTitle': 'Founder & Software Architect',
        'image': 'https://studolink.imprince.me/founder.jpg',
        'url': 'https://studolink.imprince.me/about',
        'email': 'Founder@imprince.me',
        'sameAs': [
          'https://www.linkedin.com/in/princeraj-in/',
          'https://github.com/princeraj-in',
          'https://www.instagram.com/princerjjjjj?stkn=MWhnMHp1c3UyM2cwdA=='
        ]
      }
    }
  },
  '/safety': {
    title: 'Student Safety, Anti-Scam Advisory & Emergency Helplines | Studolink',
    description: 'Official 24/7 student distress helplines (Tele-MANAS 14416), rental scam prevention guidelines, emergency SOS contacts, and physical inspection standards.',
    keywords: [
      'student safety rules',
      'student helpline Kota',
      'anti-scam PG booking',
      'police helpline student',
      'verified habitat standards'
    ],
    canonicalPath: '/safety',
    schemaType: 'Service',
  },
  '/sell': {
    title: 'List & Sell Used Study Items, Books & Furniture | Studolink',
    description: 'Post your coaching books, notes, cooler, or study table for free on Studolink campus marketplace and reach fellow students directly with zero commission.',
    keywords: [
      'sell student item',
      'resell coaching notes',
      'sell cooler Kota',
      'list second hand book',
      'student classifieds'
    ],
    canonicalPath: '/sell',
    schemaType: 'Service',
  },
  '/chat': {
    title: 'Studolink AI Mitra – 24/7 Student Advisor & Local Guide',
    description: 'Chat with Studolink AI Mitra for instant locality rent advice, coaching center hostel guides, mess tips, and academic lifestyle assistance in Indian cities.',
    keywords: [
      'Studolink AI Mitra',
      'student advisor AI',
      'hostel guide AI',
      'rent advice Kota Patna'
    ],
    canonicalPath: '/chat',
    schemaType: 'WebApplication',
  },
  '/privacy': {
    title: 'Privacy Policy & Student Data Protection | Studolink',
    description: 'Learn how Studolink safeguards student data under DPDP Act 2023 with encrypted communications and strict zero-leakage standards.',
    keywords: ['Studolink privacy', 'student data protection', 'privacy policy'],
    canonicalPath: '/privacy',
    schemaType: 'AboutPage',
  },
  '/terms': {
    title: 'Terms of Service & Zero Brokerage Policy | Studolink',
    description: 'User agreement, verified habitat rules, zero brokerage transparency commitments, and terms of service on Studolink.',
    keywords: ['Studolink terms', 'terms of service', 'zero brokerage terms'],
    canonicalPath: '/terms',
    schemaType: 'AboutPage',
  },
  '/legal': {
    title: 'Legal Compliance, Terms & Grievance Redressal | Studolink',
    description: 'Official legal disclosures, grievance officer contact, IT Act compliances, and user terms on Studolink.',
    keywords: ['Studolink legal', 'grievance officer', 'compliance'],
    canonicalPath: '/legal',
    schemaType: 'AboutPage',
  }
};

/**
 * Helper to get SEO config for any pathname
 */
export function getSeoForPath(pathname: string): PageSeoMetadata {
  const normalized = pathname.toLowerCase().replace(/\/$/, '') || '/';
  const defaultSeo = ROUTE_SEO_CONFIG['/'] as PageSeoMetadata;
  
  if (ROUTE_SEO_CONFIG[normalized]) {
    return ROUTE_SEO_CONFIG[normalized] as PageSeoMetadata;
  }

  // Dynamic route matchers
  if (normalized.startsWith('/search')) {
    return (ROUTE_SEO_CONFIG['/search'] || defaultSeo) as PageSeoMetadata;
  }
  if (normalized.startsWith('/roommates')) {
    return (ROUTE_SEO_CONFIG['/roommates'] || defaultSeo) as PageSeoMetadata;
  }
  if (normalized.startsWith('/marketplace')) {
    return (ROUTE_SEO_CONFIG['/marketplace'] || defaultSeo) as PageSeoMetadata;
  }
  if (normalized.startsWith('/listing/')) {
    return {
      title: 'Student Habitat & PG Details | Studolink',
      description: 'View room photos, rent details, verified amenities, safety standards, and verified student reviews on Studolink.',
      keywords: ['verified PG', 'hostel details', 'student accommodation', 'rent in Kota', 'Patna PG'],
      canonicalPath: normalized,
      schemaType: 'Service',
    };
  }

  return defaultSeo;
}
