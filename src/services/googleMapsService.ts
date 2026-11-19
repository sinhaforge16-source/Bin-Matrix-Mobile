import { Linking, Platform, Alert } from 'react-native';
import { GoogleConfig } from './googleConfig';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface MapMarkerOptions {
  latitude: number;
  longitude: number;
  label?: string;
  color?: string; // 'red', 'green', 'blue', 'yellow', etc.
}

class GoogleMapsService {
  /**
   * Launch native Google Maps Turn-by-Turn Driving Navigation to a specific coordinate or destination
   */
  public async openNavigation(
    destination: LatLng | string,
    label?: string
  ): Promise<boolean> {
    try {
      let targetUrl = '';
      const destParam =
        typeof destination === 'string'
          ? encodeURIComponent(destination)
          : `${destination.latitude},${destination.longitude}`;

      if (Platform.OS === 'android') {
        // Native Android Google Maps Navigation Scheme
        const androidNavUrl = `google.navigation:q=${destParam}&mode=d`;
        const canOpen = await Linking.canOpenURL(androidNavUrl);
        if (canOpen) {
          await Linking.openURL(androidNavUrl);
          return true;
        }
      } else if (Platform.OS === 'ios') {
        // iOS Google Maps app scheme
        const iosGoogleMapsUrl = `comgooglemaps://?daddr=${destParam}&directionsmode=driving`;
        const canOpen = await Linking.canOpenURL(iosGoogleMapsUrl);
        if (canOpen) {
          await Linking.openURL(iosGoogleMapsUrl);
          return true;
        }
      }

      // Universal Web / Browser Google Maps Directions Fallback
      targetUrl = `https://www.google.com/maps/dir/?api=1&destination=${destParam}&travelmode=driving`;
      if (label) {
        targetUrl += `&destination_place_id=${encodeURIComponent(label)}`;
      }

      await Linking.openURL(targetUrl);
      return true;
    } catch (err: any) {
      Alert.alert(
        'Google Maps',
        `Could not launch Google Maps navigation: ${err.message || 'Unknown error'}`
      );
      return false;
    }
  }

  /**
   * Launch Google Maps with a multi-stop collection route
   */
  public async openRouteNavigation(
    stops: (LatLng | string)[],
    originLabel?: string
  ): Promise<boolean> {
    if (!stops || stops.length === 0) {
      Alert.alert('Route Navigation', 'No route stops available for Google Maps.');
      return false;
    }

    try {
      const formatStop = (s: LatLng | string) =>
        typeof s === 'string' ? encodeURIComponent(s) : `${s.latitude},${s.longitude}`;

      const destination = formatStop(stops[stops.length - 1]);
      let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

      if (stops.length > 1) {
        const intermediateWaypoints = stops
          .slice(0, stops.length - 1)
          .map(formatStop)
          .join('|');
        url += `&waypoints=${intermediateWaypoints}`;
      }

      await Linking.openURL(url);
      return true;
    } catch (err: any) {
      Alert.alert('Google Maps', `Failed to open Google Maps route: ${err.message}`);
      return false;
    }
  }

  /**
   * Generate Google Static Maps URL with markers and route path
   */
  public getStaticMapUrl(options: {
    center?: LatLng | string;
    zoom?: number;
    size?: string; // '600x400'
    markers?: MapMarkerOptions[];
    pathCoords?: LatLng[];
  }): string {
    const apiKey = GoogleConfig.getMapsApiKey();
    const size = options.size || '600x400';
    let url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&scale=2`;

    if (options.center) {
      const centerStr =
        typeof options.center === 'string'
          ? encodeURIComponent(options.center)
          : `${options.center.latitude},${options.center.longitude}`;
      url += `&center=${centerStr}`;
    }

    if (options.zoom !== undefined) {
      url += `&zoom=${options.zoom}`;
    }

    // Add Markers
    if (options.markers && options.markers.length > 0) {
      options.markers.forEach((m) => {
        const color = m.color || 'red';
        const label = m.label ? m.label.charAt(0).toUpperCase() : '';
        url += `&markers=color:${color}%7Clabel:${label}%7C${m.latitude},${m.longitude}`;
      });
    }

    // Add Route Path
    if (options.pathCoords && options.pathCoords.length > 1) {
      const pathStr = options.pathCoords
        .map((p) => `${p.latitude},${p.longitude}`)
        .join('%7C');
      url += `&path=color:0x2563EBff%7Cweight:4%7C${pathStr}`;
    }

    url += `&key=${apiKey}`;
    return url;
  }

  /**
   * Reverse Geocode coordinates to human-readable Sri Lankan street / area name
   */
  public async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    const apiKey = GoogleConfig.getMapsApiKey();
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const googleMapsService = new GoogleMapsService();
