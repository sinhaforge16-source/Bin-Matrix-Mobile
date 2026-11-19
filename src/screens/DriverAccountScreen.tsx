import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, ClipPath, Defs, Rect } from 'react-native-svg';
import {
  NavHomeIcon,
  GoogleMapNavIcon,
  NavProfileIcon,
} from '../components/CommonIcons';
import {
  MailIcon,
  ChevronDownIcon,
  LogOutIcon,
} from '../components/ChatIcons';
import { UKFlag, SriLankaFlag } from '../components/FlagIcons';
import { Language, TRANSLATIONS } from '../utils/translations';
import { apiService } from '../services/apiService';

interface Props {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  driverProfile?: {
    name: string;
    id: string;
    email: string;
    truckNumber: string;
  };
  onNavigateHome: () => void;
  onNavigateMap: () => void;
  onLogout: () => void;
}

/**
 * Modern 2D Executive Driver Avatar Graphic
 */
const DriverAvatarGraphic: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Defs>
      <ClipPath id="driverAvatarClip">
        <Circle cx="50" cy="50" r="46" />
      </ClipPath>
    </Defs>

    {/* Outer Green Border Ring matching mockup */}
    <Circle cx="50" cy="50" r="48" stroke="#1E513A" strokeWidth="3" />

    {/* Avatar Contents clipped inside circle */}
    <Svg width="100" height="100" viewBox="0 0 100 100" clipPath="url(#driverAvatarClip)">
      {/* Background Soft Studio Gradient */}
      <Circle cx="50" cy="50" r="46" fill="#E2E8F0" />

      {/* Driver Head / Face */}
      <Circle cx="50" cy="40" r="17" fill="#F8C19D" />

      {/* Styled Hair */}
      <Path
        d="M32 36 C32 22, 68 22, 68 36 C66 32, 60 27, 50 27 C38 27, 34 32, 32 36 Z"
        fill="#3E2723"
      />

      {/* Neck */}
      <Rect x="45" y="52" width="10" height="10" fill="#E6A884" />

      {/* Crisp White Shirt Collar */}
      <Path d="M43 58 L50 68 L57 58 Z" fill="#FFFFFF" />

      {/* Dark Professional Tie */}
      <Path d="M48 64 L52 64 L51 82 L49 82 Z" fill="#1E293B" />

      {/* Dark Executive Driver Blazer / Jacket */}
      <Path
        d="M20 92 C22 72, 36 62, 45 60 L50 72 L55 60 C64 62, 78 72, 80 92 Z"
        fill="#1E293B"
      />
    </Svg>
  </Svg>
);

export const DriverAccountScreen: React.FC<Props> = ({
  language = 'en',
  onLanguageChange,
  driverProfile = {
    name: 'G. Kamal',
    id: 'DRI-PLA-001',
    email: 'kamal@binmatrix.com',
    truckNumber: 'TRK-PLA-001',
  },
  onNavigateHome,
  onNavigateMap,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const [liveProfile, setLiveProfile] = useState(driverProfile);

  useEffect(() => {
    let isMounted = true;
    const fetchDriverDetails = async () => {
      try {
        const res = await apiService.getDriverById(driverProfile.id);
        if (isMounted && res && res.success && res.data) {
          const d = res.data;
          setLiveProfile((prev) => ({
            ...prev,
            name: d.name || prev.name,
            email: d.email || prev.email,
            id: d.driverId || prev.id,
          }));
        }
      } catch {
        // Keep current profile
      }
    };

    fetchDriverDetails();
    return () => {
      isMounted = false;
    };
  }, [driverProfile.id]);

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'si' : 'en';
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(t.logOutConfirmTitle, t.logOutConfirmMsg, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.logOut,
        style: 'destructive',
        onPress: () => {
          apiService.clearAuth();
          onLogout();
        },
      },
    ]);
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>{t.driverAccountTitle}</Text>
          <View style={styles.profileBtn}>
            <NavProfileIcon size={30} color="#2D6A4F" />
          </View>
        </View>

        {/* Profile Details & Form */}
        <View style={styles.content}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <DriverAvatarGraphic size={106} />
            <Text style={styles.userName}>{liveProfile.name}</Text>
            <Text style={styles.driverId}>{liveProfile.id}</Text>
          </View>

          {/* Form Fields Section matching prototype */}
          <View style={styles.fieldsGroup}>
            {/* Field 1: Email */}
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
              <View style={styles.pillCard}>
                <View style={styles.iconWrapper}>
                  <MailIcon size={20} color="#000000" />
                </View>
                <Text style={styles.fieldValue}>{liveProfile.email}</Text>
              </View>
            </View>

            {/* Field 2: Truck Number */}
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>{t.truckNumberLabel}</Text>
              <View style={styles.pillCard}>
                <Text style={styles.fieldValue}>{liveProfile.truckNumber}</Text>
              </View>
            </View>

            {/* Field 3: Language */}
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>{t.languageLabel}</Text>
              <TouchableOpacity
                style={styles.pillCard}
                onPress={toggleLanguage}
                activeOpacity={0.8}
              >
                <View style={styles.pillLeftGroup}>
                  {language === 'en' ? (
                    <UKFlag width={34} height={22} />
                  ) : (
                    <SriLankaFlag width={34} height={22} />
                  )}
                  <Text style={styles.fieldValue}>
                    {language === 'en' ? 'English' : 'සිංහල'}
                  </Text>
                </View>
                <ChevronDownIcon size={18} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Log Out CTA Button */}
            <TouchableOpacity
              style={styles.btnLogOut}
              onPress={handleLogoutPress}
              activeOpacity={0.88}
            >
              <Text style={styles.btnLogOutText}>{t.logOut}</Text>
              <LogOutIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Footer Navbar */}
        <View
          style={[
            styles.bottomNavBar,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {/* Tab 1: Home */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateHome}
            activeOpacity={0.7}
          >
            <NavHomeIcon size={26} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Tab 2: Map View */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateMap}
            activeOpacity={0.7}
          >
            <GoogleMapNavIcon size={26} />
          </TouchableOpacity>

          {/* Tab 3: Driver Account (Active) */}
          <TouchableOpacity
            style={[styles.navItem, styles.navItemActive]}
            activeOpacity={0.7}
          >
            <NavProfileIcon size={26} color="#86EFAC" />
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
    justifyContent: 'space-between',
  },
  topHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  profileBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  driverId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  fieldsGroup: {
    gap: 16,
  },
  fieldItem: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 4,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#94A3B8',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  pillLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    marginRight: 10,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  btnLogOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    borderRadius: 24,
    height: 48,
    marginTop: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnLogOutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomNavBar: {
    flexDirection: 'row',
    backgroundColor: '#1E513A',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
});
