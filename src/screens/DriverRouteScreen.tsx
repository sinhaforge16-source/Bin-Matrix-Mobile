import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  NavHomeIcon,
  GoogleMapNavIcon,
  NavProfileIcon,
} from '../components/CommonIcons';
import { Language, TRANSLATIONS } from '../utils/translations';

interface RouteStop {
  id: number;
  binCode: string;
  location: string;
  isCompleted: boolean;
}

interface Props {
  language?: Language;
  driverId?: string;
  onNavigateHome: () => void;
  onNavigateMap?: () => void;
  onNavigateAccount?: () => void;
  onLogout: () => void;
  onLanguageChange?: (lang: Language) => void;
}

/**
 * Green Checkmark Circle Badge (Completed Status)
 */
const CheckCircleBadge: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" fill="#15803D" />
    <Path
      d="M7 12.5L10.5 16L17 8.5"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Red Question Mark Circle Badge (Pending Status)
 */
const QuestionCircleBadge: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" fill="#DC2626" />
    {/* Question mark glyph */}
    <Path
      d="M9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.3 12.8 11.2 12 12.2V13.2"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="16.5" r="1.3" fill="#FFFFFF" />
  </Svg>
);

export const DriverRouteScreen: React.FC<Props> = ({
  language = 'en',
  driverId = 'DRV-22546',
  onNavigateHome,
  onNavigateMap,
  onNavigateAccount,
  onLogout,
  onLanguageChange,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];

  // Default initial stops matching prototype Page 2:
  // Stops 1 & 2 are completed (✔), stops 3-6 are pending (?)
  const [stops, setStops] = useState<RouteStop[]>([
    {
      id: 1,
      binCode: 'BIN -BIN22546',
      location: 'Tamil, Sangam Institute , Wellawatte',
      isCompleted: true,
    },
    {
      id: 2,
      binCode: 'BIN -BIN22546',
      location: 'Tamil, Sangam Institute , Wellawatte',
      isCompleted: true,
    },
    {
      id: 3,
      binCode: 'BIN -BIN22546',
      location: 'Tamil, Sangam Institute , Wellawatte',
      isCompleted: false, // In page 3, user taps this to mark complete
    },
    {
      id: 4,
      binCode: 'BIN -BIN22546',
      location: 'Tamil, Sangam Institute , Wellawatte',
      isCompleted: false,
    },
    {
      id: 5,
      binCode: 'BIN -BIN22546',
      location: 'Tamil, Sangam Institute , Wellawatte',
      isCompleted: false,
    },
    {
      id: 6,
      binCode: 'BIN -BIN22546',
      location: 'Tamil, Sangam Institute , Wellawatte',
      isCompleted: false,
    },
  ]);

  // Toggle Stop Completion
  const handleToggleStop = (id: number) => {
    setStops((prev) =>
      prev.map((stop) => {
        if (stop.id === id) {
          const nextState = !stop.isCompleted;
          return { ...stop, isCompleted: nextState };
        }
        return stop;
      })
    );
  };

  // End Route
  const handleEndRoute = () => {
    const completedCount = stops.filter((s) => s.isCompleted).length;
    const totalCount = stops.length;

    Alert.alert(
      t.driverEnd,
      language === 'si'
        ? `ඔබ බඳුන් ${totalCount} න් ${completedCount} ක් එකතු කර ඇත. ගමන් මාර්ගය අවසන් කිරීමට තහවුරු කරන්නද?`
        : `You have completed ${completedCount} of ${totalCount} stops. Do you want to finish today's route?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.driverEnd,
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              language === 'si' ? 'ගමන් මාර්ගය අවසන්!' : 'Route Complete!',
              language === 'si'
                ? 'සියලු එකතු කිරීම් දත්ත සාර්ථකව සටහන් විය.'
                : 'All waste collection records have been uploaded successfully.',
              [{ text: 'OK', onPress: onNavigateHome }]
            );
          },
        },
      ]
    );
  };

  // Driver Profile / Settings action
  const handleProfilePress = () => {
    Alert.alert(
      language === 'si' ? 'රියදුරු ගිණුම' : 'Driver Profile',
      `${driverId}\n${language === 'si' ? 'භාෂාව' : 'Language'}: ${language === 'en' ? 'English' : 'සිංහල'}`,
      [
        {
          text: language === 'en' ? 'Switch to සිංහල' : 'Switch to English',
          onPress: () => onLanguageChange?.(language === 'en' ? 'si' : 'en'),
        },
        {
          text: t.logOut,
          style: 'destructive',
          onPress: onLogout,
        },
        { text: t.cancel, style: 'cancel' },
      ]
    );
  };

  const completedCount = stops.filter((s) => s.isCompleted).length;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Main Content Area */}
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.homeBackBtn}
            onPress={onNavigateHome}
            activeOpacity={0.7}
          >
            <Text style={styles.homeBackText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>{t.driverRouteTitle}</Text>
            <Text style={styles.headerSubtitle}>
              {completedCount}/{stops.length}{' '}
              {language === 'si' ? 'සම්පූර්ණයි' : 'Collected'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={onNavigateAccount || handleProfilePress}
            activeOpacity={0.7}
          >
            <NavProfileIcon size={28} color="#2D6A4F" />
          </TouchableOpacity>
        </View>

        {/* Route Stops Scrollable List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {stops.map((stop) => {
            const isDone = stop.isCompleted;

            return (
              <TouchableOpacity
                key={stop.id}
                style={styles.stopCard}
                onPress={() => handleToggleStop(stop.id)}
                activeOpacity={0.8}
              >
                {/* 1. Stop Number Badge */}
                <View style={styles.indexCircle}>
                  <Text style={styles.indexNumber}>{stop.id}</Text>
                </View>

                {/* 2. Stop Details (Bin Code & Location) */}
                <View style={styles.stopDetails}>
                  <Text style={styles.binCodeText}>{stop.binCode}</Text>
                  <Text style={styles.locationText} numberOfLines={2}>
                    {stop.location}
                  </Text>
                </View>

                {/* 3. Status Button & Action Badge */}
                <View style={styles.actionGroup}>
                  {/* "OK" Button - tapping toggles completion */}
                  <View
                    style={[
                      styles.okBtn,
                      isDone ? styles.okBtnCompleted : styles.okBtnPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.okBtnText,
                        isDone
                          ? styles.okBtnTextCompleted
                          : styles.okBtnTextPending,
                      ]}
                    >
                      {t.driverStopOk}
                    </Text>
                  </View>

                  {/* Icon Badge: Green Checkmark or Red Question */}
                  <View style={styles.badgeBtn}>
                    {isDone ? (
                      <CheckCircleBadge size={26} />
                    ) : (
                      <QuestionCircleBadge size={26} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* END Pill Button Matching Prototype */}
          <View style={styles.endBtnContainer}>
            <TouchableOpacity
              style={styles.endBtn}
              onPress={handleEndRoute}
              activeOpacity={0.85}
            >
              <Text style={styles.endBtnText}>{t.driverEnd}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Dark Navigation Bar matching Prototype */}
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

          {/* Route Map Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateMap}
            activeOpacity={0.7}
          >
            <GoogleMapNavIcon size={26} />
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateAccount || handleProfilePress}
            activeOpacity={0.7}
          >
            <NavProfileIcon size={26} color="#FFFFFF" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  homeBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBackText: {
    fontSize: 26,
    color: '#334155',
    lineHeight: 28,
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  profileBtn: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  indexNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  stopDetails: {
    flex: 1,
    paddingRight: 8,
  },
  binCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  okBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 46,
  },
  okBtnCompleted: {
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
  },
  okBtnPending: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  okBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  okBtnTextCompleted: {
    color: '#475569',
  },
  okBtnTextPending: {
    color: '#DC2626',
  },
  badgeBtn: {
    padding: 2,
  },
  endBtnContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  endBtn: {
    borderWidth: 1.2,
    borderColor: '#DC2626',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 36,
    borderRadius: 18,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  endBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
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
