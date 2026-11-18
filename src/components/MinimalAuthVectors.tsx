import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Ellipse,
  G,
} from 'react-native-svg';

interface VectorProps {
  size?: number;
}

/**
 * Clean & Minimal Background-less Vector Graphic for Login Screen
 * Features a modern smart bin with a glowing digital key & secure shield.
 */
export const LoginMinimalVector: React.FC<VectorProps> = ({ size = 95 }) => {
  const width = size * 1.35;
  const height = size;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 135 100" fill="none">
        <Defs>
          {/* Subtle Metallic Gradient */}
          <LinearGradient id="binMetallic" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#94A3B8" />
            <Stop offset="30%" stopColor="#F1F5F9" />
            <Stop offset="70%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#64748B" />
          </LinearGradient>

          {/* Eco Green Gradient */}
          <LinearGradient id="ecoShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#15803D" />
          </LinearGradient>
        </Defs>

        {/* 1. Soft Ground Shadow */}
        <Ellipse cx="50" cy="94" rx="30" ry="4" fill="#0F172A" fillOpacity="0.1" />

        {/* 2. Sleek Minimal Smart Bin Container (Transparent / Background-less) */}
        {/* Tapered Body */}
        <Path
          d="M 28 28 L 72 28 L 66 92 L 34 92 Z"
          fill="url(#binMetallic)"
        />

        {/* Subtle Body Highlight */}
        <Path d="M 38 28 L 46 28 L 42 92 L 36 92 Z" fill="#FFFFFF" fillOpacity="0.5" />

        {/* Bin Top Rolled Rim */}
        <Ellipse cx="50" cy="28" rx="23" ry="5.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        <Ellipse cx="50" cy="28" rx="20" ry="4" fill="#334155" />

        {/* Bin Bottom Stand */}
        <Ellipse cx="50" cy="92" rx="16" ry="3.5" fill="#64748B" />

        {/* Mini Smart Status Light Bar */}
        <Rect x="44" y="38" width="12" height="3" rx="1.5" fill="#22C55E" />

        {/* Minimal Recycling Arrows on Bin */}
        <G transform="translate(42, 50) scale(0.42)" stroke="#2D6A4F" strokeWidth="2.2" fill="none">
          <Path d="M 12 4 L 18 10 L 15 10 C 15 17, 9 20, 3 20" strokeLinecap="round" />
          <Path d="M 23 18 L 19 25 L 21 27 C 16 30, 9 27, 6 22" strokeLinecap="round" />
          <Path d="M 5 24 L 2 16 L 5 17 C 10 13, 17 14, 21 19" strokeLinecap="round" />
        </G>

        {/* 3. Floating Digital Key / Security Badge on the Right */}
        <G id="secureBadge">
          {/* Badge Glow & Shadow */}
          <Circle cx="88" cy="50" r="22" fill="#DCFCE7" fillOpacity="0.5" />
          <Circle cx="88" cy="50" r="18" fill="url(#ecoShieldGrad)" />

          {/* Key / Lock Icon inside Badge */}
          <Circle cx="88" cy="45" r="4.5" fill="#FFFFFF" />
          <Circle cx="88" cy="45" r="2.2" fill="#15803D" />
          {/* Key Stem */}
          <Path
            d="M 88 49.5 L 88 58 M 88 54 L 92 54 M 88 57 L 91 57"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </G>

        {/* 4. Subtle IoT Connection Waves */}
        <Path
          d="M 74 44 C 77 47, 77 53, 74 56"
          stroke="#10B981"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 70 40 C 75 45, 75 55, 70 60"
          stroke="#86EFAC"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

/**
 * Clean & Minimal Background-less Vector Graphic for Driver Login Screen
 * Matches LoginMinimalVector precisely:
 * Features a modern 2D recycling truck with a glowing eco steering wheel badge.
 */
export const DriverLoginMinimalVector: React.FC<VectorProps> = ({ size = 95 }) => {
  const width = size * 1.35;
  const height = size;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 135 100" fill="none">
        <Defs>
          {/* Subtle Metallic Gradient */}
          <LinearGradient id="drvMetallic" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#94A3B8" />
            <Stop offset="30%" stopColor="#F1F5F9" />
            <Stop offset="70%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#64748B" />
          </LinearGradient>

          {/* Truck Body Slate Gradient */}
          <LinearGradient id="drvTruckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#334155" />
            <Stop offset="100%" stopColor="#1E293B" />
          </LinearGradient>

          {/* Truck Cab Amber Gradient */}
          <LinearGradient id="drvCabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>

          {/* Eco Green Shield Gradient */}
          <LinearGradient id="drvEcoShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#15803D" />
          </LinearGradient>
        </Defs>

        {/* 1. Soft Ground Shadow */}
        <Ellipse cx="54" cy="94" rx="38" ry="4" fill="#0F172A" fillOpacity="0.1" />

        {/* 2. Sleek Modern 2D Mini Recycling Truck */}
        <G id="miniRecyclingTruck">
          {/* Compactor Body */}
          <Rect
            x="14"
            y="42"
            width="44"
            height="44"
            rx="4"
            fill="url(#drvTruckGrad)"
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Vertical Rib Panels */}
          <Rect x="20" y="47" width="5" height="34" rx="1.5" fill="#0F172A" fillOpacity="0.3" />
          <Rect x="29" y="47" width="5" height="34" rx="1.5" fill="#0F172A" fillOpacity="0.3" />
          <Rect x="38" y="47" width="5" height="34" rx="1.5" fill="#0F172A" fillOpacity="0.3" />
          <Rect x="47" y="47" width="5" height="34" rx="1.5" fill="#0F172A" fillOpacity="0.3" />

          {/* Truck Cab (Amber-Gold) */}
          <Path
            d="M 58 52 L 74 52 C 78 52, 81 55, 84 60 L 89 71 C 90 73, 90 76, 90 78 L 90 86 L 58 86 Z"
            fill="url(#drvCabGrad)"
            stroke="#B45309"
            strokeWidth="1"
          />

          {/* Windshield */}
          <Path
            d="M 64 55 L 74 55 C 77 55, 79 58, 81 61 L 84 68 L 64 68 Z"
            fill="#E0F2FE"
          />
          {/* Windshield Specular Reflection */}
          <Path
            d="M 68 56 L 71 56 L 67 67 L 65 67 Z"
            fill="#FFFFFF"
            fillOpacity="0.8"
          />

          {/* Bumper */}
          <Rect x="86" y="80" width="6" height="6" rx="2" fill="#334155" />
          <Rect x="88" y="81" width="3" height="3" rx="1" fill="#FEF08A" />

          {/* Underbody Chassis */}
          <Rect x="16" y="85" width="74" height="4" fill="#0F172A" />

          {/* Wheels */}
          {/* Rear Wheel 1 */}
          <Circle cx="26" cy="90" r="9" fill="#0F172A" />
          <Circle cx="26" cy="90" r="5.5" fill="#64748B" />
          <Circle cx="26" cy="90" r="2" fill="#E2E8F0" />

          {/* Rear Wheel 2 */}
          <Circle cx="46" cy="90" r="9" fill="#0F172A" />
          <Circle cx="46" cy="90" r="5.5" fill="#64748B" />
          <Circle cx="46" cy="90" r="2" fill="#E2E8F0" />

          {/* Front Wheel */}
          <Circle cx="78" cy="90" r="9" fill="#0F172A" />
          <Circle cx="78" cy="90" r="5.5" fill="#64748B" />
          <Circle cx="78" cy="90" r="2" fill="#E2E8F0" />
        </G>

        {/* 3. Floating Glowing Badge on the Right (Steering Wheel / Driver Key) */}
        <G id="driverSecureBadge">
          {/* Outer Aura Glow */}
          <Circle cx="96" cy="46" r="22" fill="#DCFCE7" fillOpacity="0.5" />
          {/* Green Shield Circle */}
          <Circle cx="96" cy="46" r="18" fill="url(#drvEcoShieldGrad)" />

          {/* Steering Wheel Icon inside Badge */}
          {/* Outer Wheel Ring */}
          <Circle cx="96" cy="46" r="10" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
          {/* Center Hub */}
          <Circle cx="96" cy="46" r="3" fill="#FFFFFF" />
          {/* Spokes (3-Spoke Wheel) */}
          <Path d="M 96 39 L 96 43" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <Path d="M 90 51 L 93.5 48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <Path d="M 102 51 L 98.5 48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </G>

        {/* 4. Subtle IoT Wireless Signal Arcs */}
        <Path
          d="M 80 38 C 84 42, 84 48, 80 52"
          stroke="#10B981"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

/**
 * Clean & Minimal Background-less Vector Graphic for Create Account Screen
 * Features a modern smart bin with a user profile identity badge & eco leaf.
 */
export const RegisterMinimalVector: React.FC<VectorProps> = ({ size = 95 }) => {
  const width = size * 1.35;
  const height = size;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 135 100" fill="none">
        <Defs>
          {/* Subtle Metallic Gradient */}
          <LinearGradient id="regBinMetallic" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#94A3B8" />
            <Stop offset="30%" stopColor="#F1F5F9" />
            <Stop offset="70%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#64748B" />
          </LinearGradient>

          {/* Eco Green Gradient */}
          <LinearGradient id="regGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#15803D" />
          </LinearGradient>
        </Defs>

        {/* 1. Soft Ground Shadow */}
        <Ellipse cx="50" cy="94" rx="30" ry="4" fill="#0F172A" fillOpacity="0.1" />

        {/* 2. Sleek Minimal Smart Bin Container (Transparent / Background-less) */}
        {/* Tapered Body */}
        <Path
          d="M 28 28 L 72 28 L 66 92 L 34 92 Z"
          fill="url(#regBinMetallic)"
        />

        {/* Subtle Body Highlight */}
        <Path d="M 38 28 L 46 28 L 42 92 L 36 92 Z" fill="#FFFFFF" fillOpacity="0.5" />

        {/* Bin Top Rolled Rim */}
        <Ellipse cx="50" cy="28" rx="23" ry="5.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        <Ellipse cx="50" cy="28" rx="20" ry="4" fill="#334155" />

        {/* Bin Bottom Stand */}
        <Ellipse cx="50" cy="92" rx="16" ry="3.5" fill="#64748B" />

        {/* Mini Smart Status Light Bar */}
        <Rect x="44" y="38" width="12" height="3" rx="1.5" fill="#22C55E" />

        {/* Minimal Recycling Arrows on Bin */}
        <G transform="translate(42, 50) scale(0.42)" stroke="#2D6A4F" strokeWidth="2.2" fill="none">
          <Path d="M 12 4 L 18 10 L 15 10 C 15 17, 9 20, 3 20" strokeLinecap="round" />
          <Path d="M 23 18 L 19 25 L 21 27 C 16 30, 9 27, 6 22" strokeLinecap="round" />
          <Path d="M 5 24 L 2 16 L 5 17 C 10 13, 17 14, 21 19" strokeLinecap="round" />
        </G>

        {/* 3. Floating User Onboarding Badge / Plus Sign */}
        <G id="userBadge">
          {/* Badge Glow & Shadow */}
          <Circle cx="88" cy="50" r="22" fill="#DCFCE7" fillOpacity="0.5" />
          <Circle cx="88" cy="50" r="18" fill="url(#regGreenGrad)" />

          {/* User Avatar Silhouette */}
          <Circle cx="88" cy="45" r="4.5" fill="#FFFFFF" />
          <Path
            d="M 80 58 C 80 54, 83 52, 88 52 C 93 52, 96 54, 96 58"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mini Plus Icon Badge */}
          <Circle cx="98" cy="38" r="6" fill="#16A34A" stroke="#FFFFFF" strokeWidth="1.5" />
          <Path d="M 98 35.5 V 40.5 M 95.5 38 H 100.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* 4. Sustainable Sprout Leaf */}
        <Path
          d="M 28 80 Q 20 65 24 55 C 28 60, 32 68, 28 80 Z"
          fill="#4ADE80"
        />
        <Path
          d="M 28 80 Q 30 70 38 68 C 36 74, 32 78, 28 80 Z"
          fill="#15803D"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
});
