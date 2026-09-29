/**
 * Official App Configuration
 * Canonical Domain: studolink.imprince.me
 */

export const APP_CONFIG = {
  name: 'Studolink',
  tagline: 'Your City. Your Student Ecosystem.',
  domain: 'studolink.imprince.me',
  baseUrl: 'https://studolink.imprince.me',
  supportEmail: 'Support@imprince.me',
  developerEmail: 'Developer@imprince.me',

  /**
   * Generates a fully qualified production URL for any path
   * Always uses the official domain https://studolink.imprince.me
   */
  getUrl: (path: string = '') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `https://studolink.imprince.me${cleanPath}`;
  },

  getListingUrl: (listingId: string) => {
    return `https://studolink.imprince.me/listing/${listingId}`;
  },

  getMarketplaceUrl: (itemId?: string) => {
    return itemId 
      ? `https://studolink.imprince.me/marketplace?item=${itemId}` 
      : `https://studolink.imprince.me/marketplace`;
  },

  getBudgetUrl: (city?: string) => {
    return city 
      ? `https://studolink.imprince.me/budget?city=${encodeURIComponent(city)}` 
      : `https://studolink.imprince.me/budget`;
  },

  getSearchUrl: (city?: string, category?: string) => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    const qs = params.toString();
    return `https://studolink.imprince.me/search${qs ? `?${qs}` : ''}`;
  }
};
