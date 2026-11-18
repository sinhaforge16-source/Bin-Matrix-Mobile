import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavHomeIcon,
  NavSmartBinIcon,
  NavProfileIcon,
} from '../components/CommonIcons';
import {
  MailIcon,
  ChevronDownIcon,
  LogOutIcon,
  PlusCircleIcon,
} from '../components/ChatIcons';
import { UKFlag, SriLankaFlag } from '../components/FlagIcons';
import Svg, { Circle, Path, ClipPath, Defs } from 'react-native-svg';
import { Language, TRANSLATIONS } from '../utils/translations';

interface Props {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  userProfile?: {
    name: string;
    email: string;
    binKey: string;
  };
  onNavigateHome: () => void;
  onNavigateChatbot: () => void;
  onLogout: () => void;
  onAddAccount?: () => void;
}

/**
 * 2D Modern Executive User Avatar Vector
 */
const UserAvatarGraphic: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Defs>
      <ClipPath id="avatarCircleClip">
        <Circle cx="50" cy="50" r="46" />
      </ClipPath>
    </Defs>

    {/* Outer Green Border Ring matching mockup */}
    <Circle cx="50" cy="50" r="48" stroke="#1E513A" strokeWidth="3.5" fill="#E2E8F0" />

    <Path
      d="M 4 50 A 46 46 0 1 0 96 50 A 46 46 0 1 0 4 50 Z"
      fill="#F1F5F9"
      clipPath="url(#avatarCircleClip)"
    />

    {/* Head & Hair */}
    <Circle cx="50" cy="38" r="16" fill="#FBCFE8" clipPath="url(#avatarCircleClip)" />
    {/* Dark Hair */}
    <Path
      d="M 32 36 C 32 20, 68 20, 68 36 C 65 30, 58 26, 50 26 C 42 26, 35 30, 32 36 Z"
      fill="#1E293B"
      clipPath="url(#avatarCircleClip)"
    />

    {/* Suit Jacket & Tie */}
    {/* White Shirt collar */}
    <Path d="M 40 52 L 50 68 L 60 52 Z" fill="#FFFFFF" clipPath="url(#avatarCircleClip)" />
    {/* Black Tie */}
    <Path d="M 48 54 L 52 54 L 53 72 L 50 78 L 47 72 Z" fill="#0F172A" clipPath="url(#avatarCircleClip)" />
    {/* Dark Suit Shoulders */}
    <Path
      d="M 22 88 C 22 62, 38 54, 46 54 L 50 66 L 54 54 C 62 54, 78 62, 78 88 Z"
      fill="#1E293B"
      clipPath="url(#avatarCircleClip)"
    />
  </Svg>
);

export const AccountScreen: React.FC<Props> = ({
  language = 'en',
  onLanguageChange,
  userProfile = {
    name: 'Hashibara inosuke',
    email: 'inosuke@gmail.com',
    binKey: 'BIN-AA123',
  },
  onNavigateHome,
  onNavigateChatbot,
  onLogout,
  onAddAccount,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'si' : 'en';
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
  };

  const handleAddAccountPress = () => {
    if (onAddAccount) {
      onAddAccount();
    } else {
      Alert.alert(
        language === 'si' ? 'ගිණුමක් එක් කරන්න' : 'Add Account',
        language === 'si'
          ? 'තවත් නිවාස හෝ ව්‍යාපාරික ස්මාර්ට් බඳුන් ගිණුමක් සම්බන්ධ කරන්න.'
          : 'Link another household or business smart bin account.'
      );
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>{t.accountTitle}</Text>
          <View style={styles.profileBtn}>
            <NavProfileIcon size={30} color="#2D6A4F" />
          </View>
        </View>

        {/* Profile Card & Info */}
        <View style={styles.content}>
          {/* Avatar & User Name */}
          <View style={styles.avatarSection}>
            <UserAvatarGraphic size={106} />
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.binKey}>{userProfile.binKey}</Text>
          </View>

          {/* Form Fields Section */}
          <View style={styles.fieldsGroup}>
            {/* Email Field */}
            <View style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
              <View style={styles.pillCard}>
                <View style={styles.iconWrapper}>
                  <MailIcon size={20} color="#000000" />
                </View>
                <Text style={styles.fieldValue}>{userProfile.email}</Text>
              </View>
            </View>

            {/* Language Field */}
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
                  <Text style={styles.fieldValue}>{language === 'en' ? 'English' : 'සිංහල'}</Text>
                </View>
                <ChevronDownIcon size={18} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* + Add Account Action */}
            <TouchableOpacity
              style={styles.addAccountRow}
              onPress={handleAddAccountPress}
              activeOpacity={0.7}
            >
              <PlusCircleIcon size={24} color="#1E513A" />
              <Text style={styles.addAccountText}>{t.addAccount}</Text>
            </TouchableOpacity>

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
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateHome}
            activeOpacity={0.7}
          >
            <NavHomeIcon size={26} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Chatbot Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateChatbot}
            activeOpacity={0.7}
          >
            <NavSmartBinIcon size={26} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Account Tab (Active) */}
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
    marginBottom: 32,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  binKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  fieldsGroup: {
    gap: 20,
  },
  fieldItem: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#A7D7A9', // Light green pill from mockup
    borderWidth: 1.2,
    borderColor: '#2D6A4F',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  pillLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    marginRight: 14,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  addAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  addAccountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E513A',
  },
  btnLogOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D6A4F', // Dark eco-green
    paddingVertical: 15,
    borderRadius: 28,
    gap: 12,
    marginTop: 14,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnLogOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomNavBar: {
    backgroundColor: '#1E3A2F',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    padding: 8,
    borderRadius: 16,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});
