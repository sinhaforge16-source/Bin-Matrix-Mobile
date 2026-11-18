import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SriLankaFlag, UKFlag } from '../components/FlagIcons';
import { ArrowRightIcon, RadioButton } from '../components/VectorIcons';
import { TRANSLATIONS } from '../utils/translations';

export type LanguageCode = 'si' | 'en';

interface LanguageSelectScreenProps {
  onBackToSplash?: () => void;
  onContinueAsUser?: (lang: LanguageCode) => void;
  onContinueAsDriver?: (lang: LanguageCode) => void;
}

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  onBackToSplash,
  onContinueAsUser,
  onContinueAsDriver,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const t = TRANSLATIONS[selectedLanguage];

  const handleUserContinue = () => {
    if (onContinueAsUser) {
      onContinueAsUser(selectedLanguage);
    } else {
      Alert.alert(
        'User Role Selected',
        `Continuing as User in ${selectedLanguage === 'en' ? 'English' : 'Sinhala (සිංහල)'}`
      );
    }
  };

  const handleDriverContinue = () => {
    if (onContinueAsDriver) {
      onContinueAsDriver(selectedLanguage);
    } else {
      Alert.alert(
        'Driver Role Selected',
        `Continuing as Driver in ${selectedLanguage === 'en' ? 'English' : 'Sinhala (සිංහල)'}`
      );
    }
  };

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
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          {onBackToSplash ? (
            <TouchableOpacity
              onPress={onBackToSplash}
              style={styles.backButton}
              activeOpacity={0.6}
            >
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backSpacer} />
          )}
          <Text style={styles.brandTitle}>{t.brandName}</Text>
          <View style={styles.backSpacer} />
        </View>

        {/* Content Body */}
        <View style={styles.content}>
          {/* Main Title & Subtitle */}
          <View style={styles.titleSection}>
            <Text style={styles.mainHeading}>{t.chooseLanguage}</Text>
            <Text style={styles.subHeading}>{t.chooseLanguageSub}</Text>
          </View>

          {/* Language Options List */}
          <View style={styles.optionsList}>
            {/* Sinhala Option */}
            <TouchableOpacity
              style={[
                styles.languageCard,
                selectedLanguage === 'si' && styles.languageCardSelected,
              ]}
              onPress={() => setSelectedLanguage('si')}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeftContent}>
                <SriLankaFlag width={44} height={28} />
                <View style={styles.labelGroup}>
                  <Text style={styles.languageName}>Sinhala</Text>
                  <Text style={styles.nativeScript}>සිංහල</Text>
                </View>
              </View>

              <RadioButton
                selected={selectedLanguage === 'si'}
                activeColor="#2E7D32"
                inactiveColor="#94A3B8"
              />
            </TouchableOpacity>

            {/* English Option */}
            <TouchableOpacity
              style={[
                styles.languageCard,
                selectedLanguage === 'en' && styles.languageCardSelected,
              ]}
              onPress={() => setSelectedLanguage('en')}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeftContent}>
                <UKFlag width={44} height={28} />
                <View style={styles.labelGroup}>
                  <Text style={styles.languageName}>English</Text>
                  <Text style={styles.nativeScript}>English</Text>
                </View>
              </View>

              <RadioButton
                selected={selectedLanguage === 'en'}
                activeColor="#2E7D32"
                inactiveColor="#94A3B8"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom CTA Action Buttons */}
        <View style={styles.footer}>
          {/* Continue as User Button */}
          <TouchableOpacity
            style={styles.btnUser}
            onPress={handleUserContinue}
            activeOpacity={0.88}
          >
            <Text style={styles.btnUserText}>{t.continueAsUser}</Text>
            <ArrowRightIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Continue as Driver Button */}
          <TouchableOpacity
            style={styles.btnDriver}
            onPress={handleDriverContinue}
            activeOpacity={0.88}
          >
            <Text style={styles.btnDriverText}>{t.continueAsDriver}</Text>
            <ArrowRightIcon size={20} color="#FFFFFF" />
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
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
  backSpacer: {
    width: 36,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#2E7D32',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subHeading: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  optionsList: {
    gap: 18,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  languageCardSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  cardLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  labelGroup: {
    flexDirection: 'column',
  },
  languageName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
  nativeScript: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  footer: {
    paddingBottom: 8,
    gap: 14,
  },
  btnUser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D6A4F',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  btnUserText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  btnDriver: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E56B6F',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#E56B6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDriverText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
