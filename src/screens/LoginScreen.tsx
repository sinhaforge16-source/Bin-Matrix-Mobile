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
import { LoginMinimalVector } from '../components/MinimalAuthVectors';
import { Language, TRANSLATIONS } from '../utils/translations';

interface Props {
  language?: Language;
  onLoginSuccess: (userProfile: { name: string; binKey: string }) => void;
  onNavigateRegister: () => void;
  onBack?: () => void;
  registeredUser?: { name: string; email: string; binKey: string; password?: string } | null;
}

export const LoginScreen: React.FC<Props> = ({
  language = 'en',
  onLoginSuccess,
  onNavigateRegister,
  onBack,
  registeredUser,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const [binKeyOrUsername, setBinKeyOrUsername] = useState('user');
  const [password, setPassword] = useState('1234');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = () => {
    const inputIdentifier = binKeyOrUsername.trim().toLowerCase();
    const inputPassword = password.trim();

    // Check dummy user "user" / "1234" or registered user
    const isDummyUser = inputIdentifier === 'user' && inputPassword === '1234';
    const isRegisteredMatch =
      Boolean(registeredUser &&
      (inputIdentifier === registeredUser.binKey.toLowerCase() ||
        inputIdentifier === registeredUser.email.toLowerCase() ||
        inputIdentifier === registeredUser.name.toLowerCase()) &&
      (!registeredUser.password || inputPassword === registeredUser.password));

    if (isDummyUser || isRegisteredMatch) {
      setErrorMessage('');
      onLoginSuccess({
        name: isRegisteredMatch && registeredUser ? registeredUser.name : 'Bin Matrix User',
        binKey: isRegisteredMatch && registeredUser ? registeredUser.binKey : 'BM-7749-LK',
      });
    } else {
      setErrorMessage(
        language === 'si'
          ? 'වලංගු නොවන තොරතුරු. පරිශීලක නාමය: user සහ මුරපදය: 1234 භාවිතා කරන්න'
          : 'Invalid credentials. Use username: user and password: 1234'
      );
      Alert.alert(
        language === 'si' ? 'ඇතුල් වීම අසාර්ථකයි' : 'Login Failed',
        language === 'si'
          ? 'කරුණාකර නිරූපණ ගිණුම් තොරතුරු ඇතුළත් කරන්න:\n\nපරිශීලක නාමය / බඳුන් යතුර: user\nමුරපදය: 1234'
          : 'Please enter the demo credentials:\n\nUsername / Bin Key: user\nPassword: 1234'
      );
    }
  };

  const handleFillDemo = () => {
    setBinKeyOrUsername('user');
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

          {/* Minimal Background-less Vector Graphic */}
          <LoginMinimalVector size={85} />

          {/* Heading */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>{t.loginTitle}</Text>
            <Text style={styles.subTitle}>{t.loginSubtitle}</Text>
          </View>

          {/* Input Form Fields */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={t.binKeyLoginPlaceholder}
              placeholderTextColor="#94A3B8"
              value={binKeyOrUsername}
              onChangeText={(text) => {
                setBinKeyOrUsername(text);
                setErrorMessage('');
              }}
              autoCapitalize="none"
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
            />

            {/* Error banner if invalid */}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Quick Demo Credentials Autofill badge */}
            <TouchableOpacity
              onPress={handleFillDemo}
              style={styles.demoBadge}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBadgeText}>
                💡 {t.demoHint}
              </Text>
            </TouchableOpacity>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() =>
                Alert.alert(
                  language === 'si' ? 'මුරපදය නැවත සැකසීම' : 'Password Reset',
                  language === 'si'
                    ? 'නිරූපණ ගිණුම් තොරතුරු:\nපරිශීලක නාමය: user\nමුරපදය: 1234'
                    : 'Demo credentials are:\nUsername: user\nPassword: 1234'
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

            {/* Create new account link */}
            <TouchableOpacity
              onPress={onNavigateRegister}
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
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
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
    marginTop: 8,
    marginBottom: 16,
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
    paddingHorizontal: 20,
  },
  form: {
    gap: 14,
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
  demoBadge: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  demoBadgeText: {
    fontSize: 12,
    color: '#15803D',
  },
  demoBold: {
    fontWeight: '700',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
  },
  forgotText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  btnSignIn: {
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
  btnSignInText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  registerLinkText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
