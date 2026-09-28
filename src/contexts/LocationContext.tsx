import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserLocation } from '../types';
import { useAuth } from './AuthContext';
import {
  getLiveDeviceCoordinates,
  reverseGeocodeCoordinates,
  getStoredLocation,
  saveStoredLocation,
  clearStoredLocation,
  normalizeCityName
} from '../lib/locationService';

interface LocationContextType {
  userLocation: UserLocation | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  isLocationModalOpen: boolean;
  hasPrompted: boolean;
  requestLiveLocation: (isBackground?: boolean) => Promise<UserLocation | null>;
  setManualLocation: (city: string, state?: string, area?: string, pincode?: string) => void;
  clearLocation: () => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => getStoredLocation());
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [hasPrompted, setHasPrompted] = useState<boolean>(() => {
    return !!(localStorage.getItem('studolink_location_prompted') || localStorage.getItem('city_helpline_location_prompted'));
  });

  // Persist to user's Firestore profile if signed in
  const syncLocationToFirestore = useCallback(async (loc: UserLocation) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        city: loc.city,
        address: loc.formattedAddress || loc.area || `${loc.city}, ${loc.state || ''}`,
        pincode: loc.pincode || '',
        latitude: loc.latitude ?? 0,
        longitude: loc.longitude ?? 0
      });
    } catch (err) {
      console.warn('Could not save location to user profile:', err);
    }
  }, [currentUser]);

  // Request live geolocation from device
  const requestLiveLocation = useCallback(async (isBackground = false): Promise<UserLocation | null> => {
    setIsLoadingLocation(true);
    setLocationError(null);
    try {
      const coords = await getLiveDeviceCoordinates();
      const loc = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      
      setUserLocation(loc);
      saveStoredLocation(loc);
      localStorage.setItem('studolink_location_prompted', 'true');
      setHasPrompted(true);
      
      // Async sync to Firestore
      syncLocationToFirestore(loc);
      setIsLoadingLocation(false);
      return loc;
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to detect location';
      if (!isBackground) {
        setLocationError(errMsg);
      }
      setIsLoadingLocation(false);
      return null;
    }
  }, [syncLocationToFirestore]);

  // Set location manually (e.g. city select or search)
  const setManualLocation = useCallback((city: string, state?: string, area?: string, pincode?: string) => {
    const normalized = normalizeCityName(city);
    const newLoc: UserLocation = {
      city: normalized,
      state: state || '',
      area: area || '',
      pincode: pincode || '',
      formattedAddress: [area, normalized, state, pincode].filter(Boolean).join(', ') || normalized,
      isLiveDetected: false,
      updatedAt: Date.now()
    };

    setUserLocation(newLoc);
    saveStoredLocation(newLoc);
    localStorage.setItem('studolink_location_prompted', 'true');
    setHasPrompted(true);
    setLocationError(null);
    syncLocationToFirestore(newLoc);
  }, [syncLocationToFirestore]);

  // Clear location
  const clearLocation = useCallback(() => {
    setUserLocation(null);
    clearStoredLocation();
  }, []);

  const openLocationModal = useCallback(() => setIsLocationModalOpen(true), []);
  const closeLocationModal = useCallback(() => setIsLocationModalOpen(false), []);

  // Check browser permission status on startup
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.permissions?.query) return;

    let permissionStatus: PermissionStatus | null = null;
    navigator.permissions.query({ name: 'geolocation' as PermissionName })
      .then((status) => {
        permissionStatus = status;
        
        // If permission is already granted, refresh/fetch live location automatically
        if (status.state === 'granted') {
          requestLiveLocation(true);
        }

        // When user changes permission in browser settings
        status.onchange = () => {
          if (status.state === 'granted') {
            requestLiveLocation(false);
          }
        };
      })
      .catch(() => {
        // Permissions query not supported for geolocation in some browsers
      });

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [requestLiveLocation]);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLoadingLocation,
        locationError,
        isLocationModalOpen,
        hasPrompted,
        requestLiveLocation,
        setManualLocation,
        clearLocation,
        openLocationModal,
        closeLocationModal,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
