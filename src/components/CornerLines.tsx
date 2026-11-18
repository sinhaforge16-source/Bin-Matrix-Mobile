import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, G } from 'react-native-svg';

/**
 * Modern geometric corner lines watermark seen in the Bin Matrix UI mockups
 */
export const CornerLines: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top Right Geometric Rays */}
      <View style={styles.topRight}>
        <Svg width={140} height={140} viewBox="0 0 140 140">
          <G stroke="#2D6A4F" strokeWidth="1.2" strokeOpacity="0.25">
            <Line x1="140" y1="0" x2="30" y2="140" />
            <Line x1="140" y1="0" x2="60" y2="140" />
            <Line x1="140" y1="0" x2="90" y2="140" />
            <Line x1="140" y1="0" x2="120" y2="140" />
            <Line x1="140" y1="0" x2="0" y2="110" />
            <Line x1="140" y1="0" x2="0" y2="80" />
            <Line x1="140" y1="0" x2="0" y2="50" />
          </G>
        </Svg>
      </View>

      {/* Bottom Left Geometric Rays */}
      <View style={styles.bottomLeft}>
        <Svg width={140} height={140} viewBox="0 0 140 140">
          <G stroke="#2D6A4F" strokeWidth="1.2" strokeOpacity="0.22">
            <Line x1="0" y1="140" x2="110" y2="0" />
            <Line x1="0" y1="140" x2="80" y2="0" />
            <Line x1="0" y1="140" x2="50" y2="0" />
            <Line x1="0" y1="140" x2="20" y2="0" />
            <Line x1="0" y1="140" x2="140" y2="30" />
            <Line x1="0" y1="140" x2="140" y2="60" />
            <Line x1="0" y1="140" x2="140" y2="90" />
          </G>
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
