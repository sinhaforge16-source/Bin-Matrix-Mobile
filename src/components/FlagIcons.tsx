import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, G, Circle, ClipPath, Defs } from 'react-native-svg';

interface FlagProps {
  width?: number;
  height?: number;
}

/**
 * 2D Vector Sri Lanka Flag
 */
export const SriLankaFlag: React.FC<FlagProps> = ({ width = 36, height = 24 }) => {
  return (
    <View style={[styles.flagContainer, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 72 48">
        <Defs>
          <ClipPath id="slBorderClip">
            <Rect x="0" y="0" width="72" height="48" rx="4" />
          </ClipPath>
        </Defs>

        <G clipPath="url(#slBorderClip)">
          {/* Yellow Border Background */}
          <Rect x="0" y="0" width="72" height="48" fill="#F8BC18" />

          {/* Green Vertical Stripe */}
          <Rect x="5" y="5" width="8" height="38" fill="#005A36" />

          {/* Orange Vertical Stripe */}
          <Rect x="13.5" y="5" width="8" height="38" fill="#FF7900" />

          {/* Maroon / Crimson Rectangle */}
          <Rect x="23" y="5" width="44" height="38" fill="#8D153A" />

          {/* 4 Bo leaves in the corners */}
          <Circle cx="26" cy="8" r="1.8" fill="#F8BC18" />
          <Circle cx="64" cy="8" r="1.8" fill="#F8BC18" />
          <Circle cx="26" cy="40" r="1.8" fill="#F8BC18" />
          <Circle cx="64" cy="40" r="1.8" fill="#F8BC18" />

          {/* Stylized Golden Sinhalese Lion with Sword */}
          <G fill="#F8BC18">
            {/* Lion Mane & Head */}
            <Circle cx="50" cy="18" r="4.5" />
            <Circle cx="53" cy="16" r="2.5" />
            {/* Eye */}
            <Circle cx="51.5" cy="17" r="0.8" fill="#8D153A" />
            {/* Body */}
            <Rect x="37" y="19" width="14" height="11" rx="4" />
            {/* Legs */}
            <Rect x="35" y="27" width="4" height="9" rx="2" />
            <Rect x="41" y="28" width="3.5" height="8" rx="1.5" />
            <Rect x="48" y="27" width="4" height="9" rx="2" />
            {/* Raised Forepaw holding Sword */}
            <Path d="M48 20 L55 17 L57 21 Z" />
            {/* Sword */}
            <Rect x="54" y="11" width="2" height="15" transform="rotate(-30 55 18)" />
            {/* Tail */}
            <Path
              d="M36 21 C33 17 35 12 39 12 C38 15 38 18 36 21"
              stroke="#F8BC18"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </G>
        </G>
      </Svg>
    </View>
  );
};

/**
 * 2D Vector United Kingdom (Union Jack) Flag
 */
export const UKFlag: React.FC<FlagProps> = ({ width = 36, height = 24 }) => {
  return (
    <View style={[styles.flagContainer, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 60 36">
        <Defs>
          <ClipPath id="ukBorderClip">
            <Rect x="0" y="0" width="60" height="36" rx="4" />
          </ClipPath>
        </Defs>

        <G clipPath="url(#ukBorderClip)">
          {/* Blue Background */}
          <Rect width="60" height="36" fill="#012169" />

          {/* White Saltire (Diagonals) */}
          <Path d="M0,0 L60,36 M60,0 L0,36" stroke="#FFFFFF" strokeWidth="7" />

          {/* Red Saltire (Patrick Cross) */}
          <Path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="3.5" />

          {/* St George's White Cross border */}
          <Rect x="24" y="0" width="12" height="36" fill="#FFFFFF" />
          <Rect x="0" y="12" width="60" height="12" fill="#FFFFFF" />

          {/* St George's Red Cross */}
          <Rect x="26.5" y="0" width="7" height="36" fill="#C8102E" />
          <Rect x="0" y="14.5" width="60" height="7" fill="#C8102E" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  flagContainer: {
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
