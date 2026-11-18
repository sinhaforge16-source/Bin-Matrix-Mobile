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
import { DriverLoginMinimalVector } from '../components/MinimalAuthVectors';
import { Language, TRANSLATIONS } from '../utils/translations';

interface Props {
  language?: Language;
  onLoginSuccess: (driverId: string) => void;
  onBack?: () => void;
  onNavigateRegister?: () => void;
}

export const DriverLoginScreen: React.FC<Props> = ({
  language = 'en',
  onLoginSuccess,
  onBack,
  onNavigateRegister,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const [driverId, setDriverId] = useState('driver');
  const [password, setPassword] = useState('1234');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = () => {
    const trimmedId = driverId.trim();
    const trimmedPass = password.trim();

    if (!trimmedId) {
      setErrorMessage(
        language === 'si'
          ? 'කරුණාකර ඔබගේ රියදුරු හැඳුනුම් අංකය ඇතුළත් කරන්න.'
          : 'Please enter your Driver Id.'
      );
      return;
    }

    if (!trimmedPass) {
      setErrorMessage(
        language === 'si'
          ? 'කරුණාකර මුරපදය ඇතුළත් කරන්න.'
          : 'Please enter your password.'
      );
      return;
    }

    // Accept demo credential "driver" with "1234" or any Driver ID starting with DRV or with 1234
    if (
      (trimmedId.toLowerCase() === 'driver' && trimmedPass === '1234') ||
      trimmedPass === '1234' ||
      trimmedId.toUpperCase().startsWith('DRV')
    ) {
      setErrorMessage('');
      onLoginSuccess(trimmedId);
    } else {
      setErrorMessage(
        language === 'si'
          ? 'වැරදි හැඳුනුම් අංකයක් හෝ මුරපදයකි. (නිරූපණය: driver / 1234)'
          : 'Invalid Driver Id or Password. (Demo: driver / 1234)'
      );
    }
  };

  const handleFillDemo = () => {
    setDriverId('driver');
    setPassword('1234');
    setErrorMessage('');
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

          {/* Minimal 2D Background-less Vector Graphic for Driver */}
          <DriverLoginMinimalVector size={85} />

          {/* Heading */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>{t.driverLoginTitle}</Text>
            <Text style={styles.subTitle}>{t.driverLoginSubtitle}</Text>
          </View>

          {/* Input Form Fields */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={t.driverIdPlaceholder}
              placeholderTextColor="#94A3B8"
              value={driverId}
              onChangeText={(text) => {
                setDriverId(text);
                setErrorMessage('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder={t.passwordLoginPlaceholder}
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage('');
              }}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Error banner if invalid */}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Quick Demo Credentials Autofill badge matching user screen */}
            <TouchableOpacity
              onPress={handleFillDemo}
              style={styles.demoBadge}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBadgeText}>
                💡 {t.driverDemoHint}
              </Text>
            </TouchableOpacity>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() =>
                Alert.alert(
                  language === 'si' ? 'මුරපදය නැවත සැකසීම' : 'Password Reset',
                  language === 'si'
                    ? 'නිරූපණ රියදුරු ගිණුම් තොරතුරු:\nහැඳුනුම් අංකය: driver\nමුරපදය: 1234'
                    : 'Demo driver credentials are:\nDriver ID: driver\nPassword: 1234'
                )
              }
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>{t.forgotPassword}</Text>
            </TouchableOpacity>

            {/* Sign in Button */}
            <TouchableOpacity
              style={styles.btnSignIn}
              onPress={handleSignIn}
              activeOpacity={0.88}
            >
              <Text style={styles.btnSignInText}>{t.signInBtn}</Text>
            </TouchableOpacity>

            {/* Create new account / register link */}
            <TouchableOpacity
              onPress={onNavigateRegister || handleFillDemo}
              style={styles.registerLink}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLinkText}>{t.createNewAccount}</Text>
            </TouchableOpacity>
          </View>

          {/* Social Sign in Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t.orSignInWith}</Text>
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
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 4,
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
  titleSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  form: {
    gap: 12,
  },
  input: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#94A3B8',
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  demoBadge: {
    alignSelf: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 2,
  },
  demoBadgeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
    marginTop: -4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -2,
    marginBottom: 4,
  },
  forgotText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  btnSignIn: {
    backgroundColor: '#2D6A4F',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  btnSignInText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  registerLink: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  registerLinkText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 11,
    color: '#64748B',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 36,
    paddingBottom: 6,
  },
  socialBtn: {
    padding: 6,
  },
});
