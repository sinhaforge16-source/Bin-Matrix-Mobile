import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CornerLines } from '../components/CornerLines';
import { AuthHeroIllustration } from '../components/AuthHeroIllustration';
import { Language, TRANSLATIONS } from '../utils/translations';

interface Props {
  language?: Language;
  onRegister: () => void;
  onLogin: () => void;
  onBack?: () => void;
}

export const AuthHomeScreen: React.FC<Props> = ({
  language = 'en',
  onRegister,
  onLogin,
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

        {/* Center Vector Illustration */}
        <View style={styles.centerSection}>
          <AuthHeroIllustration />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.btnCreateAccount}
            onPress={onRegister}
            activeOpacity={0.88}
          >
            <Text style={styles.btnCreateAccountText}>{t.createAccount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnLogin}
            onPress={onLogin}
            activeOpacity={0.88}
          >
            <Text style={styles.btnLoginText}>{t.login}</Text>
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
    letterSpacing: 1.2,
    color: '#2E7D32',
    textAlign: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#334155',
    lineHeight: 28,
    marginTop: -2,
  },
  spacer: {
    width: 36,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSection: {
    gap: 16,
    paddingBottom: 8,
  },
  btnCreateAccount: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnCreateAccountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnLogin: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  btnLoginText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
