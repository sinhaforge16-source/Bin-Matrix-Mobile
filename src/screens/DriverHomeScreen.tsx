import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language, TRANSLATIONS } from '../utils/translations';
import { NavProfileIcon } from '../components/CommonIcons';
import { apiService } from '../services/apiService';
import { Route } from '../types/apiTypes';

interface Props {
  language?: Language;
  driverId?: string;
  onStartRoute: (routeData?: Route) => void;
  onLogout?: () => void;
}

export const DriverHomeScreen: React.FC<Props> = ({
  language = 'en',
  driverId = 'DRI-PLA-001',
  onStartRoute,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Format today's date as DD/MM/YYYY
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
    today.getMonth() + 1
  ).padStart(2, '0')}/${today.getFullYear()}`;

  useEffect(() => {
    let isMounted = true;
    const fetchDriverRoute = async () => {
      try {
        // Query backend for routes assigned to driver or active routes
        const routesRes = await apiService.getRoutes();
        if (isMounted && routesRes && routesRes.success && routesRes.data && routesRes.data.length > 0) {
          // Find route for this driver, or first available route
          const matched =
            routesRes.data.find(
              (r) =>
                r.assignedDriver?.driverId === driverId ||
                r.assignedDriver?._id === driverId
            ) || routesRes.data[0];
          setActiveRoute(matched);
        }
      } catch {
        // Graceful fallback to default route
      }
    };

    fetchDriverRoute();
    return () => {
      isMounted = false;
    };
  }, [driverId]);

  const handleStartPress = async () => {
    setIsStarting(true);
    try {
      if (activeRoute?._id && activeRoute.status !== 'In Progress') {
        await apiService.updateRoute(activeRoute._id, { status: 'In Progress' });
      }
    } catch {
      // Continue regardless
    } finally {
      setIsStarting(false);
      onStartRoute(activeRoute || undefined);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Top Header / Bar */}
      <View style={styles.topBar}>
        <View style={styles.driverTag}>
          <Text style={styles.driverTagText}>{driverId}</Text>
        </View>

        {onLogout && (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <NavProfileIcon size={24} color="#A7F3D0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Centered Content Matching Prototype */}
      <View style={styles.centerCard}>
        <Text style={styles.greetingText}>{t.driverHello}</Text>
        <Text style={styles.routeReadyText}>
          {activeRoute ? `${activeRoute.routeName}\n${t.driverRouteReady}` : t.driverRouteReady}
        </Text>
        <Text style={styles.dateText}>{formattedDate}</Text>

        {/* START White Pill Button */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={handleStartPress}
          activeOpacity={0.85}
          disabled={isStarting}
        >
          {isStarting ? (
            <ActivityIndicator color="#1E513A" size="small" />
          ) : (
            <Text style={styles.startBtnText}>{t.driverStart}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Subtle Bottom Spacer */}
      <View style={styles.bottomSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E513A',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  driverTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  driverTagText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    padding: 6,
  },
  centerCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  routeReadyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  dateText: {
    fontSize: 14,
    color: '#D1FAE5',
    fontWeight: '500',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  startBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 54,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E513A',
    letterSpacing: 2,
  },
  bottomSpacer: {
    height: 40,
  },
});
