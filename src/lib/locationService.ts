import { UserLocation } from '../types';
import { ALL_CITIES, STATE_CITIES } from './constants';

const LOCATION_STORAGE_KEY = 'studolink_user_location';
const OLD_LOCATION_STORAGE_KEY = 'city_helpline_user_location';

// Centroids for major Indian student hubs and metro cities for fast fallback
const CITY_COORDINATES: Array<{ city: string; state: string; lat: number; lng: number }> = [
  { city: 'Kota', state: 'Rajasthan', lat: 25.18, lng: 75.83 },
  { city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { city: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { city: 'North Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { city: 'South Delhi', state: 'Delhi', lat: 28.5355, lng: 77.2410 },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { city: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
  { city: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002 },
  { city: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Sikar', state: 'Rajasthan', lat: 27.6094, lng: 75.1398 },
  { city: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findClosestCity(lat: number, lng: number): { city: string; state: string; distanceKm: number } {
  let closest = CITY_COORDINATES[0];
  let minDistance = Infinity;

  for (const item of CITY_COORDINATES) {
    const dist = calculateDistanceKm(lat, lng, item.lat, item.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return {
    city: closest.city,
    state: closest.state,
    distanceKm: Math.round(minDistance)
  };
}

/**
 * Standardize city name against existing listings or catalog
 */
export function normalizeCityName(rawCity: string): string {
  if (!rawCity) return 'Kota';
  const clean = rawCity.trim();

  // Look for direct match in ALL_CITIES
  const directMatch = ALL_CITIES.find(c => c.toLowerCase() === clean.toLowerCase());
  if (directMatch) return directMatch;

  // Handle Delhi variations
  if (clean.toLowerCase().includes('delhi')) {
    if (clean.toLowerCase().includes('north')) return 'North Delhi';
    if (clean.toLowerCase().includes('south')) return 'South Delhi';
    if (clean.toLowerCase().includes('east')) return 'East Delhi';
    if (clean.toLowerCase().includes('west')) return 'West Delhi';
    return 'New Delhi';
  }

  // Handle Bangalore / Bengaluru
  if (clean.toLowerCase().includes('bangalore') || clean.toLowerCase().includes('bengaluru')) {
    return 'Bengaluru';
  }

  // Partial match in known cities
  const partial = ALL_CITIES.find(c => clean.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(clean.toLowerCase()));
  if (partial) return partial;

  return clean;
}

/**
 * Reverse geocode latitude and longitude into address and city
 */
export async function reverseGeocodeCoordinates(latitude: number, longitude: number): Promise<UserLocation> {
  const fallback = findClosestCity(latitude, longitude);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'StudolinkApp/1.0'
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const rawCity =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.city_district ||
        addr.municipality ||
        addr.suburb ||
        fallback.city;

      const normalizedCity = normalizeCityName(rawCity);
      const state = addr.state || fallback.state;
      const district = addr.state_district || addr.county || '';
      const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || '';
      const pincode = addr.postcode || '';

      const parts = [area, normalizedCity, state, pincode].filter(Boolean);
      const formattedAddress = parts.join(', ');

      return {
        city: normalizedCity,
        state,
        district,
        area,
        pincode,
        latitude,
        longitude,
        formattedAddress: formattedAddress || `${normalizedCity}, ${state}`,
        isLiveDetected: true,
        updatedAt: Date.now()
      };
    }
  } catch (err) {
    console.warn('Geocoding service unavailable, using coordinate projection fallback:', err);
  }

  // Fallback to closest known student hub
  return {
    city: fallback.city,
    state: fallback.state,
    area: '',
    pincode: '',
    latitude,
    longitude,
    formattedAddress: `${fallback.city}, ${fallback.state}`,
    isLiveDetected: true,
    updatedAt: Date.now()
  };
}

/**
 * Prompts browser Geolocation API
 */
export function getLiveDeviceCoordinates(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. Please enable location access in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is currently unavailable from your device.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please try again or select your city manually.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 120000
      }
    );
  });
}

export function getStoredLocation(): UserLocation | null {
  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY) || localStorage.getItem(OLD_LOCATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserLocation;
  } catch {
    return null;
  }
}

export function saveStoredLocation(location: UserLocation): void {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch (err) {
    console.warn('Unable to persist location to localStorage', err);
  }
}

export function clearStoredLocation(): void {
  try {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch {}
}
