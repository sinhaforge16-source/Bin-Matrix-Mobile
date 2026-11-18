import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CornerLines } from '../components/CornerLines';
import { DriverHeroIllustration } from '../components/DriverHeroIllustration';
import { Language, TRANSLATIONS } from '../utils/translations';

interface Props {
  language?: Language;
  onLogin: () => void;
  onStartRoute: () => void;
  onBack?: () => void;
}

export const DriverAuthHomeScreen: React.FC<Props> = ({
  language = 'en',
  onLogin,
  onStartRoute,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      <CornerLines />

      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}
          <Text style={styles.brandTitle}>{t.brandName}</Text>
          <View style={styles.spacer} />
        </View>

        {/* Center 2D Vector Illustration */}
        <View style={styles.centerSection}>
          <DriverHeroIllustration />
        </View>

        {/* Action Buttons Matching User Screen Layout */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={onLogin}
            activeOpacity={0.88}
          >
            <Text style={styles.btnPrimaryText}>{t.driverSignInBtn}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={onStartRoute}
            activeOpacity={0.88}
          >
            <Text style={styles.btnSecondaryText}>{t.driverStartRouteBtn}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D6A4F',
    letterSpacing: 1.5,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: '#1E293B',
    lineHeight: 30,
    fontWeight: '600',
  },
  spacer: {
    width: 38,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSection: {
    paddingBottom: 8,
    gap: 14,
  },
  btnPrimary: {
    backgroundColor: '#1E513A',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E513A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#94A3B8',
  },
  btnSecondaryText: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
