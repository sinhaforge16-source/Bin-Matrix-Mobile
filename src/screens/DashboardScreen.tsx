import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SmartBinVector, WasteCategory } from '../components/SmartBinVector';
import {
  NavHomeIcon,
  NavSmartBinIcon,
  NavProfileIcon,
} from '../components/CommonIcons';
import { Language, TRANSLATIONS } from '../utils/translations';

interface Props {
  language?: Language;
  userProfile?: {
    name: string;
    binKey: string;
  };
  onNavigateChatbot?: () => void;
  onNavigateAccount?: () => void;
  onLogout?: () => void;
}

interface CategoryDetails {
  key: WasteCategory;
  label: string;
  percentage: number;
  percentColor: string;
  cardBgColor: string;
  pickupTime: string;
}

const CATEGORIES: CategoryDetails[] = [
  {
    key: 'plastic',
    label: 'Plastic',
    percentage: 50,
    percentColor: '#16A34A', // Green text 50%
    cardBgColor: '#F5D076', // Amber-yellow card
    pickupTime: 'Tomorrow, at 8 a.m',
  },
  {
    key: 'paper',
    label: 'Paper',
    percentage: 20,
    percentColor: '#2563EB', // Blue text 20%
    cardBgColor: '#A4BCF9', // Soft blue card
    pickupTime: 'Tomorrow, at 8 a.m',
  },
  {
    key: 'organic',
    label: 'Organic Waste',
    percentage: 80,
    percentColor: '#EF4444', // Red warning text 80%
    cardBgColor: '#86EFAC', // Light lime-green card
    pickupTime: 'Tomorrow, at 8 a.m',
  },
];

export const DashboardScreen: React.FC<Props> = ({
  language = 'en',
  onNavigateChatbot,
  onNavigateAccount,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const currentCategory = CATEGORIES[selectedCategoryIndex] || CATEGORIES[0];

  const getLocalizedCategoryName = (key: WasteCategory) => {
    switch (key) {
      case 'plastic':
        return t.plastic;
      case 'paper':
        return t.paper;
      case 'organic':
        return t.organic;
      default:
        return t.plastic;
    }
  };

  const handleNextCategory = () => {
    setSelectedCategoryIndex((prev) => (prev + 1) % CATEGORIES.length);
  };

  const handlePrevCategory = () => {
    setSelectedCategoryIndex((prev) => (prev - 1 + CATEGORIES.length) % CATEGORIES.length);
  };

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          {/* Category Title from mockup ("plastic" / "paper" / "Organic Waste") */}
          <Text style={styles.screenTitle}>{getLocalizedCategoryName(currentCategory.key)}</Text>

          {/* Profile Avatar Button -> goes to Account */}
          <TouchableOpacity
            style={styles.profileAvatarBtn}
            onPress={() => onNavigateAccount?.()}
            activeOpacity={0.7}
          >
            <NavProfileIcon size={28} color="#2D6A4F" />
          </TouchableOpacity>
        </View>

        {/* Smart Bin Dashboard View (Plastic / Paper / Organic) */}
        <View style={styles.content}>
          {/* Category Switcher Pills */}
          <View style={styles.categoryPillRow}>
            {CATEGORIES.map((cat, idx) => {
              const isActive = idx === selectedCategoryIndex;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryPill,
                    isActive && styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedCategoryIndex(idx)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      isActive && styles.categoryPillTextActive,
                    ]}
                  >
                    {getLocalizedCategoryName(cat.key)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Smart Bin Graphic & Gauge Display */}
          <View style={styles.binDisplayArea}>
            {/* Prev / Next Swipe Hints */}
            <TouchableOpacity
              onPress={handlePrevCategory}
              style={styles.carouselArrowLeft}
              activeOpacity={0.6}
            >
              <Text style={styles.carouselArrowText}>‹</Text>
            </TouchableOpacity>

            {/* Center Smart Bin Illustration */}
            <View style={styles.binContainer}>
              <SmartBinVector
                category={currentCategory.key}
                fillPercentage={currentCategory.percentage}
                localizedTitle={getLocalizedCategoryName(currentCategory.key)}
              />
            </View>

            {/* Right Gauge / Level Indicator */}
            <View style={styles.gaugeContainer}>
              <Text
                style={[
                  styles.gaugePercent,
                  { color: currentCategory.percentColor },
                ]}
              >
                {currentCategory.percentage}%
              </Text>
              <Text style={styles.gaugeFullLabel}>{t.full}</Text>
            </View>

            <TouchableOpacity
              onPress={handleNextCategory}
              style={styles.carouselArrowRight}
              activeOpacity={0.6}
            >
              <Text style={styles.carouselArrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Upcoming Pickup Banner Card */}
          <View
            style={[
              styles.pickupCard,
              { backgroundColor: currentCategory.cardBgColor },
            ]}
          >
            <Text style={styles.pickupHeading}>{t.upcomingPickup}</Text>
            <Text style={styles.pickupTime}>{t.pickupTimeTomorrow}</Text>
          </View>
        </View>

        {/* Bottom Dark Navigation Bar */}
        <View
          style={[
            styles.bottomNavBar,
            {
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {/* Home Tab (Active) */}
          <TouchableOpacity
            style={[styles.navItem, styles.navItemActive]}
            activeOpacity={0.7}
          >
            <NavHomeIcon size={26} color="#86EFAC" />
          </TouchableOpacity>

          {/* Chatbot Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => onNavigateChatbot?.()}
            activeOpacity={0.7}
          >
            <NavSmartBinIcon size={26} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Account Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => onNavigateAccount?.()}
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
  topHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'capitalize',
  },
  profileAvatarBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  categoryPillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4,
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  categoryPillActive: {
    backgroundColor: '#2D6A4F',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  binDisplayArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  binContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeContainer: {
    position: 'absolute',
    right: 12,
    top: '42%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  gaugePercent: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  gaugeFullLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  carouselArrowLeft: {
    position: 'absolute',
    left: 0,
    padding: 10,
    zIndex: 10,
  },
  carouselArrowRight: {
    position: 'absolute',
    right: 0,
    padding: 10,
    zIndex: 10,
  },
  carouselArrowText: {
    fontSize: 32,
    color: '#CBD5E1',
    fontWeight: '300',
  },
  pickupCard: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pickupHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  pickupTime: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
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
