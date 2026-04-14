import { create } from 'zustand';
import { message } from 'antd';

export type LocationStatus = 'idle' | 'loading' | 'success' | 'denied' | 'error';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  status: LocationStatus;
  hasAttempted: boolean;
  fetchLocation: (force?: boolean) => void;
}

// Fallback to New York City if rejected or errored
const FALLBACK_LAT = 40.7128;
const FALLBACK_LNG = -74.0060;

export const useLocationStore = create<LocationState>((set, get) => ({
  latitude: null,
  longitude: null,
  status: 'idle',
  hasAttempted: false,

  fetchLocation: (force = false) => {
    const { status, hasAttempted } = get();
    
    // If we already successfully got the location or explicitly denied it, don't ping again
    // unless specifically forced (e.g., user clicked a "Refresh Location" button)
    if (!force && hasAttempted && (status === 'success' || status === 'denied')) {
      return;
    }

    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser');
      set({ 
        latitude: FALLBACK_LAT, 
        longitude: FALLBACK_LNG, 
        status: 'error',
        hasAttempted: true 
      });
      return;
    }

    set({ status: 'loading' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        set({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: 'success',
          hasAttempted: true
        });
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        
        let newStatus: LocationStatus = 'error';
        if (error.code === error.PERMISSION_DENIED) {
          newStatus = 'denied';
          message.info('Location access denied. Using default location (New York).');
        } else {
          message.error('Failed to get location. Using default location.');
        }

        set({
          latitude: FALLBACK_LAT,
          longitude: FALLBACK_LNG,
          status: newStatus,
          hasAttempted: true
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000 // Cache for 5 mins natively by browser
      }
    );
  }
}));
