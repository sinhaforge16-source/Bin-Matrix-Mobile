import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  G,
  Path,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import {
  NavHomeIcon,
  GoogleMapNavIcon,
  NavProfileIcon,
} from '../components/CommonIcons';
import { Language, TRANSLATIONS } from '../utils/translations';
import { apiService } from '../services/apiService';
import {
  RoadCoord,
  DEFAULT_ROAD_COORDINATES,
  DEFAULT_ROUTE_STATS,
  fetchFastestRoadRoute,
} from '../services/roadRoutingService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TILE_SIZE = 256;

// Mercator Projection Math for Google Maps
function lngToPixel(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * Math.pow(2, zoom) * TILE_SIZE;
}

function latToPixel(lat: number, zoom: number): number {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const clampedSin = Math.min(Math.max(sinLat, -0.9999), 0.9999);
  return (
    (0.5 - Math.log((1 + clampedSin) / (1 - clampedSin)) / (4 * Math.PI)) *
    Math.pow(2, zoom) *
    TILE_SIZE
  );
}

function lon2tile(lon: number, zoom: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat: number, zoom: number): number {
  const sin = Math.sin((lat * Math.PI) / 180);
  const clampedSin = Math.min(Math.max(sin, -0.9999), 0.9999);
  return Math.floor(
    (0.5 - Math.log((1 + clampedSin) / (1 - clampedSin)) / (4 * Math.PI)) *
      Math.pow(2, zoom)
  );
}

