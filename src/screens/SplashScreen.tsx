import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GarbageTruckIllustration } from '../components/GarbageTruckIllustration';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const insets = useSafeAreaInsets();
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  // Animated values for loading pill slider and fade-in
  const [slideAnim] = useState(() => new Animated.Value(0));
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.95));

  useEffect(() => {
    // Initial entrance fade & scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Looping pill indicator animation (smooth back and forth)
    const pillAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    pillAnimation.start();

    // Auto transition after 2.8 seconds
    const timer = setTimeout(() => {
      onFinishRef.current?.();
    }, 2800);

    return () => {
      pillAnimation.stop();
      clearTimeout(timer);
    };
  }, [fadeAnim, scaleAnim, slideAnim]);

  // Interpolate pill translation (capsule width 64, pill width 26 -> distance 32)
  const pillTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 33],
  });

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Top subtle bar */}
      <View style={styles.topBar}>
        <Text style={styles.topStatusText}>Loading</Text>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 2D Vector Illustration Centerpiece */}
        <View style={styles.illustrationCard}>
          <GarbageTruckIllustration />
        </View>

        {/* Brand Title */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>BIN MATRIX</Text>

          {/* Interactive / Animated Loading Pill */}
          <View style={styles.pillTrack}>
            <Animated.View
              style={[
                styles.pillThumb,
                {
                  transform: [{ translateX: pillTranslateX }],
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>

      {/* Optional skip / tap hint */}
      {onFinish && (
        <TouchableOpacity
          style={styles.skipArea}
          onPress={() => onFinishRef.current?.()}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Tap anywhere to skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  topStatusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#2E7D32',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  pillTrack: {
    width: 66,
    height: 18,
    backgroundColor: '#2E7D32',
    borderRadius: 9,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  pillThumb: {
    width: 28,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  skipArea: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
