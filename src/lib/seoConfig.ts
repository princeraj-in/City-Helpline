/**
 * Comprehensive SEO & Metadata Configuration for Studolink
 * Professional, short & high-impact titles matching exact specifications.
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
    title: 'Studolink - Your City Your Ecosystem',
    description: 'Discover verified student PGs, hostels, 24/7 quiet study libraries, hygienic mess services, roommate matching, and campus marketplace in Kota, Patna, Pune, Delhi & more.',
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
    title: 'Find Verified Student Hostels, PGs & everything Students need - Studolink',
    description: 'Search & compare student hostels, single rooms, 1BHK/2BHK flats, and verified PGs near top coaching institutes in Kota, Patna, Delhi, Pune, Sikar with physical inspection trust badges.',
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
  '/roommates': {
    title: 'Studolink Roommate Finder',
    description: 'Connect with verified exam-focused students (NEET, JEE, UPSC, Banking) for room sharing and flatmate requirements with zero phone leakage and privacy protection.',
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
  '/marketplace': {
    title: 'Student Marketplace – Buy & Sell & Donate free',
    description: 'Buy, sell, and donate second-hand study books, notes, desert coolers, study tables, cycles, mattresses, and electronics directly with fellow coaching students.',
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
  '/sell': {
    title: 'Sell Student Items & Books - Studolink',
    description: 'Easily list your used study materials, desert coolers, furniture, cycles, or giveaways for campus students with protected in-app chat and zero spam.',
    keywords: [
      'sell student item',
      'resell coaching notes',
      'sell cooler Kota',
      'list second hand book',
      'student classifieds'
    ],
    canonicalPath: '/sell',
  },
  '/budget': {
    title: 'Monthly Budget Calculator - Studolink',
    description: 'Calculate monthly living expenses (PG rent, mess, library fees, stationery, laundry & travel) across Kota, Patna, Pune, Delhi, Indore, and Sikar with regional benchmarks.',
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
    title: 'All Students HUB - Studolink',
    description: 'Explore top student hubs like Landmark City Kunhari Kota, Kankarbagh Boring Road Patna, Mukherjee Nagar Delhi, Kothrud Pune with area-wise rent benchmarks and verified hostels.',
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
  '/safety': {
    title: 'Student Safety & Helpline - Studolink',
    description: '24/7 student distress helpline numbers, anti-scam rental guidelines, emergency SOS contacts, and physical PG inspection verification standards.',
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
  '/help': {
    title: 'Studolink Help & Support Center',
    description: 'Get answers on PG booking, student verification badges, marketplace listings, roommate connect requests, safety guidelines, and direct support assistance.',
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
    title: 'About Studolink - Student Ecosystem',
    description: 'Learn about Studolink mission to provide safe, affordable, verified accommodations, libraries, healthy food, and peer community for competitive exam students.',
    keywords: [
      'about Studolink',
      'student habitat platform',
      'mission Studolink',
      'student welfare India'
    ],
    canonicalPath: '/about',
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
      title: 'Student Habitat & PG Details - Studolink',
      description: 'View room photos, rent details, verified amenities, safety standards, and verified student reviews on Studolink.',
      keywords: ['verified PG', 'hostel details', 'student accommodation', 'rent in Kota', 'Patna PG'],
      canonicalPath: normalized,
      schemaType: 'Service',
    };
  }

  return defaultSeo;
}
