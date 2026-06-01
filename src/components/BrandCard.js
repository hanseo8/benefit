import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';

/**
 * Brand primary identity colors
 */
const BRAND_COLORS = {
  skt: '#E60012',
  kt: '#111111',
  lguplus: '#E6007E',
  naverplus: '#03C75A',
  coupangwow: '#E31837',
  toss: '#0064FF',
};

/**
 * Brand-specific soft background tints for selected state
 */
const BRAND_SELECTED_BGS = {
  skt: 'rgba(230, 0, 18, 0.04)',
  kt: 'rgba(17, 17, 17, 0.04)',
  lguplus: 'rgba(230, 0, 126, 0.04)',
  naverplus: 'rgba(3, 199, 90, 0.04)',
  coupangwow: 'rgba(227, 24, 55, 0.04)',
  toss: 'rgba(0, 100, 255, 0.04)',
};

/**
 * Custom BrandLogo Component - high-fidelity vector-like CSS representations
 */
function BrandLogo({ brandKey }) {
  switch (brandKey) {
    case 'skt':
      return (
        <View style={[styles.logoContainer, { backgroundColor: '#E60012' }]}>
          <Text style={[styles.logoText, { fontWeight: '900', color: '#FFFFFF', fontSize: 24, letterSpacing: -1 }]}>T</Text>
          <View style={styles.sktDot} />
        </View>
      );
    case 'kt':
      return (
        <View style={[styles.logoContainer, { backgroundColor: '#111111' }]}>
          <Text style={[styles.logoText, { fontWeight: '800', color: '#FFFFFF', fontSize: 18, fontStyle: 'italic', letterSpacing: -1 }]}>kt</Text>
          <View style={styles.ktLine} />
        </View>
      );
    case 'lguplus':
      return (
        <View style={[styles.logoContainer, { backgroundColor: '#E6007E' }]}>
          <Text style={[styles.logoText, { fontWeight: '900', color: '#FFFFFF', fontSize: 17, letterSpacing: -0.5 }]}>U+</Text>
        </View>
      );
    case 'naverplus':
      return (
        <View style={[styles.logoContainer, { backgroundColor: '#03C75A' }]}>
          <Text style={[styles.logoText, { fontWeight: '900', color: '#FFFFFF', fontSize: 20 }]}>N</Text>
          <View style={styles.naverPlusBadge}>
            <Text style={styles.naverPlusText}>+</Text>
          </View>
        </View>
      );
    case 'coupangwow':
      return (
        <View style={[styles.logoContainer, { backgroundColor: '#0055B8' }]}>
          <Text style={[styles.logoText, { fontWeight: '900', color: '#FFB800', fontSize: 13, letterSpacing: -0.5 }]}>WOW</Text>
          <Text style={{ fontSize: 9, color: '#FFFFFF', marginTop: -2, fontWeight: '700' }}>🚀쿠팡</Text>
        </View>
      );
    case 'toss':
      return (
        <View style={[styles.logoContainer, { backgroundColor: '#0064FF' }]}>
          <View style={styles.tossLogoWrapper}>
            <View style={[styles.tossPill, { transform: [{ rotate: '-40deg' }] }]} />
          </View>
        </View>
      );
    default:
      return (
        <View style={[styles.logoContainer, { backgroundColor: Colors.royalBlue }]}>
          <Text style={styles.logoText}>M</Text>
        </View>
      );
  }
}

/**
 * BrandCard — premium vertical card selector with brand identity details
 */
export default function BrandCard({ brandKey, label, isActive, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fillAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 0.97 : 1,
        friction: 8,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fillAnim, {
        toValue: isActive ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive]);

  const brandColor = BRAND_COLORS[brandKey] || Colors.royalBlue;

  const borderColor = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, brandColor],
  });

  const borderWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.5, 2],
  });

  const backgroundColor = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.white, BRAND_SELECTED_BGS[brandKey] || Colors.royalBlueLight],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.touchable}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor,
            borderColor,
            borderWidth,
          },
          isActive && {
            shadowColor: brandColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 4,
          },
        ]}
      >
        {/* Brand Logo Symbol */}
        <BrandLogo brandKey={brandKey} />

        {/* Brand Label */}
        <Text style={styles.label}>
          {label}
        </Text>

        {/* Selected check badge in top right */}
        {isActive && (
          <View style={[styles.checkBadge, { backgroundColor: brandColor }]}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minHeight: 130,
    position: 'relative',
    // Subtle shadow for standard state
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.sm + 2,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
    marginTop: -1,
  },

  /* Logo container & sub-elements */
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  logoText: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  sktDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500',
  },
  ktLine: {
    position: 'absolute',
    bottom: 6,
    width: 14,
    height: 2.5,
    backgroundColor: '#E60012',
  },
  naverPlusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD60A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  naverPlusText: {
    color: '#03C75A',
    fontSize: 9,
    fontWeight: '900',
    lineHeight: 10,
  },
  tossLogoWrapper: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tossPill: {
    width: 24,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});
