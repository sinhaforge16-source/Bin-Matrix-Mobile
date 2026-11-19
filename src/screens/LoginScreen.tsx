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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CornerLines } from '../components/CornerLines';
import { GoogleIcon, FacebookIcon, AppleIcon } from '../components/CommonIcons';
import { LoginMinimalVector } from '../components/MinimalAuthVectors';
import { Language, TRANSLATIONS } from '../utils/translations';
import { apiService } from '../services/apiService';
import { googleAuthService } from '../services/googleAuthService';

interface Props {
  language?: Language;
  onLoginSuccess: (userProfile: { name: string; binKey: string; email?: string }) => void;
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
  const [binKeyOrUsername, setBinKeyOrUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    const inputIdentifier = binKeyOrUsername.trim();
    const inputPassword = password.trim();

    if (!inputIdentifier || !inputPassword) {
      setErrorMessage(
        language === 'si'
          ? 'කරුණාකර පරිශීලක නාමය සහ මුරපදය ඇතුළත් කරන්න'
          : 'Please enter both username and password'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Connect to Backend API: POST /api/auth/login
      const response = await apiService.login(inputIdentifier, inputPassword);

      setIsLoading(false);

      if (response && response.success && response.user) {
        onLoginSuccess({
          name: response.user.fullName || response.user.username,
          binKey: registeredUser?.binKey || 'BIN-AA123',
          email: response.user.email,
        });
        return;
      }
    } catch (err: any) {
      setIsLoading(false);

      // Check fallback: local registered user or demo credentials
      const lowerId = inputIdentifier.toLowerCase();
      const isDummyUser =
        (lowerId === 'user' && inputPassword === '1234') ||
        (lowerId === 'admin' && inputPassword === 'admin123');

      const isRegisteredMatch = Boolean(
        registeredUser &&
          (lowerId === registeredUser.binKey.toLowerCase() ||
            lowerId === registeredUser.email.toLowerCase() ||
            lowerId === registeredUser.name.toLowerCase()) &&
          (!registeredUser.password || inputPassword === registeredUser.password)
      );

      if (isDummyUser || isRegisteredMatch) {
        setErrorMessage('');
        onLoginSuccess({
          name:
            isRegisteredMatch && registeredUser
              ? registeredUser.name
              : lowerId === 'admin'
              ? 'Admin Manager'
              : 'Bin Matrix User',
          binKey: isRegisteredMatch && registeredUser ? registeredUser.binKey : 'BM-7749-LK',
          email: isRegisteredMatch && registeredUser ? registeredUser.email : undefined,
        });
        return;
      }

      const errMsg = err.message || 'Login failed. Please check credentials or server connection.';
      setErrorMessage(errMsg);
      Alert.alert(
        language === 'si' ? 'ඇතුල් වීම අසාර්ථකයි' : 'Login Failed',
        `${errMsg}\n\n${
          language === 'si'
            ? 'නිරූපණ තොරතුරු: admin / admin123 හෝ user / 1234'
            : 'Demo credentials: admin / admin123 or user / 1234'
        }`
      );
    }
  };

  const handleFillDemo = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setBinKeyOrUsername('admin');
      setPassword('admin123');
    } else {
      setBinKeyOrUsername('user');
      setPassword('1234');
    }
    setErrorMessage('');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await googleAuthService.signInWithGoogle({ role: 'user' });
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess({
          name: res.user.fullName || res.user.username,
          binKey: res.binKey || 'BIN-AA123',
          email: res.user.email,
        });
      } else {
        setErrorMessage(res.message || 'Google sign-in could not be completed.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Google sign-in error.');
    }
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
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Quick Demo Credentials Autofill badge */}
            <View style={styles.demoRow}>
              <TouchableOpacity
                onPress={() => handleFillDemo('admin')}
                style={styles.demoBadge}
                activeOpacity={0.7}
              >
                <Text style={styles.demoBadgeText}>💡 Admin (admin / admin123)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFillDemo('user')}
                style={[styles.demoBadge, { backgroundColor: '#F1F5F9' }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.demoBadgeText, { color: '#475569' }]}>💡 User (user / 1234)</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() =>
                Alert.alert(
                  language === 'si' ? 'මුරපදය නැවත සැකසීම' : 'Password Reset',
                  language === 'si'
                    ? 'නිරූපණ ගිණුම් තොරතුරු:\nපරිශීලක නාමය: admin / admin123 හෝ user / 1234'
                    : 'Backend seeded credentials:\nUsername: admin\nPassword: admin123\n\nDemo user:\nUsername: user\nPassword: 1234'
                )
              }
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>{t.forgotPassword}</Text>
            </TouchableOpacity>

            {/* Sign in Button */}
            <TouchableOpacity
              style={[styles.btnSignIn, isLoading && styles.btnDisabled]}
              onPress={handleSignIn}
              activeOpacity={0.88}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.btnSignInText}>{t.signInBtn}</Text>
              )}
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
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={handleGoogleSignIn}
              activeOpacity={0.7}
              disabled={isLoading}
            >
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
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: '#FEE2E2',
    padding: 6,
    borderRadius: 8,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  demoBadge: {
    alignSelf: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  demoBadgeText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
  },
  forgotText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  btnSignIn: {
    backgroundColor: '#2D6A4F',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.7,
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