const MapTileImage: React.FC<{
  left: number;
  top: number;
  url: string;
  fallbackUrl: string;
}> = React.memo(({ left, top, url, fallbackUrl }) => {
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  return (
    <Image
      source={{
        uri: currentUrl,
        headers: { 'User-Agent': 'Mozilla/5.0 (Mobile; rv:40.0) Gecko/40.0 Firefox/40.0' },
      }}
      style={{
        position: 'absolute',
        left,
        top,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
      resizeMode="cover"
      onError={() => {
        if (currentUrl !== fallbackUrl) {
          setCurrentUrl(fallbackUrl);
        }
      }}
    />
  );
});

interface MapPinData {
  id: number;
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

// Default stop coordinates centered around Galle Road / Dehiwala - Mount Lavinia, Sri Lanka
const DEFAULT_PINS: MapPinData[] = [
  {
    id: 1,
    latitude: 6.8732,
    longitude: 79.8598,
    isCompleted: true,
    code: 'Deh-2213-Ai',
    location: 'Tamil, Sangam Institute, Wellawatte (Stop 1)',
  },
  {
    id: 2,
    latitude: 6.8521,
    longitude: 79.8642,
    isCompleted: true,
    code: 'Deh-2233-Gn',
    location: 'Galle Rd, Dehiwala-Mount Lavinia (Stop 2)',
  },
  {
    id: 3,
    latitude: 6.8385,
    longitude: 79.8631,
    isCompleted: false,
    code: 'Deh-2243-Fa',
    location: 'Mount Lavinia Beach Rd (Stop 3)',
  },
  {
    id: 4,
    latitude: 6.8450,
    longitude: 79.8780,
    isCompleted: false,
    code: 'Deh-2314-At',
    location: 'Nedimala / Kawdana Rd (Stop 4)',
  },
  {
    id: 5,
    latitude: 6.8610,
    longitude: 79.8720,
    isCompleted: false,
    code: 'Deh-3213-Sw',
    location: 'Kalubowila Hospital Rd (Stop 5)',
  },
  {
    id: 6,
    latitude: 6.8710,
    longitude: 79.8680,
    isCompleted: false,
    code: 'Deh-4213-Tm',
    location: 'Dutugemunu St, Pamankada (Stop 6)',
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

  // Embedded Google Map View State
  const [zoom, setZoom] = useState<number>(14);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [centerCoord, setCenterCoord] = useState<{ lat: number; lng: number }>({
    lat: 6.8540,
    lng: 79.8660,
  });
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fastest Road Route Geometry & Stats
  const [roadCoords, setRoadCoords] = useState<RoadCoord[]>(DEFAULT_ROAD_COORDINATES);
  const [routeStats, setRouteStats] = useState<{ distanceKm: number; durationMinutes: number }>(
    DEFAULT_ROUTE_STATS
  );

  const mapWidth = SCREEN_WIDTH - 76; // Leave room for right BINS sidebar
  const mapHeight = SCREEN_HEIGHT - insets.top - 70; // Map canvas height

  // Pan Responder for Touch Dragging the Google Map
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3,
      onPanResponderGrant: () => {
        panStartRef.current = { ...panOffset };
      },
      onPanResponderMove: (_, gestureState) => {
        setPanOffset({
          x: panStartRef.current.x + gestureState.dx,
          y: panStartRef.current.y + gestureState.dy,
        });
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // Sync Live Pins with Backend API
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
        // Graceful fallback to default mock pins
      }
    };

    fetchLivePins();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate & Refresh Fastest Driving Route along real streets & roads
  useEffect(() => {
    let isMounted = true;
    const updateRoadRoute = async () => {
      const waypoints = pins.map((p) => ({ lat: p.latitude, lng: p.longitude }));
      const result = await fetchFastestRoadRoute(waypoints);
      if (isMounted && result && result.coordinates.length > 0) {
        setRoadCoords(result.coordinates);
        setRouteStats({
          distanceKm: result.distanceKm,
          durationMinutes: result.durationMinutes,
        });
      }
    };

    updateRoadRoute();
    return () => {
      isMounted = false;
    };
  }, [pins]);

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

  // Center Google Map directly on a specific pin
  const handleFocusPin = (pin: MapPinData) => {
    setSelectedPin(pin);
    setCenterCoord({ lat: pin.latitude, lng: pin.longitude });
    setPanOffset({ x: 0, y: 0 });
  };

  // Recenter Google Map to entire route overview
  const handleRecenterRoute = () => {
    setCenterCoord({ lat: 6.8540, lng: 79.8660 });
    setPanOffset({ x: 0, y: 0 });
    setZoom(14);
  };

  // Calculate Visible Google Maps Tiles dynamically for the current viewport
  const visibleTiles = useMemo(() => {
    const centerTileX = lon2tile(centerCoord.lng, zoom);
    const centerTileY = lat2tile(centerCoord.lat, zoom);

    const centerPixelX = lngToPixel(centerCoord.lng, zoom);
    const centerPixelY = latToPixel(centerCoord.lat, zoom);

    const tiles: {
      x: number;
      y: number;
      left: number;
      top: number;
      url: string;
      fallbackUrl: string;
      key: string;
    }[] = [];
    const layerParam = mapType === 'satellite' ? 'y' : 'm';

    // 4x4 tile grid around viewport center
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const tx = centerTileX + dx;
        const ty = centerTileY + dy;
        const tileOriginX = tx * TILE_SIZE;
        const tileOriginY = ty * TILE_SIZE;

        const left = mapWidth / 2 + (tileOriginX - centerPixelX) + panOffset.x;
        const top = mapHeight / 2 + (tileOriginY - centerPixelY) + panOffset.y;

        // Only include tiles reasonably near visible screen
        if (
          left + TILE_SIZE >= -100 &&
          left <= mapWidth + 100 &&
          top + TILE_SIZE >= -100 &&
          top <= mapHeight + 100
        ) {
          tiles.push({
            x: tx,
            y: ty,
            left,
            top,
            url: `https://mt1.google.com/vt/lyrs=${layerParam}&x=${tx}&y=${ty}&z=${zoom}`,
            fallbackUrl: `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`,
            key: `${zoom}-${tx}-${ty}-${mapType}`,
          });
        }
      }
    }
    return tiles;
  }, [centerCoord, zoom, panOffset, mapWidth, mapHeight, mapType]);

  // Compute Screen Coordinates for Pins & Route Polyline
  const pinScreenCoords = useMemo(() => {
    const centerPixelX = lngToPixel(centerCoord.lng, zoom);
    const centerPixelY = latToPixel(centerCoord.lat, zoom);

    return pins.map((p) => {
      const px = lngToPixel(p.longitude, zoom);
      const py = latToPixel(p.latitude, zoom);
      const screenX = mapWidth / 2 + (px - centerPixelX) + panOffset.x;
      const screenY = mapHeight / 2 + (py - centerPixelY) + panOffset.y;
      return {
        ...p,
        screenX,
        screenY,
      };
    });
  }, [pins, centerCoord, zoom, panOffset, mapWidth, mapHeight]);

  // Compute Screen Coordinates for the Road Driving Polyline following real roads & streets
  const roadScreenCoords = useMemo(() => {
    const centerPixelX = lngToPixel(centerCoord.lng, zoom);
    const centerPixelY = latToPixel(centerCoord.lat, zoom);

    return roadCoords.map((coord) => {
      const px = lngToPixel(coord.lng, zoom);
      const py = latToPixel(coord.lat, zoom);
      return {
        x: mapWidth / 2 + (px - centerPixelX) + panOffset.x,
        y: mapHeight / 2 + (py - centerPixelY) + panOffset.y,
      };
    });
  }, [roadCoords, centerCoord, zoom, panOffset, mapWidth, mapHeight]);

  // SVG Polyline Path following real road networks
  const polylinePath = useMemo(() => {
    if (roadScreenCoords.length === 0) return '';
    return roadScreenCoords
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
  }, [roadScreenCoords]);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Main Container: Embedded Google Map + Right Sidebar */}
      <View style={styles.mainContainer}>
        {/* ==============================================================
            EMBEDDED INTERACTIVE GOOGLE MAP CANVAS
           ============================================================== */}
        <View
          style={[styles.mapCanvas, { width: mapWidth, height: mapHeight }]}
          {...panResponder.panHandlers}
        >
          {/* Layer 1: Real Google Map Raster Tiles with Auto Fallback */}
          <View style={StyleSheet.absoluteFill}>
            {visibleTiles.map((tile) => (
              <MapTileImage
                key={tile.key}
                left={tile.left}
                top={tile.top}
                url={tile.url}
                fallbackUrl={tile.fallbackUrl}
              />
            ))}
          </View>

          {/* Layer 2: SVG Fastest Road Driving Polyline */}
          <Svg
            style={StyleSheet.absoluteFill}
            width={mapWidth}
            height={mapHeight}
            pointerEvents="none"
          >
            {/* Road Route Casing / Outer Shadow */}
            <Path
              d={polylinePath}
              stroke="#1E3A8A"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={0.35}
            />
            {/* Google Maps Fastest Driving Road Polyline */}
            <Path
              d={polylinePath}
              stroke="#2563EB"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Center Turn Guidance Dashes */}
            <Path
              d={polylinePath}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="6,8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={0.65}
            />
          </Svg>

          {/* Layer 3: Interactive Numbered Map Pins */}
          {pinScreenCoords.map((pin) => {
            const isSelected = selectedPin?.id === pin.id;
            const pinColor = pin.isCompleted ? '#16A34A' : '#DC2626';

            return (
              <TouchableOpacity
                key={pin.id}
                style={[
                  styles.pinMarkerWrapper,
                  {
                    left: pin.screenX - 16,
                    top: pin.screenY - 32,
                  },
                ]}
                onPress={() => handleFocusPin(pin)}
                activeOpacity={0.85}
              >
                {/* Active Halo */}
                {isSelected && (
                  <View
                    style={[
                      styles.pinHalo,
                      { borderColor: pinColor, backgroundColor: `${pinColor}22` },
                    ]}
                  />
                )}

                {/* Teardrop Pin Marker SVG */}
                <Svg width={32} height={36} viewBox="0 0 32 36">
                  {/* Pin Drop Shadow */}
                  <Circle cx="16" cy="33" r="5" fill="#0F172A" fillOpacity="0.28" />

                  {/* Teardrop Body */}
                  <Path
                    d="M 16 2 C 8.5 2 3 7.5 3 15 C 3 22.5 13 30.5 16 34 C 19 30.5 29 22.5 29 15 C 29 7.5 23.5 2 16 2 Z"
                    fill={pinColor}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />

                  {/* White Center Circle */}
                  <Circle cx="16" cy="14" r="7.5" fill="#FFFFFF" />

                  {/* Stop Number */}
                  <SvgText
                    x="16"
                    y="17"
                    fill={pinColor}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {pin.id}
                  </SvgText>
                </Svg>
              </TouchableOpacity>
            );
          })}

          {/* Layer 4: Google Watermark Branding (Bottom Left) */}
          <View style={styles.googleBrandBadge} pointerEvents="none">
            <Text style={styles.googleBrandText}>Google</Text>
          </View>

          {/* Layer 5: Map On-Screen Controls (Zoom & Layer Toggle) */}
          <View style={styles.mapControlsColumn}>
            {/* Zoom In */}
            <TouchableOpacity
              style={styles.mapControlBtn}
              onPress={() => setZoom((z) => Math.min(z + 1, 16))}
              activeOpacity={0.8}
            >
              <Text style={styles.mapControlBtnText}>+</Text>
            </TouchableOpacity>

            {/* Zoom Out */}
            <TouchableOpacity
              style={styles.mapControlBtn}
              onPress={() => setZoom((z) => Math.max(z - 1, 12))}
              activeOpacity={0.8}
            >
              <Text style={styles.mapControlBtnText}>−</Text>
            </TouchableOpacity>

            {/* Satellite / Road Toggle */}
            <TouchableOpacity
              style={[
                styles.mapControlBtn,
                mapType === 'satellite' && styles.mapControlBtnActive,
              ]}
              onPress={() =>
                setMapType((m) => (m === 'roadmap' ? 'satellite' : 'roadmap'))
              }
              activeOpacity={0.8}
            >
              <Text style={styles.mapLayerBtnText}>
                {mapType === 'roadmap' ? '🛰️' : '🗺️'}
              </Text>
            </TouchableOpacity>

            {/* Recenter Route */}
            <TouchableOpacity
              style={styles.mapControlBtn}
              onPress={handleRecenterRoute}
              activeOpacity={0.8}
            >
              <Text style={styles.mapLayerBtnText}>🎯</Text>
            </TouchableOpacity>
          </View>

          {/* Layer 6: Floating Selected Pin / Stop Card */}
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

              {/* Focus / Center Stop on this Google Map */}
              <TouchableOpacity
                style={styles.pinMapBtn}
                onPress={() => handleFocusPin(selectedPin)}
                activeOpacity={0.8}
              >
                <GoogleMapNavIcon size={18} />
              </TouchableOpacity>

              {/* Toggle Done / Collect */}
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

          {/* Layer 7: Fastest Road Route Telemetry Badge */}
          <View style={styles.routeBadge}>
            <View style={styles.routeBadgeDot} />
            <Text style={styles.routeBadgeText}>
              🛣️ {language === 'si' ? 'වේගවත්ම මාර්ගය (පාරවල් ඔස්සේ)' : 'Fastest Route (Via Roads)'}: {routeStats.distanceKm} km • {routeStats.durationMinutes} min
            </Text>
          </View>
        </View>

        {/* ==============================================================
            RIGHT SIDEBAR: "BINS" WITH 6 VERTICAL CIRCULAR PILLS
           ============================================================== */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>{t.binsSidebarTitle || 'BINS'}</Text>

          <View style={styles.binPillList}>
            {pins.map((pin) => {
              const isGreen = pin.isCompleted;
              const isCurrent = selectedPin?.id === pin.id;

              return (
                <TouchableOpacity
                  key={pin.id}
                  style={[
                    styles.binCircle,
                    isGreen ? styles.binCircleGreen : styles.binCircleRed,
                    isCurrent && styles.binCircleActive,
                  ]}
                  onPress={() => handleFocusPin(pin)}
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
    backgroundColor: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
  },
  pinMarkerWrapper: {
    position: 'absolute',
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  pinHalo: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  googleBrandBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  googleBrandText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  mapControlsColumn: {
    position: 'absolute',
    right: 12,
    bottom: 20,
    gap: 8,
    zIndex: 8,
  },
  mapControlBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapControlBtnActive: {
    backgroundColor: '#1E513A',
  },
  mapControlBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
  },
  mapLayerBtnText: {
    fontSize: 16,
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
  binCircleActive: {
    borderWidth: 2.5,
    borderColor: '#1E513A',
    transform: [{ scale: 1.08 }],
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
    top: 14,
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
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
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
  routeBadge: {
    position: 'absolute',
    top: 70,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 9,
  },
  routeBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3B82F6',
  },
  routeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
