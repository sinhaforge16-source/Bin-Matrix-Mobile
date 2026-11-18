import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Ellipse,
  Line,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  width?: number;
  height?: number;
}

/**
 * 2D Modern Vector Hero Illustration for Driver Portal:
 * Background-less, transparent, clean, and minimal.
 * Perfectly matches the visual language, palette, and style of AuthHeroIllustration.
 * Features:
 * - Ambient warm sun halo in the top right
 * - Modern 2D Waste Collection Truck with hydraulic compactor & cab
 * - Green Smart Segregation Bin with recycling icon
 * - GPS route navigation waypoint & digital telemetry signals
 * - Eco sprout & soft ground contact shadows
 */
export const DriverHeroIllustration: React.FC<Props> = ({
  width = Math.min(SCREEN_WIDTH * 0.78, 290),
  height = Math.min(SCREEN_WIDTH * 0.78, 290) * 0.95,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 290 270" fill="none">
        <Defs>
          {/* Truck Body Metallic Gradient */}
          <LinearGradient id="truckBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#334155" />
            <Stop offset="100%" stopColor="#1E293B" />
          </LinearGradient>

          {/* Truck Cab Gradient */}
          <LinearGradient id="truckCabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>

          {/* Windshield Gradient */}
          <LinearGradient id="windshieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E0F2FE" />
            <Stop offset="100%" stopColor="#BAE6FD" />
          </LinearGradient>

          {/* Green Smart Bin Gradient */}
          <LinearGradient id="driverGreenBin" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#15803D" />
          </LinearGradient>

          {/* Wheel Rim Gradient */}
          <LinearGradient id="wheelRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#94A3B8" />
            <Stop offset="100%" stopColor="#475569" />
          </LinearGradient>
        </Defs>

        {/* 1. Soft Ambient Sun Halo (Exact match with AuthHeroIllustration) */}
        <Circle cx="225" cy="55" r="42" fill="#FEF08A" fillOpacity="0.45" />
        <Circle cx="225" cy="55" r="26" fill="#FDE047" fillOpacity="0.25" />

        {/* 2. Soft Ground Contact Shadows */}
        <Ellipse cx="178" cy="216" rx="85" ry="9" fill="#0F172A" fillOpacity="0.10" />
        <Ellipse cx="72" cy="218" rx="28" ry="7" fill="#0F172A" fillOpacity="0.12" />

        {/* ==============================================================
            3. GPS ROUTE TELEMETRY & WAYPOINTS (Background Digital Layer)
           ============================================================== */}
        <G id="telemetryLayer">
          {/* Dotted GPS Route Line */}
          <Path
            d="M 50 100 C 90 70, 140 110, 195 85"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeDasharray="4, 4"
            fill="none"
          />

          {/* GPS Pin Waypoint 1 (Start Stop) */}
          <Circle cx="50" cy="100" r="5" fill="#3B82F6" />
          <Circle cx="50" cy="100" r="10" stroke="#3B82F6" strokeWidth="1.2" strokeOpacity="0.4" />

          {/* GPS Pin Waypoint 2 (Destination / Active Truck Location) */}
          <G transform="translate(195, 75)">
            <Path
              d="M 0 -12 C -7 -12, -12 -7, -12 0 C -12 6, 0 16, 0 16 C 0 16, 12 6, 12 0 C 12 -7, 7 -12, 0 -12 Z"
              fill="#16A34A"
            />
            <Circle cx="0" cy="-2" r="4.5" fill="#FFFFFF" />
          </G>

          {/* Signal Wave Radiations */}
          <Path
            d="M 125 105 C 130 98, 130 90, 125 83"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 132 109 C 140 98, 140 85, 132 74"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.6"
            fill="none"
          />
        </G>

        {/* ==============================================================
            4. MODERN 2D RECYCLING TRUCK
           ============================================================== */}
        <G id="wasteCollectionTruck">
          {/* Compactor Body (Dark Slate Navy Container) */}
          <Rect
            x="96"
            y="114"
            width="88"
            height="76"
            rx="6"
            fill="url(#truckBodyGrad)"
            stroke="#475569"
            strokeWidth="1.2"
          />

          {/* Vertical Rib Panels on Container */}
          <Rect x="108" y="122" width="10" height="58" rx="2" fill="#0F172A" fillOpacity="0.35" />
          <Rect x="126" y="122" width="10" height="58" rx="2" fill="#0F172A" fillOpacity="0.35" />
          <Rect x="144" y="122" width="10" height="58" rx="2" fill="#0F172A" fillOpacity="0.35" />
          <Rect x="162" y="122" width="10" height="58" rx="2" fill="#0F172A" fillOpacity="0.35" />

          {/* Clean White Recycling Logo on Truck Cargo Body */}
          <G transform="translate(138, 142) scale(0.65)">
            <Path
              d="M 0 -12 L 8 -12 L 4 -4 Z"
              fill="#22C55E"
            />
            <Path
              d="M -3 -10 C -12 -10, -14 -2, -10 6 L -6 4 C -9 -2, -8 -6, -2 -6 Z"
              fill="#22C55E"
            />
            <Path
              d="M 10 3 L 14 10 L 6 9 Z"
              fill="#22C55E"
            />
            <Path
              d="M 8 0 C 12 6, 10 14, 2 15 L 2 11 C 7 10, 8 5, 5 1 Z"
              fill="#22C55E"
            />
          </G>

          {/* Rear Hydraulic Tailgate & Loader Mechanism */}
          <Rect x="90" y="126" width="7" height="56" rx="2" fill="#475569" />
          <Rect x="86" y="162" width="6" height="18" rx="1.5" fill="#64748B" />

          {/* Truck Cab (Amber-Yellow Modern Front) */}
          <Path
            d="M 184 134 L 218 134 C 224 134, 230 140, 235 148 L 244 164 C 246 168, 246 172, 246 176 L 246 190 L 184 190 Z"
            fill="url(#truckCabGrad)"
            stroke="#B45309"
            strokeWidth="1.2"
          />

          {/* Large Panoramic Windshield */}
          <Path
            d="M 194 138 L 216 138 C 221 138, 226 142, 229 148 L 235 160 L 194 160 Z"
            fill="url(#windshieldGrad)"
          />
          {/* Windshield Reflection */}
          <Path
            d="M 200 140 L 206 140 L 197 158 L 193 158 Z"
            fill="#FFFFFF"
            fillOpacity="0.75"
          />

          {/* Cab Side Door Outline & Handle */}
          <Line x1="194" y1="162" x2="194" y2="188" stroke="#B45309" strokeWidth="1.2" />
          <Rect x="198" y="166" width="6" height="2" rx="1" fill="#78350F" />

          {/* Front Bumper & Headlight */}
          <Rect x="238" y="178" width="12" height="12" rx="3" fill="#334155" />
          <Rect x="242" y="180" width="7" height="5" rx="1.5" fill="#FEF08A" />

          {/* Underbody Chassis */}
          <Rect x="98" y="188" width="144" height="6" fill="#0F172A" />

          {/* ==============================================================
              TRUCK WHEELS (Dual Rear + Front Steering)
             ============================================================== */}
          {/* Rear Wheel 1 */}
          <Circle cx="120" cy="196" r="16" fill="#0F172A" />
          <Circle cx="120" cy="196" r="10" fill="url(#wheelRimGrad)" />
          <Circle cx="120" cy="196" r="4" fill="#E2E8F0" />

          {/* Rear Wheel 2 */}
          <Circle cx="156" cy="196" r="16" fill="#0F172A" />
          <Circle cx="156" cy="196" r="10" fill="url(#wheelRimGrad)" />
          <Circle cx="156" cy="196" r="4" fill="#E2E8F0" />

          {/* Front Wheel */}
          <Circle cx="220" cy="196" r="16" fill="#0F172A" />
          <Circle cx="220" cy="196" r="10" fill="url(#wheelRimGrad)" />
          <Circle cx="220" cy="196" r="4" fill="#E2E8F0" />
        </G>

        {/* ==============================================================
            5. SMART RECYCLING BIN (Foreground Left)
           ============================================================== */}
        <G id="foregroundSmartBin">
          {/* Bin Body (Tapered 2D Modern Green Container) */}
          <Path
            d="M 52 142 L 86 142 L 82 210 L 56 210 Z"
            fill="url(#driverGreenBin)"
          />

          {/* Specular Highlight Strip */}
          <Path
            d="M 58 142 L 63 142 L 61 210 L 57 210 Z"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />

          {/* Top Lid */}
          <Rect x="48" y="137" width="42" height="6" rx="3" fill="#14532D" />
          {/* Lid Handle */}
          <Rect x="64" y="134" width="10" height="3" rx="1.5" fill="#14532D" />

          {/* Universal 3-Arrow Recycling Icon on Green Bin */}
          <G transform="translate(69, 172) scale(0.65)">
            <Path
              d="M 0 -10 L 6 -10 L 3 -3 Z"
              fill="#FFFFFF"
            />
            <Path
              d="M -2 -8 C -9 -8, -11 -2, -8 4 L -5 3 C -7 -2, -6 -5, -1 -5 Z"
              fill="#FFFFFF"
            />
            <Path
              d="M 8 2 L 11 8 L 4 7 Z"
              fill="#FFFFFF"
            />
            <Path
              d="M 6 0 C 10 5, 8 11, 2 12 L 2 9 C 6 8, 7 4, 4 1 Z"
              fill="#FFFFFF"
            />
          </G>

          {/* Level Status Indicator Pill on Bin */}
          <Rect x="60" y="196" width="18" height="4" rx="2" fill="#86EFAC" />
        </G>

        {/* ==============================================================
            6. ECO SPROUT & LEAVES (Matching AuthHeroIllustration)
           ============================================================== */}
        <G id="ecoSprout">
          {/* Sprout Stem */}
          <Path
            d="M 44 214 Q 40 198, 48 184"
            stroke="#15803D"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Leaf */}
          <Path
            d="M 48 184 C 36 182, 32 192, 42 198 C 45 194, 47 188, 48 184 Z"
            fill="#22C55E"
          />
          {/* Right Leaf */}
          <Path
            d="M 48 184 C 58 178, 64 186, 54 194 C 51 190, 49 186, 48 184 Z"
            fill="#16A34A"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
