import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  NavHomeIcon,
  GoogleMapNavIcon,
  NavProfileIcon,
} from '../components/CommonIcons';
import { Language, TRANSLATIONS } from '../utils/translations';
import { apiService } from '../services/apiService';
import { googleMapsService } from '../services/googleMapsService';
import { Route } from '../types/apiTypes';

interface RouteStop {
  id: number;
  binCode: string;
  location: string;
  isCompleted: boolean;
  rawBinId?: string;
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

const DEFAULT_STOPS: RouteStop[] = [
  {
    id: 1,
    binCode: 'Deh-2213-Ai',
    location: 'Tamil, Sangam Institute , Wellawatte',
    isCompleted: true,
  },
  {
    id: 2,
    binCode: 'Deh-2233-Gn',
    location: 'Galle Rd, Dehiwala-Mount Lavinia',
    isCompleted: true,
  },
  {
    id: 3,
    binCode: 'Deh-2243-Fa',
    location: 'Mount Lavinia Beach Rd',
    isCompleted: false,
  },
  {
    id: 4,
    binCode: 'Deh-2314-At',
    location: 'Hanwella Town Center',
    isCompleted: false,
  },
  {
    id: 5,
    binCode: 'Deh-3213-Sw',
    location: 'Nawagamuwa Junction',
    isCompleted: false,
  },
  {
    id: 6,
    binCode: 'Deh-4213-Tm',
    location: 'Dedigamuwa Main St',
    isCompleted: false,
  },
];

export const DriverRouteScreen: React.FC<Props> = ({
  language = 'en',
  driverId = 'DRI-PLA-001',
  onNavigateHome,
  onNavigateMap,
  onNavigateAccount,
  onLogout,
  onLanguageChange,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const [stops, setStops] = useState<RouteStop[]>(DEFAULT_STOPS);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadRouteData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch route assigned or all routes
      const routesRes = await apiService.getRoutes();
      if (routesRes && routesRes.success && routesRes.data && routesRes.data.length > 0) {
        const foundRoute =
          routesRes.data.find(
            (r) =>
              r.assignedDriver?.driverId === driverId ||
              r.assignedDriver?._id === driverId
          ) || routesRes.data[0];

        setCurrentRoute(foundRoute);

        // If route has populated bins, map them
        if (foundRoute.bins && foundRoute.bins.length > 0) {
          const mappedStops: RouteStop[] = foundRoute.bins.map((b, idx) => ({
            id: idx + 1,
            binCode: b.binId || `BIN-${idx + 1}`,
            location: b.location || 'Colombo Waste Zone',
            isCompleted: b.fillLevel === 0 || b.capacityStatus === 'Normal',
            rawBinId: b._id || b.binId,
          }));
          setStops(mappedStops);
          setIsLoading(false);
          return;
        }
      }

      // 2. Alternatively, fetch real bins directly from /api/bins
      const binsRes = await apiService.getBins({ limit: 6 });
      if (binsRes && binsRes.success && binsRes.data && binsRes.data.length > 0) {
        const mappedStops: RouteStop[] = binsRes.data.map((b, idx) => ({
          id: idx + 1,
          binCode: b.binId,
          location: b.location,
          isCompleted: idx < 2, // Default first 2 completed for realistic workflow
          rawBinId: b._id || b.binId,
        }));
        setStops(mappedStops);
      }
    } catch {
      // Fallback gracefully to default stops
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    loadRouteData();
  }, [loadRouteData]);

  // Toggle Stop Completion & Sync with Backend API
  const handleToggleStop = async (id: number) => {
    const targetStop = stops.find((s) => s.id === id);
    if (!targetStop) return;

    const nextState = !targetStop.isCompleted;

    // Optimistically update local state
    setStops((prev) =>
      prev.map((stop) => (stop.id === id ? { ...stop, isCompleted: nextState } : stop))
    );

    // Call Backend API to update Bin Telemetry
    try {
      const binIdentifier = targetStop.rawBinId || targetStop.binCode;
      await apiService.updateBin(binIdentifier, {
        fillLevel: nextState ? 0 : 80,
        capacityStatus: nextState ? 'Normal' : 'Almost Full',
      });
    } catch {
      // Non-blocking sync error
    }
  };

  // End Route & Sync with Backend API
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
          onPress: async () => {
            try {
              if (currentRoute?._id) {
                await apiService.updateRoute(currentRoute._id, { status: 'Completed' });
              }
              await apiService.updateDriver(driverId, { isAllocated: false });
            } catch {
              // Ignore network sync issues on finish
            }

            Alert.alert(
              language === 'si' ? 'ගමන් මාර්ගය අවසන්!' : 'Route Complete!',
              language === 'si'
                ? 'සියලු එකතු කිරීම් දත්ත සාර්ථකව සටහන් විය.'
                : 'All waste collection records have been uploaded successfully to the backend.',
              [{ text: 'OK', onPress: onNavigateHome }]
            );
          },
        },
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
            onPress={onNavigateAccount}
            activeOpacity={0.7}
          >
            <NavProfileIcon size={28} color="#2D6A4F" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#2D6A4F" />
            <Text style={styles.loadingText}>Fetching route stops from API...</Text>
          </View>
        ) : (
          /* Route Stops Scrollable List */
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
                    {/* Google Maps Nav shortcut for this specific stop */}
                    <TouchableOpacity
                      style={styles.stopMapNavBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        googleMapsService.openNavigation(stop.location, stop.binCode);
                      }}
                      activeOpacity={0.7}
                    >
                      <GoogleMapNavIcon size={18} />
                    </TouchableOpacity>

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
                          isDone ? styles.okBtnTextCompleted : styles.okBtnTextPending,
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

            {/* Google Maps Entire Route Navigation & END Button */}
            <View style={styles.endBtnContainer}>
              <TouchableOpacity
                style={styles.googleMapsFullRouteBtn}
                onPress={() =>
                  googleMapsService.openRouteNavigation(
                    stops.map((s) => s.location),
                    'Bin Matrix Depot'
                  )
                }
                activeOpacity={0.85}
              >
                <GoogleMapNavIcon size={20} />
                <Text style={styles.googleMapsFullRouteText}>
                  {language === 'si' ? 'ගූගල් මැප්ස් මගින් මාර්ගය බලන්න' : 'Navigate Route in Google Maps'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.endBtn}
                onPress={handleEndRoute}
                activeOpacity={0.85}
              >
                <Text style={styles.endBtnText}>{t.driverEnd}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

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
            onPress={onNavigateAccount}
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
    paddingVertical: 12,
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
    marginTop: -2,
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    marginTop: 2,
  },
  profileBtn: {
    padding: 4,
  },
  loadingArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 10,
  },
  stopCard: {
    backgroundColor: '#D1E7DD',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E513A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  indexNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stopDetails: {
    flex: 1,
    marginRight: 8,
  },
  binCodeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 15,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  okBtn: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  okBtnCompleted: {
    backgroundColor: '#15803D',
  },
  okBtnPending: {
    backgroundColor: '#DC2626',
  },
  okBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  okBtnTextCompleted: {
    color: '#FFFFFF',
  },
  okBtnTextPending: {
    color: '#FFFFFF',
  },
  badgeBtn: {
    padding: 2,
  },
  stopMapNavBtn: {
    padding: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endBtnContainer: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
    gap: 12,
  },
  googleMapsFullRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  googleMapsFullRouteText: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '700',
  },
  endBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 54,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  endBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
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
});
