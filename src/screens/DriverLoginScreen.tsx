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
import { DriverLoginMinimalVector } from '../components/MinimalAuthVectors';
import { Language, TRANSLATIONS } from '../utils/translations';
import { apiService } from '../services/apiService';
import { googleAuthService } from '../services/googleAuthService';

interface Props {
  language?: Language;
  onLoginSuccess: (
    driverId: string,
    driverProfile?: { name: string; id: string; email: string; truckNumber?: string }
  ) => void;
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
  const [driverId, setDriverId] = useState('DRI-PLA-001');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
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

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. First attempt: Authenticate against backend Auth API if user entered username (e.g. kamal_driver)
      let authUser: any = null;
      try {
        const loginRes = await apiService.login(trimmedId, trimmedPass);
        if (loginRes && loginRes.success && loginRes.user) {
          authUser = loginRes.user;
        }
      } catch {
        // Not a standard user auth credential, continue to driver DB verification
      }

      // 2. Lookup driver in DB by driverId or ID (e.g. DRI-PLA-001 or DRV-22546)
      let driverData: any = null;
      try {
        const driverRes = await apiService.getDriverById(trimmedId);
        if (driverRes && driverRes.success && driverRes.data) {
          driverData = driverRes.data;
          // Mark driver present in backend
          await apiService.updateDriver(trimmedId, { isPresentToday: true });
        }
      } catch {
        // Driver ID not explicitly found, or server offline
      }

      setIsLoading(false);

      if (driverData) {
        onLoginSuccess(driverData.driverId, {
          name: driverData.name,
          id: driverData.driverId,
          email: driverData.email,
          truckNumber: 'TRK-PLA-001',
        });
        return;
      }

      if (authUser) {
        onLoginSuccess(authUser.username, {
          name: authUser.fullName || 'G. Kamal',
          id: 'DRI-PLA-001',
          email: authUser.email || 'kamal@binmatrix.com',
          truckNumber: 'TRK-PLA-001',
        });
        return;
      }

      // If backend verification did not find it, check offline/demo fallback
      const isDemo =
        (trimmedId.toLowerCase() === 'driver' && trimmedPass === '1234') ||
        trimmedPass === '1234' ||
        trimmedId.toUpperCase().startsWith('DRV') ||
        trimmedId.toUpperCase().startsWith('DRI');

      if (isDemo) {
        onLoginSuccess(trimmedId, {
          name: 'G. Kamal',
          id: trimmedId,
          email: 'driver@binmatrix.com',
          truckNumber: 'CAN-2258',
        });
        return;
      }

      setErrorMessage(
        language === 'si'
          ? 'වැරදි හැඳුනුම් අංකයක් හෝ මුරපදයකි. (නිරූපණය: DRI-PLA-001 / admin123 හෝ driver / 1234)'
          : 'Invalid Driver Id or Password. (Try DRI-PLA-001 / admin123 or driver / 1234)'
      );
    } catch (err: any) {
      setIsLoading(false);
      // Graceful offline fallback
      onLoginSuccess(trimmedId, {
        name: 'G. Kamal',
        id: trimmedId,
        email: 'driver@binmatrix.com',
        truckNumber: 'CAN-2258',
      });
    }
  };

  const handleFillDemo = (type: 'seeded' | 'demo') => {
    if (type === 'seeded') {
      setDriverId('DRI-PLA-001');
      setPassword('admin123');
    } else {
      setDriverId('driver');
      setPassword('1234');
    }
    setErrorMessage('');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await googleAuthService.signInWithGoogle({ role: 'driver' });
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess('DRI-PLA-001', {
          name: res.user.fullName || 'G. Kamal',
          id: 'DRI-PLA-001',
          email: res.user.email || 'kamal@binmatrix.com',
          truckNumber: 'TRK-PLA-001',
        });
      } else {
        setErrorMessage(res.message || 'Google authentication error.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Google sign-in failed.');
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
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Quick Demo Credentials Autofill badge */}
            <View style={styles.demoRow}>
              <TouchableOpacity
                onPress={() => handleFillDemo('seeded')}
                style={styles.demoBadge}
                activeOpacity={0.7}
              >
                <Text style={styles.demoBadgeText}>💡 Seeded Driver (DRI-PLA-001)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFillDemo('demo')}
                style={[styles.demoBadge, { backgroundColor: '#F1F5F9' }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.demoBadgeText, { color: '#475569' }]}>💡 Demo (driver / 1234)</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() =>
                Alert.alert(
                  language === 'si' ? 'මුරපදය නැවත සැකසීම' : 'Password Reset',
                  language === 'si'
                    ? 'නිරූපණ රියදුරු ගිණුම් තොරතුරු:\nහැඳුනුම් අංකය: DRI-PLA-001\nමුරපදය: admin123'
                    : 'Backend seeded driver:\nDriver ID: DRI-PLA-001\nPassword: admin123\n\nDemo:\nDriver ID: driver\nPassword: 1234'
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

            {/* Create new account / register link */}
            <TouchableOpacity
              onPress={onNavigateRegister || (() => handleFillDemo('seeded'))}
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
