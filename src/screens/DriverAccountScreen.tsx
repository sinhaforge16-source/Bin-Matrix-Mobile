import React from 'react';
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
    name: 'Hashibara inosuke',
    id: 'DRI-AA123',
    email: 'inosuke@gmail.com',
    truckNumber: 'CAN-2258',
  },
  onNavigateHome,
  onNavigateMap,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'si' : 'en';
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
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
            <Text style={styles.userName}>{driverProfile.name}</Text>
            <Text style={styles.driverId}>{driverProfile.id}</Text>
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
                <Text style={styles.fieldValue}>{driverProfile.email}</Text>
              </View>
            </View>

            {/* Field 2: Truck Number */}
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>{t.truckNumberLabel}</Text>
              <View style={styles.pillCard}>
                <Text style={styles.fieldValue}>{driverProfile.truckNumber}</Text>
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
              onPress={() => {
                Alert.alert(t.logOutConfirmTitle, t.logOutConfirmMsg, [
                  { text: t.cancel, style: 'cancel' },
                  { text: t.logOut, style: 'destructive', onPress: onLogout },
                ]);
              }}
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
    marginBottom: 28,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  driverId: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  fieldsGroup: {
    width: '100%',
  },
  fieldItem: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BCE8BA', // Light green pill matching prototype
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#98D894',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    shadowColor: '#1E513A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  pillLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    marginRight: 12,
  },
  fieldValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  btnLogOut: {
    backgroundColor: '#1E513A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 20,
    gap: 8,
    shadowColor: '#1E513A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
  },
  btnLogOutText: {
    color: '#FFFFFF',
    fontSize: 16,
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
