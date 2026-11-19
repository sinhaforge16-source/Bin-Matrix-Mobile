import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {
  NavHomeIcon,
  GoogleMapNavIcon,
  NavProfileIcon,
} from '../components/CommonIcons';
import { Language, TRANSLATIONS } from '../utils/translations';
import { apiService } from '../services/apiService';
import { googleMapsService } from '../services/googleMapsService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapPinData {
  id: number;
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  isCompleted: boolean;
  code: string;
  location: string;
  fillLevel?: number;
  rawId?: string;
}

interface Props {
  language?: Language;
  onNavigateHome: () => void;
  onNavigateAccount: () => void;
}

/**
 * Teardrop Map Pin with centered number
 */
const MapPinMarker: React.FC<{
  x: number;
  y: number;
  id: number;
  isCompleted: boolean;
  onPress: () => void;
  hasHalo?: boolean;
}> = ({ x, y, id, isCompleted, onPress, hasHalo = false }) => {
  const pinColor = isCompleted ? '#16A34A' : '#DC2626';

  return (
    <G transform={`translate(${x}, ${y})`} onPress={onPress}>
      {/* Translucent circular radius halo */}
      {hasHalo && (
        <Circle cx="0" cy="0" r="30" fill="#94A3B8" fillOpacity="0.22" />
      )}

      {/* Pin Shadow */}
      <Circle cx="0" cy="4" r="5" fill="#0F172A" fillOpacity="0.18" />

      {/* Pin Teardrop Shape */}
      <Path
        d="M 0 -24 C -11 -24, -18 -17, -18 -6 C -18 4, -4 14, 0 20 C 4 14, 18 4, 18 -6 C 18 -17, 11 -24, 0 -24 Z"
        fill={pinColor}
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />

      {/* Pin White Inner Circle */}
      <Circle cx="0" cy="-6" r="9" fill="#FFFFFF" />

      {/* Pin Number */}
      <SvgText
        x="0"
        y="-2.5"
        fill={pinColor}
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
      >
        {id}
      </SvgText>
    </G>
  );
};

const DEFAULT_PINS: MapPinData[] = [
  {
    id: 1,
    x: 180,
    y: 430,
    latitude: 6.8732,
    longitude: 79.8598,
    isCompleted: true,
    code: 'Deh-2213-Ai',
    location: 'Tamil, Sangam Institute, Wellawatte (Stop 1)',
  },
  {
    id: 2,
    x: 75,
    y: 360,
    latitude: 6.8421,
    longitude: 79.8642,
    isCompleted: true,
    code: 'Deh-2233-Gn',
    location: 'Galle Rd, Dehiwala-Mount Lavinia (Stop 2)',
  },
  {
    id: 3,
    x: 48,
    y: 285,
    latitude: 6.8315,
    longitude: 79.8631,
    isCompleted: false,
    code: 'Deh-2243-Fa',
    location: 'Mount Lavinia Beach Rd (Stop 3)',
  },
  {
    id: 4,
    x: 120,
    y: 175,
    latitude: 6.892,
    longitude: 80.0815,
    isCompleted: false,
    code: 'Deh-2314-At',
    location: 'Hanwella Town Center (Stop 4)',
  },
  {
    id: 5,
    x: 280,
    y: 205,
    latitude: 6.9271,
    longitude: 79.8612,
    isCompleted: false,
    code: 'Deh-3213-Sw',
    location: 'Carnegie Hall East, Colombo (Stop 5)',
  },
  {
    id: 6,
    x: 185,
    y: 155,
    latitude: 6.9319,
    longitude: 79.8478,
    isCompleted: false,
    code: 'Deh-4213-Tm',
    location: 'Studio 54 North, Fort (Stop 6)',
  },
];

