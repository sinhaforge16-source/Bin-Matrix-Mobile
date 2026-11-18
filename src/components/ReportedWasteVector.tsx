import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  width?: number;
  height?: number;
}

/**
 * 2D Vector representation of reported overflowing street waste:
 * Multiple segregated trash sacks, cardboard box, and clean vector textures.
 */
export const ReportedWasteVector: React.FC<Props> = ({
  width = Math.min(SCREEN_WIDTH * 0.58, 210),
  height = Math.min(SCREEN_WIDTH * 0.58, 210) * 0.72,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 210 150" fill="none">
        <Defs>
          <ClipPath id="wastePhotoClip">
            <Rect x="0" y="0" width="210" height="150" rx="14" />
          </ClipPath>

          {/* Wall Gradient */}
          <LinearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>

          {/* Ground Asphalt Gradient */}
          <LinearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#64748B" />
            <Stop offset="100%" stopColor="#475569" />
          </LinearGradient>

          {/* White Trash Bag Gradient */}
          <LinearGradient id="bagWhite" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#CBD5E1" />
          </LinearGradient>

          {/* Beige Sack Gradient */}
          <LinearGradient id="bagBeige" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE68A" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>

          {/* Cardboard Box Gradient */}
          <LinearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#D97706" />
            <Stop offset="100%" stopColor="#92400E" />
          </LinearGradient>
        </Defs>

        <G clipPath="url(#wastePhotoClip)">
          {/* Concrete Wall in background */}
          <Rect x="0" y="0" width="210" height="90" fill="url(#wallGrad)" />
          {/* Wall texture cracks / seams */}
          <Path d="M 0 45 L 210 45" stroke="#64748B" strokeWidth="1" strokeOpacity="0.4" />
          <Path d="M 120 0 L 120 45" stroke="#64748B" strokeWidth="1" strokeOpacity="0.3" />
          <Path d="M 60 45 L 60 90" stroke="#64748B" strokeWidth="1" strokeOpacity="0.3" />
          <Path d="M 170 45 L 170 90" stroke="#64748B" strokeWidth="1" strokeOpacity="0.3" />

          {/* Ground Street / Pavement */}
          <Rect x="0" y="90" width="210" height="60" fill="url(#groundGrad)" />
          {/* Curb line */}
          <Rect x="0" y="87" width="210" height="5" fill="#334155" />

          {/* Waste Pile Shadows */}
          <Path
            d="M 15 138 C 50 144, 160 144, 195 138 C 170 128, 40 128, 15 138 Z"
            fill="#0F172A"
            fillOpacity="0.4"
          />

          {/* Trash Bags & Sacks Pile */}
          {/* Bag 1: White tied sack on left */}
          <Path
            d="M 25 105 C 20 85, 45 75, 60 85 C 75 95, 70 125, 55 132 C 35 132, 28 120, 25 105 Z"
            fill="url(#bagWhite)"
            stroke="#94A3B8"
            strokeWidth="1"
          />
          {/* Tie Knot */}
          <Circle cx="44" cy="80" r="3" fill="#64748B" />

          {/* Bag 2: Large Beige Sack center-back */}
          <Path
            d="M 60 95 C 60 70, 105 60, 125 75 C 145 90, 140 128, 120 135 C 90 135, 60 120, 60 95 Z"
            fill="url(#bagBeige)"
            stroke="#B45309"
            strokeWidth="1"
          />
          <Path d="M 85 90 Q 95 110 85 130" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
          <Path d="M 105 85 Q 115 105 105 128" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />

          {/* Bag 3: Blue / Grey Plastic Bag on Right */}
          <Path
            d="M 125 102 C 125 80, 165 78, 180 92 C 195 106, 185 134, 160 136 C 140 136, 125 125, 125 102 Z"
            fill="#64748B"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Cardboard Box in front center */}
          <Path
            d="M 75 115 L 115 110 L 120 138 L 78 142 Z"
            fill="url(#boxGrad)"
            stroke="#78350F"
            strokeWidth="1"
          />
          {/* Box flaps */}
          <Path d="M 75 115 L 95 120 L 115 110" stroke="#FDE68A" strokeWidth="1" fill="none" />

          {/* Red Plastic Bucket / Discarded Can */}
          <Path d="M 145 122 L 158 120 L 155 136 L 143 136 Z" fill="#EF4444" />
          <Ellipse cx="151.5" cy="121" rx="6.5" ry="2" fill="#F87171" />

          {/* Green bottle / plastic waste on pavement */}
          <Rect x="42" y="132" width="16" height="5" rx="2.5" fill="#16A34A" transform="rotate(-15 42 132)" />

          {/* Small GPS / Camera reported badge indicator overlay */}
          <Rect x="8" y="8" width="80" height="20" rx="10" fill="rgba(15, 23, 42, 0.75)" />
          <Circle cx="18" cy="18" r="3.5" fill="#EF4444" />
          <Circle cx="18" cy="18" r="1.5" fill="#FFFFFF" />
          <Rect x="28" y="16" width="50" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.8" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
});
