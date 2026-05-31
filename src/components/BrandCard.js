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
 * Brand identity dot colors
 */
const BRAND_DOTS = {
  skt: '#E60012',
  kt: '#E6007E',
  lguplus: '#E60012',
  naverplus: '#03C75A',
  coupangwow: '#E31837',
  toss: '#0064FF',
};

/**
 * BrandCard — premium fintech-style selectable membership tile.
 *
 * Default  : White card, thin border, colored dot + label
 * Selected : Matte black fill, white text, Royal Blue checkmark
 */
export default function BrandCard({ brandKey, label, isActive, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;

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

  const backgroundColor = Colors.white;

  const borderColor = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.royalBlue],
  });

  const borderWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.5, 2],
  });

  const textColor = Colors.textPrimary;

  const dotColor = BRAND_DOTS[brandKey] || Colors.royalBlue;

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
        ]}
      >
        {/* Left: brand dot + label */}
        <View style={styles.cardContent}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Animated.Text
            style={[styles.label, { color: textColor }]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        </View>

        {/* Right: checkmark when selected */}
        {isActive && (
          <View style={styles.checkBadge}>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: Spacing.md + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minHeight: 60,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm + 4,
  },
  label: {
    ...Typography.brandLabel,
    color: Colors.textPrimary,
    flex: 1,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.royalBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  checkMark: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});
