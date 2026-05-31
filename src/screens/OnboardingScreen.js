import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';
import BrandCard from '../components/BrandCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Membership brand data
 */
const BRANDS = [
  { key: 'skt', label: 'SKT' },
  { key: 'kt', label: 'KT' },
  { key: 'lguplus', label: 'LGU+' },
  { key: 'naverplus', label: '네이버플러스' },
  { key: 'coupangwow', label: '쿠팡와우' },
  { key: 'toss', label: '토스' },
];

export default function OnboardingScreen({ navigation }) {
  const [selectedBrands, setSelectedBrands] = useState(new Set());

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const brandAnims = useRef(
    BRANDS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(24),
    }))
  ).current;

  const hasSelection = selectedBrands.size > 0;

  useEffect(() => {
    // Title entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger brand cards entrance
    const brandAnimations = brandAnims.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          delay: 200 + index * 80,
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          friction: 8,
          tension: 80,
          delay: 200 + index * 80,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(0, brandAnimations).start();
  }, []);

  // Button activation animation
  useEffect(() => {
    Animated.spring(buttonAnim, {
      toValue: hasSelection ? 1 : 0,
      friction: 8,
      tension: 100,
      useNativeDriver: false,
    }).start();
  }, [hasSelection]);

  const toggleBrand = (key) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleStart = () => {
    if (!hasSelection) return;
    navigation.navigate('Dashboard', {
      selectedBrands: Array.from(selectedBrands),
    });
  };

  // Animated button styles — disabled: light gray, active: matte black
  const buttonBg = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.disabledBackground, Colors.accentBlack],
  });

  const buttonTextColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.disabledText, Colors.white],
  });

  const buttonScale = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        {/* ─── Header ─── */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>
            <Text style={styles.titleBlack}>내가 가입한{'\n'}멤버십을 </Text>
            <Text style={styles.titleAccent}>골라주세요</Text>
          </Text>
          <Text style={styles.subtitle}>
            선택한 멤버십의 혜택을 한눈에 비교해 드릴게요
          </Text>
        </Animated.View>

        {/* ─── Brand Grid (2-column) ─── */}
        <View style={styles.grid}>
          {BRANDS.map((brand, index) => (
            <Animated.View
              key={brand.key}
              style={{
                opacity: brandAnims[index].opacity,
                transform: [{ translateY: brandAnims[index].translateY }],
                width: '48%',
                marginBottom: Spacing.sm + 4,
              }}
            >
              <BrandCard
                brandKey={brand.key}
                label={brand.label}
                isActive={selectedBrands.has(brand.key)}
                onPress={() => toggleBrand(brand.key)}
              />
            </Animated.View>
          ))}
        </View>

        {/* ─── Selection Count Indicator ─── */}
        <Animated.View
          style={[
            styles.selectionIndicator,
            {
              opacity: buttonAnim,
            },
          ]}
        >
          <View style={styles.selectionPill}>
            <Text style={styles.selectionText}>
              {selectedBrands.size}개 멤버십 선택됨
            </Text>
          </View>
        </Animated.View>

        {/* ─── Bottom CTA ─── */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            activeOpacity={hasSelection ? 0.85 : 1}
            onPress={handleStart}
            disabled={!hasSelection}
          >
            <Animated.View
              style={[
                styles.ctaButton,
                {
                  backgroundColor: buttonBg,
                  transform: [{ scale: buttonScale }],
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.ctaText,
                  { color: buttonTextColor },
                ]}
              >
                {hasSelection
                  ? '내 혜택 확인하기'
                  : '멤버십을 선택해 주세요'}
              </Animated.Text>
              {hasSelection && (
                <View style={styles.ctaCountBadge}>
                  <Text style={styles.ctaCountText}>{selectedBrands.size}</Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* Bottom safe padding for gesture bar */}
          <View style={styles.bottomSafe} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },

  /* Header — generous whitespace */
  header: {
    paddingTop: Platform.OS === 'android' ? Spacing.xxl + 8 : Spacing.xl + 8,
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm + 4,
  },
  titleBlack: {
    ...Typography.hero,
    color: Colors.textPrimary,
  },
  titleAccent: {
    ...Typography.hero,
    color: Colors.royalBlue,
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textTertiary,
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  /* Selection indicator */
  selectionIndicator: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  selectionPill: {
    backgroundColor: Colors.royalBlueLight,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  selectionText: {
    ...Typography.caption,
    color: Colors.royalBlue,
    fontWeight: '700',
  },

  /* CTA Button — matte black premium */
  bottomArea: {
    marginTop: 'auto',
    paddingBottom: Spacing.md,
  },
  ctaButton: {
    width: '100%',
    height: 58,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...Typography.button,
  },
  ctaCountBadge: {
    marginLeft: Spacing.sm,
    backgroundColor: Colors.royalBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    height: 20,
  },
  ctaCountText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  bottomSafe: {
    height: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
  },
});