export const DriverMapViewScreen: React.FC<Props> = ({
  language = 'en',
  onNavigateHome,
  onNavigateAccount,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const [pins, setPins] = useState<MapPinData[]>(DEFAULT_PINS);
  const [selectedPin, setSelectedPin] = useState<MapPinData | null>(DEFAULT_PINS[1]);
  const [mapMode, setMapMode] = useState<'vector' | 'google'>('vector');
  const [mapImageLoading, setMapImageLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLivePins = async () => {
      try {
        const summary = await apiService.getBinMonitoringSummary('All');
        if (
          isMounted &&
          summary &&
          summary.data &&
          summary.data.mapPins &&
          summary.data.mapPins.length > 0
        ) {
          const apiBins = summary.data.mapPins.slice(0, 6);
          setPins((prev) =>
            prev.map((pin, index) => {
              const liveBin = apiBins[index];
              if (liveBin) {
                return {
                  ...pin,
                  code: liveBin.binId,
                  location: `${liveBin.location} (${liveBin.capacityStatus})`,
                  fillLevel: liveBin.fillLevel,
                  rawId: liveBin._id,
                  isCompleted:
                    liveBin.capacityStatus === 'Normal' && liveBin.fillLevel === 0,
                };
              }
              return pin;
            })
          );
        }
      } catch {
        // Fallback to default mock pins
      }
    };

    fetchLivePins();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTogglePin = async (id: number) => {
    const targetPin = pins.find((p) => p.id === id);
    if (!targetPin) return;

    const nextState = !targetPin.isCompleted;

    setPins((prev) =>
      prev.map((pin) => {
        if (pin.id === id) {
          const updated = { ...pin, isCompleted: nextState };
          setSelectedPin(updated);
          return updated;
        }
        return pin;
      })
    );

    try {
      await apiService.updateBin(targetPin.rawId || targetPin.code, {
        fillLevel: nextState ? 0 : 85,
        capacityStatus: nextState ? 'Normal' : 'Almost Full',
      });
    } catch {
      // Non-blocking sync
    }
  };

  const handleLaunchGoogleMaps = (pin?: MapPinData) => {
    const target = pin || selectedPin || pins.find((p) => !p.isCompleted) || pins[0];
    if (target) {
      googleMapsService.openNavigation(
        { latitude: target.latitude, longitude: target.longitude },
        target.code
      );
    }
  };

  const handleLaunchFullRouteGoogleMaps = () => {
    const stops = pins.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
    }));
    googleMapsService.openRouteNavigation(stops, 'Bin Matrix Collection Route');
  };

  const mapWidth = SCREEN_WIDTH - 76; // Leave room for right BINS sidebar
  const mapHeight = SCREEN_HEIGHT - insets.top - 70; // Map area above bottom nav

  // Generate Google Static Maps URL
  const googleMapStaticUrl = googleMapsService.getStaticMapUrl({
    center: selectedPin
      ? { latitude: selectedPin.latitude, longitude: selectedPin.longitude }
      : { latitude: 6.865, longitude: 79.88 },
    zoom: 13,
    size: `${Math.round(mapWidth)}x${Math.round(mapHeight)}`,
    markers: pins.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
      label: String(p.id),
      color: p.isCompleted ? 'green' : 'red',
    })),
    pathCoords: pins.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
    })),
  });

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Main Map & Sidebar Canvas */}
      <View style={styles.mainContainer}>
        {/* ==============================================================
            MAP CANVAS: VECTOR VIEW OR GOOGLE MAPS VIEW
           ============================================================== */}
        <View style={[styles.mapCanvas, { width: mapWidth, height: mapHeight }]}>
          {/* Top Controls: Mode Switcher & Quick Google Nav */}
          <View style={styles.mapModeBar}>
            <View style={styles.modeToggleGroup}>
              <TouchableOpacity
                style={[
                  styles.modeToggleBtn,
                  mapMode === 'vector' && styles.modeToggleBtnActive,
                ]}
                onPress={() => setMapMode('vector')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.modeToggleText,
                    mapMode === 'vector' && styles.modeToggleTextActive,
                  ]}
                >
                  Vector
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeToggleBtn,
                  mapMode === 'google' && styles.modeToggleBtnActive,
                ]}
                onPress={() => setMapMode('google')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.modeToggleText,
                    mapMode === 'google' && styles.modeToggleTextActive,
                  ]}
                >
                  Google Map
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.fullRouteQuickBtn}
              onPress={handleLaunchFullRouteGoogleMaps}
              activeOpacity={0.85}
            >
              <GoogleMapNavIcon size={16} />
              <Text style={styles.fullRouteQuickText}>Route</Text>
            </TouchableOpacity>
          </View>

          {mapMode === 'vector' ? (
            /* 1. DETAILED 2D VECTOR CITY STREET MAP */
            <Svg width={mapWidth} height={mapHeight} viewBox="0 0 320 520">
              <Defs>
                <LinearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#CBE5FE" />
                  <Stop offset="100%" stopColor="#BAE6FD" />
                </LinearGradient>
                <LinearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#DCFCE7" />
                  <Stop offset="100%" stopColor="#BBF7D0" />
                </LinearGradient>
              </Defs>

              {/* Base Background: Warm Map Tone */}
              <Rect width="320" height="520" fill="#F4EFEA" />

              {/* Colombo Coastal / Water edge (Top Left) */}
              <Path
                d="M 0 0 L 110 0 C 95 30, 80 70, 75 110 L 0 110 Z"
                fill="url(#waterGrad)"
              />
              <SvgText x="14" y="24" fill="#0284C7" fontSize="8" fontWeight="600">
                Colombo Coastal
              </SvgText>

              {/* Central City Blocks */}
              <Rect
                x="15"
                y="125"
                width="46"
                height="58"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="15"
                y="195"
                width="46"
                height="64"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="15"
                y="270"
                width="46"
                height="70"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="15"
                y="350"
                width="46"
                height="74"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />

              <Rect
                x="72"
                y="125"
                width="54"
                height="58"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="72"
                y="195"
                width="54"
                height="64"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="72"
                y="270"
                width="54"
                height="70"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="72"
                y="350"
                width="54"
                height="74"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />

              <Rect
                x="138"
                y="125"
                width="60"
                height="58"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="138"
                y="195"
                width="60"
                height="64"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="138"
                y="270"
                width="60"
                height="70"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="138"
                y="350"
                width="60"
                height="74"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />

              <Rect
                x="210"
                y="125"
                width="95"
                height="58"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="210"
                y="195"
                width="95"
                height="64"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="210"
                y="270"
                width="95"
                height="70"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />
              <Rect
                x="210"
                y="350"
                width="95"
                height="74"
                rx="4"
                fill="#EDE4DA"
                stroke="#E2D7CB"
                strokeWidth="0.8"
              />

              {/* Urban Parks */}
              <Rect
                x="212"
                y="18"
                width="90"
                height="92"
                rx="6"
                fill="url(#parkGrad)"
                stroke="#86EFAC"
                strokeWidth="1"
              />
              <SvgText
                x="257"
                y="65"
                fill="#15803D"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                Viharamahadevi Park
              </SvgText>

              {/* Main Road Network */}
              <Path d="M 0 118 L 320 118" stroke="#FFFFFF" strokeWidth="10" />
              <Path d="M 0 188 L 320 188" stroke="#FFFFFF" strokeWidth="8" />
              <Path d="M 0 264 L 320 264" stroke="#FFFFFF" strokeWidth="8" />
              <Path d="M 0 344 L 320 344" stroke="#FFFFFF" strokeWidth="8" />
              <Path d="M 0 428 L 320 428" stroke="#FFFFFF" strokeWidth="10" />

              {/* Avenues */}
              <Path d="M 66 0 L 66 520" stroke="#FFFFFF" strokeWidth="9" />
              <Path d="M 132 0 L 132 520" stroke="#FFFFFF" strokeWidth="9" />
              <Path d="M 204 0 L 204 520" stroke="#FFFFFF" strokeWidth="9" />

              {/* Diagonal Galle Road / Marine Drive */}
              <Path
                d="M 35 110 L 240 440"
                stroke="#FDE68A"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Path
                d="M 35 110 L 240 440"
                stroke="#F59E0B"
                strokeWidth="1.2"
                strokeDasharray="6,6"
              />

              {/* Connecting Driver Route Waypoint Line */}
              <Path
                d={`M ${pins[0]?.x} ${pins[0]?.y} L ${pins[1]?.x} ${pins[1]?.y} L ${pins[2]?.x} ${pins[2]?.y} L ${pins[3]?.x} ${pins[3]?.y} L ${pins[4]?.x} ${pins[4]?.y} L ${pins[5]?.x} ${pins[5]?.y}`}
                stroke="#0284C7"
                strokeWidth="3"
                strokeDasharray="5,4"
                fill="none"
              />

              {/* Map Pins */}
              {pins.map((pin) => (
                <MapPinMarker
                  key={pin.id}
                  id={pin.id}
                  x={pin.x}
                  y={pin.y}
                  isCompleted={pin.isCompleted}
                  hasHalo={pin.id === 2}
                  onPress={() => setSelectedPin(pin)}
                />
              ))}
            </Svg>
          ) : (
            /* 2. GOOGLE MAPS SATELLITE / STATIC ROUTE VIEW */
            <View style={styles.googleMapContainer}>
              <Image
                source={{ uri: googleMapStaticUrl }}
                style={{ width: mapWidth, height: mapHeight }}
                resizeMode="cover"
                onLoadStart={() => setMapImageLoading(true)}
                onLoadEnd={() => setMapImageLoading(false)}
              />

              {mapImageLoading && (
                <View style={styles.mapLoadingOverlay}>
                  <ActivityIndicator size="large" color="#16A34A" />
                  <Text style={styles.mapLoadingText}>Loading Google Map...</Text>
                </View>
              )}

              {/* Google Maps Live App Direct Launcher Bar */}
              <View style={styles.googleLiveOverlay}>
                <TouchableOpacity
                  style={styles.openGoogleMapsAppBtn}
                  onPress={() => handleLaunchGoogleMaps(selectedPin || undefined)}
                  activeOpacity={0.85}
                >
                  <GoogleMapNavIcon size={20} />
                  <Text style={styles.openGoogleMapsAppText}>
                    Launch Turn-by-Turn in Google Maps
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Floating Selected Pin Info Card */}
          {selectedPin && (
            <View style={styles.pinInfoToast}>
              <View
                style={[
                  styles.pinStatusDot,
                  { backgroundColor: selectedPin.isCompleted ? '#16A34A' : '#DC2626' },
                ]}
              />
              <View style={styles.pinInfoTextGroup}>
                <Text style={styles.pinInfoCode}>
                  Stop #{selectedPin.id}: {selectedPin.code}
                </Text>
                <Text style={styles.pinInfoLocation} numberOfLines={1}>
                  {selectedPin.location}
                </Text>
              </View>

              {/* Launch Google Maps for this pin */}
              <TouchableOpacity
                style={styles.pinMapBtn}
                onPress={() => handleLaunchGoogleMaps(selectedPin)}
                activeOpacity={0.8}
              >
                <GoogleMapNavIcon size={18} />
              </TouchableOpacity>

              {/* Toggle Done/Collect */}
              <TouchableOpacity
                style={[
                  styles.pinToggleBtn,
                  { backgroundColor: selectedPin.isCompleted ? '#16A34A' : '#DC2626' },
                ]}
                onPress={() => handleTogglePin(selectedPin.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.pinToggleBtnText}>
                  {selectedPin.isCompleted ? '✓ Done' : 'Collect'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ==============================================================
            RIGHT SIDEBAR: "BINS" WITH 6 VERTICAL CIRCULAR PILLS
           ============================================================== */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>{t.binsSidebarTitle || 'BINS'}</Text>

          <View style={styles.binPillList}>
            {pins.map((pin) => {
              const isGreen = pin.isCompleted;

              return (
                <TouchableOpacity
                  key={pin.id}
                  style={[
                    styles.binCircle,
                    isGreen ? styles.binCircleGreen : styles.binCircleRed,
                  ]}
                  onPress={() => handleTogglePin(pin.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.binCircleText,
                      isGreen ? styles.binCircleTextGreen : styles.binCircleTextRed,
                    ]}
                  >
                    {pin.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Bottom Dark Navigation Bar matching Prototype */}
      <View
        style={[
          styles.bottomNavBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={onNavigateHome}
          activeOpacity={0.7}
        >
          <NavHomeIcon size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Route Map Tab (Active) */}
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]} activeOpacity={0.7}>
          <GoogleMapNavIcon size={26} />
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={onNavigateAccount}
          activeOpacity={0.7}
        >
          <NavProfileIcon size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mapCanvas: {
    backgroundColor: '#F4EFEA',
    position: 'relative',
    overflow: 'hidden',
  },
  mapModeBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  modeToggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  modeToggleBtnActive: {
    backgroundColor: '#1E513A',
  },
  modeToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  fullRouteQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    gap: 4,
  },
  fullRouteQuickText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E513A',
  },
  googleMapContainer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 16,
    borderRadius: 12,
  },
  mapLoadingText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#1E513A',
  },
  googleLiveOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 12,
    right: 12,
    alignItems: 'center',
  },
  openGoogleMapsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E513A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  openGoogleMapsAppText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sidebar: {
    width: 76,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 14,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.2,
    marginBottom: 20,
  },
  binPillList: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  binCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  binCircleGreen: {
    backgroundColor: '#A7F3D0',
  },
  binCircleRed: {
    backgroundColor: '#FCA5A5',
  },
  binCircleText: {
    fontSize: 16,
    fontWeight: '800',
  },
  binCircleTextGreen: {
    color: '#065F46',
  },
  binCircleTextRed: {
    color: '#991B1B',
  },
  pinInfoToast: {
    position: 'absolute',
    top: 52,
    left: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pinStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  pinInfoTextGroup: {
    flex: 1,
  },
  pinInfoCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  pinInfoLocation: {
    fontSize: 10,
    color: '#64748B',
  },
  pinMapBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinToggleBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 8,
  },
  pinToggleBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomNavBar: {
    flexDirection: 'row',
    backgroundColor: '#1E513A',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
});

