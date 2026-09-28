/**
 * Official App Configuration
 * Canonical Domain: app.imprince.me
 */

export const APP_CONFIG = {
  name: 'Studolink',
  tagline: 'Your City. Your Student Ecosystem.',
  domain: 'app.imprince.me',
  baseUrl: 'https://app.imprince.me',
  supportEmail: 'Support@imprince.me',
  developerEmail: 'Developer@imprince.me',

  /**
   * Generates a fully qualified production URL for any path
   * Always uses the official domain https://app.imprince.me
   */
  getUrl: (path: string = '') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `https://app.imprince.me${cleanPath}`;
  },

  getListingUrl: (listingId: string) => {
    return `https://app.imprince.me/listing/${listingId}`;
  },

  getMarketplaceUrl: (itemId?: string) => {
    return itemId 
      ? `https://app.imprince.me/marketplace?item=${itemId}` 
      : `https://app.imprince.me/marketplace`;
  },

  getBudgetUrl: (city?: string) => {
    return city 
      ? `https://app.imprince.me/budget?city=${encodeURIComponent(city)}` 
      : `https://app.imprince.me/budget`;
  },

  getSearchUrl: (city?: string, category?: string) => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    const qs = params.toString();
    return `https://app.imprince.me/search${qs ? `?${qs}` : ''}`;
  }
};
