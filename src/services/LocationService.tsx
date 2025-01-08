import { Platform, PermissionsAndroid } from 'react-native';
import GeolocationService from '@react-native-community/geolocation';

// Define types for Geolocation
interface GeolocationError {
  code: number;
  message: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

interface Position {
  coords: Coordinates;
  timestamp: number;
}

interface GeoOptions {
  timeout?: number;
  maximumAge?: number;
  enableHighAccuracy?: boolean;
  distanceFilter?: number;
  useSignificantChanges?: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

class LocationService {
  private watchId: number | null;
  private currentLocation: Location | null;

  constructor() {
    this.watchId = null;
    this.currentLocation = null;
  }

  // Request location permissions for Android
  async requestAndroidPermission(): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location for Google Maps functionality.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Error requesting location permission:', err);
      return false;
    }
  }

  // Configure location settings
  configure(): void {
    GeolocationService.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });
  }

  // Get current location once
  async getCurrentLocation(): Promise<Location> {
    try {
      // Check platform-specific permissions
      if (Platform.OS === 'android') {
        const hasPermission = await this.requestAndroidPermission();
        if (!hasPermission) {
          throw new Error('Location permission denied');
        }
      }

      // Configure location settings
      this.configure();

      // Get current position
      return new Promise((resolve, reject) => {
        GeolocationService.getCurrentPosition(
          (position: Position) => {
            const locationData: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            };
            this.currentLocation = locationData;
            resolve(locationData);
          },
          (error: GeolocationError) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      });
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  // Start watching location updates
  startWatchingLocation(
    onLocationChange: (location: Location) => void,
    onError?: (error: GeolocationError) => void
  ): void {
    try {
      this.watchId = GeolocationService.watchPosition(
        (position: Position) => {
          const locationData: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          this.currentLocation = locationData;
          onLocationChange(locationData);
        },
        (error: GeolocationError) => {
          if (onError) {
            onError(error);
          }
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 2000,
        }
      );
    } catch (error) {
      console.error('Error watching location:', error);
      throw error;
    }
  }

  // Stop watching location updates
  stopWatchingLocation(): void {
    if (this.watchId !== null) {
      GeolocationService.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get last known location
  getLastKnownLocation(): Location | null {
    return this.currentLocation;
  }
}

export default new LocationService();