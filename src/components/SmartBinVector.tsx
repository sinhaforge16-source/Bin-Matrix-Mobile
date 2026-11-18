import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, {
  G,
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  Line,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type WasteCategory = 'plastic' | 'paper' | 'organic';

interface Props {
  category: WasteCategory;
  fillPercentage: number;
  localizedTitle?: string;
  width?: number;
  height?: number;
}

const CATEGORY_CONFIG: Record<
  WasteCategory,
  {
    defaultTitle: string;
    brandColor: string;
    accentFill: string;
    levelColor: string;
  }
> = {
  plastic: {
    defaultTitle: 'PLASTIC',
    brandColor: '#EA580C', // Vibrant Orange
    accentFill: '#FB923C',
    levelColor: '#16A34A', // Green indicator for 50%
  },
  paper: {
    defaultTitle: 'PAPER',
    brandColor: '#2563EB', // Royal Blue
    accentFill: '#60A5FA',
    levelColor: '#2563EB', // Blue indicator for 20%
  },
  organic: {
    defaultTitle: 'ORGANIC',
    brandColor: '#15803D', // Eco Green
    accentFill: '#4ADE80',
    levelColor: '#DC2626', // Red warning indicator for 80%
  },
};

/**
 * Single Canonical Recycle Arrow Ribbon Segment
 * Rotated at 0°, 120°, and 240° for 100% mathematically perfect symmetry.
 */
const RecycleArrowUnit: React.FC<{ color: string }> = ({ color }) => (
  <G>
    {/* Curved Ribbon Body */}
    <Path
      d="M -16 -24 C -6 -32, 14 -32, 24 -24 L 20 -18 C 12 -24, -2 -24, -10 -19 Z"
      fill={color}
    />
    {/* Folded Edge */}
    <Path
      d="M -16 -24 L -10 -19 L -13 -13 L -21 -18 Z"
      fill={color}
      fillOpacity="0.85"
    />
    {/* Arrowhead */}
    <Path
      d="M 16 -30 L 32 -21 L 22 -12 Z"
      fill={color}
    />
  </G>
);

/**
 * 2D Clean Vector Smart Bin Container with Perfect Recycle Icon & Smooth Level Animation
 */
export const SmartBinVector: React.FC<Props> = ({
  category,
  fillPercentage,
  localizedTitle,
  width = Math.min(SCREEN_WIDTH * 0.58, 220),
  height = Math.min(SCREEN_WIDTH * 0.58, 220) * 1.35,
}) => {
  const config = CATEGORY_CONFIG[category];
  const displayTitle = localizedTitle || config.defaultTitle;

  // Animated Level & Fade Transition
  const animatedProgress = useRef(new Animated.Value(fillPercentage)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Smooth gliding animation for level transition
    Animated.timing(animatedProgress, {
      toValue: fillPercentage,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Subtle smooth pulse on category switch
    fadeAnim.setValue(0.85);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fillPercentage, category, animatedProgress, fadeAnim]);

  // Geometric coordinates for level calculation (base: 225, top: 68)
  const binTopY = 68;
  const binBaseY = 225;
  const currentLevelY = binBaseY - ((binBaseY - binTopY) * (fillPercentage / 100));

  return (
    <Animated.View style={[styles.container, { width, height, opacity: fadeAnim }]}>
      <Svg width={width} height={height} viewBox="0 0 240 270" fill="none">
        <Defs>
          {/* Modern Flat 2D Metallic Cylinder Gradient */}
          <LinearGradient id="bin2DMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#E2E8F0" />
            <Stop offset="25%" stopColor="#FFFFFF" />
            <Stop offset="55%" stopColor="#E2E8F0" />
            <Stop offset="85%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>

          {/* Top Outer Rim Gradient */}
          <LinearGradient id="rim2DGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="35%" stopColor="#FFFFFF" />
            <Stop offset="70%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#64748B" />
          </LinearGradient>

          {/* Deep Inner Bin Opening */}
          <LinearGradient id="innerDepth2D" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="100%" stopColor="#0F172A" />
          </LinearGradient>

          {/* Soft Ground Contact Shadow */}
          <LinearGradient id="softGroundShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#0F172A" stopOpacity="0.0" />
            <Stop offset="25%" stopColor="#0F172A" stopOpacity="0.22" />
            <Stop offset="75%" stopColor="#0F172A" stopOpacity="0.22" />
            <Stop offset="100%" stopColor="#0F172A" stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* 1. Soft Ground Shadow */}
        <Ellipse cx="120" cy="248" rx="68" ry="9" fill="url(#softGroundShadow)" />

        {/* 2. Main 2D Tapered Vector Bin Body */}
        <Path
          d="M 46 54 L 194 54 L 178 232 L 62 232 Z"
          fill="url(#bin2DMetal)"
          stroke="#94A3B8"
          strokeWidth="1.2"
        />

        {/* Crisp Modern 2D Specular Vertical Light Band */}
        <Path d="M 72 54 L 86 54 L 80 232 L 68 232 Z" fill="#FFFFFF" fillOpacity="0.6" />
        <Path d="M 158 54 L 166 54 L 155 232 L 149 232 Z" fill="#64748B" fillOpacity="0.12" />

        {/* 3. Base Foot Stand */}
        <Ellipse cx="120" cy="232" rx="58" ry="9" fill="#475569" />
        <Ellipse cx="120" cy="231" rx="56" ry="7.5" fill="url(#rim2DGrad)" />
        <Ellipse cx="120" cy="233" rx="54" ry="5.5" fill="#334155" />

        {/* 4. Top Rolled Rim & Deep Opening */}
        <Ellipse cx="120" cy="54" rx="74" ry="14" fill="url(#rim2DGrad)" stroke="#64748B" strokeWidth="1" />
        <Ellipse cx="120" cy="54" rx="66" ry="11" fill="url(#innerDepth2D)" />
        {/* Top Rim Highlight */}
        <Path
          d="M 52 52 C 72 42, 168 42, 188 52"
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* 5. Waste Category Title (English or Sinhala) */}
        <SvgText
          x="120"
          y="95"
          fill={config.brandColor}
          fontSize={displayTitle.length > 7 ? '14' : '17'}
          fontWeight="800"
          textAnchor="middle"
          letterSpacing={displayTitle.length > 7 ? '0.5' : '2'}
        >
          {displayTitle}
        </SvgText>

        {/* ==============================================================
            6. PERFECT 3-ARROW MÖBIUS RECYCLING ICON (Sharp, Clean, 2D)
           ============================================================== */}
        <G id="cleanRecycleIcon" transform="translate(120, 142)">
          {/* Arrow 1: Top Right */}
          <G transform="rotate(0)">
            <RecycleArrowUnit color={config.brandColor} />
          </G>

          {/* Arrow 2: Bottom */}
          <G transform="rotate(120)">
            <RecycleArrowUnit color={config.brandColor} />
          </G>

          {/* Arrow 3: Top Left */}
          <G transform="rotate(240)">
            <RecycleArrowUnit color={config.brandColor} />
          </G>
        </G>

        {/* 7. Level Measurement Guide Line & Indicator Dot */}
        <Line
          x1="184"
          y1={currentLevelY}
          x2="236"
          y2={currentLevelY}
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeDasharray="4, 3"
        />
        <Circle cx="184" cy={currentLevelY} r="3.5" fill={config.levelColor} />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
