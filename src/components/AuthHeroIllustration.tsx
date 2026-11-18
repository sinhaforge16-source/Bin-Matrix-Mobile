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
 * Background-less 2D Modern Vector Hero Illustration:
 * Transparent, clean, and minimal.
 * Smart IoT Waste Management Matrix - Mobile app connecting to 3 color-coded
 * smart segregation bins (Plastic, Paper, Organic) with digital telemetry & eco sprout.
 */
export const AuthHeroIllustration: React.FC<Props> = ({
  width = Math.min(SCREEN_WIDTH * 0.78, 290),
  height = Math.min(SCREEN_WIDTH * 0.78, 290) * 0.95,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 290 270" fill="none">
        <Defs>
          {/* Smartphone Screen Gradient */}
          <LinearGradient id="phoneScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F1F5F9" />
          </LinearGradient>

          {/* Green Organic Bin Gradient */}
          <LinearGradient id="greenBin" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#15803D" />
          </LinearGradient>

          {/* Blue Paper Bin Gradient */}
          <LinearGradient id="blueBin" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>

          {/* Orange Plastic Bin Gradient */}
          <LinearGradient id="orangeBin" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FB923C" />
            <Stop offset="100%" stopColor="#EA580C" />
          </LinearGradient>
        </Defs>

        {/* 1. Soft Ambient Sun Halo (Background-less, soft edge glow) */}
        <Circle cx="225" cy="55" r="42" fill="#FEF08A" fillOpacity="0.45" />
        <Circle cx="225" cy="55" r="26" fill="#FDE047" fillOpacity="0.25" />

        {/* ==============================================================
            2. SMARTPHONE (Centerpiece showing Bin Matrix IoT App)
           ============================================================== */}
        <G id="centralSmartphone">
          {/* Phone Shadow */}
          <Ellipse cx="141" cy="205" rx="50" ry="8" fill="#0F172A" fillOpacity="0.08" />

          {/* Phone Outer Frame */}
          <Rect
            x="96"
            y="35"
            width="90"
            height="150"
            rx="16"
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Phone Screen */}
          <Rect x="101" y="40" width="80" height="140" rx="12" fill="url(#phoneScreenGrad)" />

          {/* Speaker & Notch */}
          <Rect x="133" y="43" width="16" height="3" rx="1.5" fill="#475569" />

          {/* App UI on Phone Screen */}
          {/* Top App Bar with Green Pill */}
          <Rect x="110" y="51" width="62" height="7" rx="3.5" fill="#DCFCE7" />
          <Circle cx="116" cy="54.5" r="2" fill="#16A34A" />

          {/* Matrix Circular Gauge / Leaf Graphic */}
          <Circle
            cx="141"
            cy="80"
            r="16"
            fill="#F0FDF4"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeDasharray="65, 30"
          />
          {/* Center Leaf in Gauge */}
          <Path
            d="M 141 72 C 146 72, 149 76, 148 81 C 145 83, 141 85, 137 82 C 137 77, 139 72, 141 72 Z"
            fill="#16A34A"
          />

          {/* Mini Telemetry Status Bars (Plastic, Paper, Organic) */}
          {/* Bar 1: Plastic (Amber) */}
          <Rect x="110" y="105" width="10" height="4" rx="2" fill="#EA580C" />
          <Rect x="124" y="105" width="36" height="4" rx="2" fill="#FED7AA" />
          <Rect x="124" y="105" width="18" height="4" rx="2" fill="#F97316" />

          {/* Bar 2: Paper (Blue) */}
          <Rect x="110" y="115" width="10" height="4" rx="2" fill="#2563EB" />
          <Rect x="124" y="115" width="36" height="4" rx="2" fill="#BFDBFE" />
          <Rect x="124" y="115" width="8" height="4" rx="2" fill="#3B82F6" />

          {/* Bar 3: Organic (Green) */}
          <Rect x="110" y="125" width="10" height="4" rx="2" fill="#16A34A" />
          <Rect x="124" y="125" width="36" height="4" rx="2" fill="#BBF7D0" />
          <Rect x="124" y="125" width="28" height="4" rx="2" fill="#22C55E" />

          {/* Bottom Sync Checkmark Button on Phone Screen */}
          <Rect x="118" y="140" width="46" height="12" rx="6" fill="#2D6A4F" />
          <Path
            d="M 137 146 L 140 149 L 146 143"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* ==============================================================
            3. IOT WIRELESS SIGNALS & CONNECTIVITY MATRIX
           ============================================================== */}
        <G id="iotWaves" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" fill="none">
          {/* Left Signal Arcs towards Plastic bin */}
          <Path d="M 90 87 C 84 81, 84 71, 90 65" strokeOpacity="0.7" />
          <Path d="M 83 92 C 74 82, 74 66, 83 56" strokeOpacity="0.4" />

          {/* Right Signal Arcs towards Paper bin */}
          <Path d="M 192 87 C 198 81, 198 71, 192 65" strokeOpacity="0.7" />
          <Path d="M 199 92 C 208 82, 208 66, 199 56" strokeOpacity="0.4" />
        </G>

        {/* Matrix IoT Data Nodes */}
        <Circle cx="80" cy="110" r="3" fill="#22C55E" />
        <Line x1="83" y1="110" x2="100" y2="115" stroke="#86EFAC" strokeWidth="1.2" strokeDasharray="3, 2" />

        <Circle cx="204" cy="113" r="3" fill="#3B82F6" />
        <Line x1="201" y1="113" x2="186" y2="115" stroke="#93C5FD" strokeWidth="1.2" strokeDasharray="3, 2" />

        {/* ==============================================================
            4. THE 3 SMART SEGREGATION BINS (Background-less & Clean)
           ============================================================== */}
        {/* BIN 1: LEFT - ORANGE PLASTIC BIN */}
        <G id="plasticSmartBin">
          <Ellipse cx="58" cy="225" rx="20" ry="4" fill="#0F172A" fillOpacity="0.12" />
          {/* Bin Body */}
          <Path
            d="M 42 165 L 74 165 L 70 224 L 46 224 Z"
            fill="url(#orangeBin)"
          />
          {/* Bin Lid */}
          <Rect x="39" y="159" width="38" height="7" rx="3.5" fill="#C2410C" />
          <Rect x="52" y="156" width="12" height="3" rx="1.5" fill="#9A3412" />

          {/* Smart Sensor Cap */}
          <Circle cx="58" cy="159" r="2.5" fill="#38BDF8" />

          {/* White Recycle Arrows Logo */}
          <Path
            d="M 58 180 L 62 184 L 59 184 C 59 188, 56 190, 52 190"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M 64 190 L 61 195 L 63 196 C 60 199, 56 198, 54 195"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M 52 194 L 50 188 L 52 189 C 55 186, 60 187, 62 190"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Waste Tag: P */}
          <Circle cx="58" cy="210" r="5" fill="#FFFFFF" fillOpacity="0.25" />
        </G>

        {/* BIN 2: RIGHT - BLUE PAPER BIN */}
        <G id="paperSmartBin">
          <Ellipse cx="228" cy="225" rx="20" ry="4" fill="#0F172A" fillOpacity="0.12" />
          {/* Bin Body */}
          <Path
            d="M 212 165 L 244 165 L 240 224 L 216 224 Z"
            fill="url(#blueBin)"
          />
          {/* Bin Lid */}
          <Rect x="209" y="159" width="38" height="7" rx="3.5" fill="#1E40AF" />
          <Rect x="222" y="156" width="12" height="3" rx="1.5" fill="#1E3A8A" />

          {/* Smart Sensor Cap */}
          <Circle cx="228" cy="159" r="2.5" fill="#38BDF8" />

          {/* White Recycle Arrows Logo */}
          <Path
            d="M 228 180 L 232 184 L 229 184 C 229 188, 226 190, 222 190"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M 234 190 L 231 195 L 233 196 C 230 199, 226 198, 224 195"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M 222 194 L 220 188 L 222 189 C 225 186, 230 187, 232 190"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Waste Tag: P */}
          <Circle cx="228" cy="210" r="5" fill="#FFFFFF" fillOpacity="0.25" />
        </G>

        {/* BIN 3: CENTER FOREGROUND - RICH GREEN ORGANIC BIN */}
        <G id="organicSmartBin">
          <Ellipse cx="142" cy="235" rx="25" ry="5" fill="#0F172A" fillOpacity="0.18" />
          {/* Bin Body */}
          <Path
            d="M 124 162 L 160 162 L 156 232 L 128 232 Z"
            fill="url(#greenBin)"
          />
          {/* Bin Lid */}
          <Rect x="120" y="155" width="44" height="8" rx="4" fill="#14532D" />
          <Rect x="135" y="151" width="14" height="4" rx="2" fill="#052E16" />

          {/* Smart Active Sensor Beacon (Glowing Emerald) */}
          <Circle cx="142" cy="153" r="3" fill="#4ADE80" />
          <Circle cx="142" cy="153" r="1.5" fill="#FFFFFF" />

          {/* White Recycle Arrows Logo */}
          <G transform="translate(133, 178) scale(0.6)" stroke="#FFFFFF" strokeWidth="2.2" fill="none">
            <Path d="M 12 4 L 18 10 L 15 10 C 15 17, 9 20, 3 20" strokeLinecap="round" />
            <Path d="M 23 18 L 19 25 L 21 27 C 16 30, 9 27, 6 22" strokeLinecap="round" />
            <Path d="M 5 24 L 2 16 L 5 17 C 10 13, 17 14, 21 19" strokeLinecap="round" />
          </G>

          {/* Live Fill Level Indicator Bar */}
          <Rect x="132" y="212" width="20" height="4" rx="2" fill="#14532D" />
          <Rect x="132" y="212" width="14" height="4" rx="2" fill="#86EFAC" />
        </G>

        {/* ==============================================================
            5. SUSTAINABLE LIVING ECO SPROUT & FOLIAGE
           ============================================================== */}
        <G id="ecoSprout">
          {/* Sprout Stem */}
          <Path
            d="M 88 226 Q 84 200 92 185"
            stroke="#15803D"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Leaf */}
          <Path
            d="M 92 185 C 80 185, 74 195, 78 205 C 86 205, 92 195, 92 185 Z"
            fill="#22C55E"
          />
          {/* Right Leaf */}
          <Path
            d="M 92 185 C 102 180, 106 188, 102 198 C 96 198, 92 190, 92 185 Z"
            fill="#4ADE80"
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
