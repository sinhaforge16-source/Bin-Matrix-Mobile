import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapPinData {
  id: number;
  x: number;
  y: number;
  isCompleted: boolean;
  code: string;
  location: string;
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
      {/* Translucent circular radius halo (e.g. for active stop 2) */}
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

export const DriverMapViewScreen: React.FC<Props> = ({
  language = 'en',
  onNavigateHome,
  onNavigateAccount,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];

  // Coordinates calibrated to fill map area while leaving sidebar space
  const [pins, setPins] = useState<MapPinData[]>([
    {
      id: 1,
      x: 180,
      y: 430,
      isCompleted: true,
      code: 'BIN-22546',
      location: 'Tamil, Sangam Institute, Wellawatte (Stop 1)',
    },
    {
      id: 2,
      x: 75,
      y: 360,
      isCompleted: true,
      code: 'BIN-22547',
      location: 'Midtown Center, 8th Ave (Stop 2)',
    },
    {
      id: 3,
      x: 48,
      y: 285,
      isCompleted: false,
      code: 'BIN-22548',
      location: 'Gershwin Theatre, Broadway (Stop 3)',
    },
    {
      id: 4,
      x: 120,
      y: 175,
      isCompleted: false,
      code: 'BIN-22549',
      location: 'W 52nd St, Broadway (Stop 4)',
    },
    {
      id: 5,
      x: 280,
      y: 205,
      isCompleted: false,
      code: 'BIN-22550',
      location: 'Carnegie Hall East (Stop 5)',
    },
    {
      id: 6,
      x: 185,
      y: 155,
      isCompleted: false,
      code: 'BIN-22551',
      location: 'Studio 54 North (Stop 6)',
    },
  ]);

  const [selectedPin, setSelectedPin] = useState<MapPinData | null>(pins[1]);

  const handleTogglePin = (id: number) => {
    setPins((prev) =>
      prev.map((pin) => {
        if (pin.id === id) {
          const nextState = !pin.isCompleted;
          setSelectedPin({ ...pin, isCompleted: nextState });
          return { ...pin, isCompleted: nextState };
        }
        return pin;
      })
    );
  };

  const mapWidth = SCREEN_WIDTH - 76; // Leave room for right BINS sidebar
  const mapHeight = SCREEN_HEIGHT - insets.top - 70; // Map area above bottom nav

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Main Map & Sidebar Canvas */}
      <View style={styles.mainContainer}>
        {/* ==============================================================
            1. DETAILED 2D VECTOR CITY STREET MAP
           ============================================================== */}
        <View style={[styles.mapCanvas, { width: mapWidth, height: mapHeight }]}>
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

            {/* Hudson River / Water edge (Top Left) */}
            <Path
              d="M 0 0 L 110 0 C 95 30, 80 70, 75 110 L 0 110 Z"
              fill="url(#waterGrad)"
            />
            <SvgText x="14" y="24" fill="#0284C7" fontSize="8" fontWeight="600">
              Hudson New York
            </SvgText>

            {/* Central City Blocks (Beige & Warm Gray Building footprints) */}
            {/* Grid Block Column 1 */}
            <Rect x="15" y="125" width="46" height="58" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="15" y="195" width="46" height="64" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="15" y="270" width="46" height="70" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="15" y="350" width="46" height="74" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />

            {/* Grid Block Column 2 */}
            <Rect x="72" y="125" width="54" height="58" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="72" y="195" width="54" height="64" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="72" y="270" width="54" height="70" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="72" y="350" width="54" height="74" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />

            {/* Grid Block Column 3 */}
            <Rect x="138" y="125" width="60" height="58" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="138" y="195" width="60" height="64" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="138" y="270" width="60" height="70" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="138" y="350" width="60" height="74" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />

            {/* Grid Block Column 4 */}
            <Rect x="210" y="125" width="95" height="58" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="210" y="195" width="95" height="64" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="210" y="270" width="95" height="70" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />
            <Rect x="210" y="350" width="95" height="74" rx="4" fill="#EDE4DA" stroke="#E2D7CB" strokeWidth="0.8" />

            {/* Parks / Greenery Zones */}
            <Rect
              x="170"
              y="30"
              width="145"
              height="80"
              rx="6"
              fill="url(#parkGrad)"
            />
            {/* Bryant Park / Lower Greenery */}
            <Rect x="142" y="440" width="160" height="55" rx="5" fill="url(#parkGrad)" />
            <SvgText x="160" y="465" fill="#15803D" fontSize="8" fontWeight="600">
              Bryant Park / MetLife
            </SvgText>

            {/* Primary Diagonal Avenue (Broadway / Diagonal thoroughfare) */}
            <Path
              d="M 120 40 L 40 480"
              stroke="#FFFFFF"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <Path
              d="M 120 40 L 40 480"
              stroke="#D1C7BA"
              strokeWidth="1"
              strokeDasharray="4, 4"
            />

            {/* City Street Labels matching prototype */}
            <SvgText x="78" y="160" fill="#78716C" fontSize="7" fontWeight="500">
              W 53rd St
            </SvgText>
            <SvgText x="18" y="185" fill="#B45309" fontSize="8" fontWeight="bold">
              HELL'S KITCHEN
            </SvgText>
            <SvgText x="135" y="172" fill="#78716C" fontSize="7" fontWeight="500">
              Studio 54
            </SvgText>
            <SvgText x="200" y="152" fill="#78716C" fontSize="7" fontWeight="500">
              Carnegie Hall
            </SvgText>
            <SvgText x="90" y="235" fill="#78716C" fontSize="7" fontWeight="500">
              Broadway Theatre
            </SvgText>
            <SvgText x="72" y="280" fill="#78716C" fontSize="7" fontWeight="500">
              Gershwin Theatre
            </SvgText>
            <SvgText x="100" y="340" fill="#78716C" fontSize="7" fontWeight="500">
              Times Square
            </SvgText>
            <SvgText x="182" y="380" fill="#78716C" fontSize="7" fontWeight="500">
              The Town Hall
            </SvgText>
            <SvgText x="145" y="420" fill="#1E293B" fontSize="9" fontWeight="800">
              MIDTOWN
            </SvgText>

            {/* ==============================================================
                2. THICK BLACK ROUTE POLYLINE (Exact connection from prototype)
                Route: Stop 1 -> Stop 2 -> Stop 3 -> Stop 4 -> Stop 6 -> Stop 5
               ============================================================== */}
            <Path
              d="M 180 430 L 75 360 L 26 385 L 48 285 L 120 175 L 185 155 L 280 205"
              stroke="#0F172A"
              strokeWidth="4.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />

            {/* Route Inner Accent Line */}
            <Path
              d="M 180 430 L 75 360 L 26 385 L 48 285 L 120 175 L 185 155 L 280 205"
              stroke="#334155"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />

            {/* ==============================================================
                3. CURRENT TRUCK GPS LOCATION MARKER (Cyan Pin & Blue Pulse)
               ============================================================== */}
            <G transform="translate(162, 332)">
              {/* Pulsing circular aura */}
              <Circle cx="0" cy="0" r="14" fill="#0284C7" fillOpacity="0.18" />
              {/* Blue Center Location Dot */}
              <Circle cx="0" cy="0" r="4.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Cyan Location Pin */}
              <Path
                d="M 0 -18 C -6 -18, -10 -14, -10 -8 C -10 -1, 0 8, 0 8 C 0 8, 10 -1, 10 -8 C 10 -14, 6 -18, 0 -18 Z"
                fill="#06B6D4"
                stroke="#FFFFFF"
                strokeWidth="1.2"
              />
              <Circle cx="0" cy="-8" r="3" fill="#FFFFFF" />
            </G>

            {/* ==============================================================
                4. MAP PINS (1 to 6)
               ============================================================== */}
            {pins.map((pin) => (
              <MapPinMarker
                key={pin.id}
                x={pin.x}
                y={pin.y}
                id={pin.id}
                isCompleted={pin.isCompleted}
                hasHalo={pin.id === 2}
                onPress={() => handleTogglePin(pin.id)}
              />
            ))}
          </Svg>

          {/* Quick Info Toast for Selected Pin */}
          {selectedPin && (
            <View style={styles.pinInfoToast}>
              <View
                style={[
                  styles.pinStatusDot,
                  { backgroundColor: selectedPin.isCompleted ? '#16A34A' : '#DC2626' },
                ]}
              />
              <View style={styles.pinInfoTextGroup}>
                <Text style={styles.pinInfoCode}>{selectedPin.code}</Text>
                <Text style={styles.pinInfoLocation} numberOfLines={1}>
                  {selectedPin.location}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.pinToggleBtn,
                  { backgroundColor: selectedPin.isCompleted ? '#16A34A' : '#DC2626' },
                ]}
                onPress={() => handleTogglePin(selectedPin.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.pinToggleBtnText}>
                  {selectedPin.isCompleted ? '✔' : t.driverStopOk}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ==============================================================
            5. RIGHT VERTICAL SIDEBAR: "BINS" WITH CIRCULAR PILLS 1 - 6
           ============================================================== */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>{t.binsSidebarTitle}</Text>

          <View style={styles.binPillList}>
            {pins.map((pin) => {
              const isDone = pin.isCompleted;

              return (
                <TouchableOpacity
                  key={pin.id}
                  style={[
                    styles.binCircle,
                    isDone ? styles.binCircleGreen : styles.binCircleRed,
                  ]}
                  onPress={() => handleTogglePin(pin.id)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.binCircleText,
                      isDone ? styles.binCircleTextGreen : styles.binCircleTextRed,
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

      {/* ==============================================================
          6. BOTTOM NAVIGATION BAR (Matching Prototype)
         ============================================================== */}
      <View
        style={[
          styles.bottomNavBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={onNavigateHome}
          activeOpacity={0.7}
        >
          <NavHomeIcon size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Tab 2: Map View (Active) */}
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          activeOpacity={0.7}
        >
          <GoogleMapNavIcon size={26} />
        </TouchableOpacity>

        {/* Tab 3: Driver Account */}
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
    backgroundColor: '#F4EFEA',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  sidebar: {
    width: 72,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#A7F3D0', // Light green matching prototype
  },
  binCircleRed: {
    backgroundColor: '#FCA5A5', // Soft salmon red matching prototype
  },
  binCircleText: {
    fontSize: 16,
    fontWeight: '800',
  },
  binCircleTextGreen: {
    color: '#065F46', // Dark green text
  },
  binCircleTextRed: {
    color: '#991B1B', // Dark red text
  },
  pinInfoToast: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
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
