import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CornerLines } from '../components/CornerLines';
import { GoogleIcon, FacebookIcon, AppleIcon } from '../components/CommonIcons';
import { RegisterMinimalVector } from '../components/MinimalAuthVectors';
import { Language, TRANSLATIONS } from '../utils/translations';

interface Props {
  language?: Language;
  onSignUpSuccess: (userData: {
    name: string;
    location: string;
    email: string;
    binKey: string;
    password?: string;
  }) => void;
  onNavigateLogin: () => void;
  onBack?: () => void;
}

export const RegisterUserScreen: React.FC<Props> = ({
  language = 'en',
  onSignUpSuccess,
  onNavigateLogin,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [binKey, setBinKey] = useState('');

  const handleSignUp = () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert(
        language === 'si' ? 'අවශ්‍ය ක්ෂේත්‍ර' : 'Required Fields',
        language === 'si'
          ? 'කරුණාකර ඔබගේ නම සහ මුරපදය ඇතුළත් කරන්න.'
          : 'Please enter your Name and Password.'
      );
      return;
    }

    onSignUpSuccess({
      name: name.trim(),
      location: location.trim() || 'Colombo, Sri Lanka',
      email: email.trim() || 'user@binmatrix.com',
      binKey: binKey.trim() || 'BIN-9082-LK',
      password: password.trim(),
    });
  };

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
      <CornerLines />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

          {/* Minimal Background-less Vector Graphic */}
          <RegisterMinimalVector size={80} />

          {/* Heading */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>{t.registerTitle}</Text>
            <Text style={styles.subTitle}>{t.registerSubtitle}</Text>
          </View>

          {/* Input Form Fields */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={t.namePlaceholder}
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder={t.locationPlaceholder}
              placeholderTextColor="#94A3B8"
              value={location}
              onChangeText={setLocation}
            />

            <TextInput
              style={styles.input}
              placeholder={t.emailPlaceholder}
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder={t.passwordPlaceholder}
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder={t.binKeyPlaceholder}
              placeholderTextColor="#94A3B8"
              value={binKey}
              onChangeText={setBinKey}
              autoCapitalize="characters"
            />

            {/* Sign Up CTA Button */}
            <TouchableOpacity
              style={styles.btnSignUp}
              onPress={handleSignUp}
              activeOpacity={0.88}
            >
              <Text style={styles.btnSignUpText}>{t.signUpBtn}</Text>
            </TouchableOpacity>

            {/* Already have an account link */}
            <TouchableOpacity
              onPress={onNavigateLogin}
              style={styles.loginLink}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLinkText}>{t.alreadyHaveAccount}</Text>
            </TouchableOpacity>
          </View>

          {/* Social Sign up Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t.orSignUpWith}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Icons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <GoogleIcon size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <FacebookIcon size={26} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <AppleIcon size={25} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
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
  titleSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  form: {
    marginTop: 10,
    gap: 12,
  },
  input: {
    height: 48,
    borderWidth: 1.2,
    borderColor: '#94A3B8',
    borderRadius: 24,
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  btnSignUp: {
    backgroundColor: '#2D6A4F',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnSignUpText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  loginLinkText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  dividerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  socialBtn: {
    padding: 6,
  },
});
