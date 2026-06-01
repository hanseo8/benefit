import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  Easing,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/* ═══════════════════════════════════════════════
 *  PREMIUM COLOR PALETTE
 *  ── Matches the app's 3-tone fintech system ──
 * ═══════════════════════════════════════════════ */
const DEEP_NAVY = '#080C16';
const DARK_SURFACE = '#0F1520';
const ROYAL_BLUE = '#0052CC';
const ROYAL_BLUE_SOFT = 'rgba(0, 82, 204, 0.15)';
const PURE_WHITE = '#FFFFFF';
const MUTED_WHITE = 'rgba(255, 255, 255, 0.4)';
const GHOST_WHITE = 'rgba(255, 255, 255, 0.06)';

/* ═══════════════════════════════════════════════
 *  TYPEWRITER TEXT
 * ═══════════════════════════════════════════════ */
const INTRO_TEXT = '당신의 할인을 찾아드립니다.';

/* ═══════════════════════════════════════════════
 *  ABSTRACT CONSTELLATION PARTICLES (Phase 2)
 *  ── Geometric dots instead of emojis ──
 * ═══════════════════════════════════════════════ */
const CONSTELLATION_DOTS = [
  { size: 6, startX: -120, startY: -160, opacity: 0.9 },
  { size: 4, startX: 140, startY: -130, opacity: 0.7 },
  { size: 8, startX: -150, startY: 80, opacity: 1.0 },
  { size: 5, startX: 130, startY: 140, opacity: 0.8 },
  { size: 3, startX: -80, startY: 170, opacity: 0.5 },
  { size: 7, startX: 90, startY: -180, opacity: 0.9 },
  { size: 4, startX: -170, startY: -40, opacity: 0.6 },
  { size: 5, startX: 160, startY: 50, opacity: 0.7 },
];

/* ═══════════════════════════════════════════════
 *  BENEFIT TAG PILLS (Phase 3)
 *  ── Minimal floating pills ──
 * ═══════════════════════════════════════════════ */
const FLOATING_TAGS = [
  '영화 할인',
  '무료 배달',
  'VIP 혜택',
  '포인트 적립',
  '구독 할인',
  '캐시백',
];

/* ═══════════════════════════════════════════════
 *  AMBIENT FLOATING PARTICLES (Background)
 *  ── Subtle background dots ──
 * ═══════════════════════════════════════════════ */
const AMBIENT_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: (Math.sin(i * 1.8) * SCREEN_WIDTH * 0.4),
  y: (Math.cos(i * 1.3) * SCREEN_HEIGHT * 0.35),
  size: 2 + (i % 3),
  delay: i * 200,
}));

/* ═══════════════════════════════════════════════
 *  INTRO SCREEN COMPONENT
 * ═══════════════════════════════════════════════ */
export default function IntroScreen({ onIntroComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);

  // ── Master animations ──
  const screenFade = useRef(new Animated.Value(1)).current;
  const cursorBlink = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0.7)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(12)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const topLineWidth = useRef(new Animated.Value(0)).current;

  // ── Ambient particle animations ──
  const ambientAnims = useRef(
    AMBIENT_PARTICLES.map(() => ({
      opacity: new Animated.Value(0),
      drift: new Animated.Value(0),
    }))
  ).current;

  // ── Constellation dot animations ──
  const dotAnims = useRef(
    CONSTELLATION_DOTS.map(() => ({
      progress: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.2),
    }))
  ).current;

  // ── Floating tag animations ──
  const tagAnims = useRef(
    FLOATING_TAGS.map(() => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.85),
      translateY: new Animated.Value(8),
    }))
  ).current;

  // ── Center ring pulse ──
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringScale2 = useRef(new Animated.Value(0)).current;
  const ringOpacity2 = useRef(new Animated.Value(0)).current;

  /* ─────────────────────────────────────────────
   *  BOOT: Start ambient + Phase 1
   * ───────────────────────────────────────────── */
  useEffect(() => {
    // Cursor blink
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorBlink, { toValue: 0, duration: 450, useNativeDriver: true }),
        Animated.timing(cursorBlink, { toValue: 1, duration: 450, useNativeDriver: true }),
      ])
    ).start();

    // Ambient particle fade-in with gentle drift
    ambientAnims.forEach((anim, i) => {
      Animated.sequence([
        Animated.delay(AMBIENT_PARTICLES[i].delay),
        Animated.timing(anim.opacity, {
          toValue: 0.3 + Math.random() * 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Gentle infinite vertical drift
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.drift, {
            toValue: 1,
            duration: 3000 + i * 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim.drift, {
            toValue: 0,
            duration: 3000 + i * 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Top decorative line
    Animated.timing(topLineWidth, {
      toValue: 1,
      duration: 600,
      delay: 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Begin Phase 1 after 300ms
    const timer = setTimeout(() => setCurrentPhase(1), 300);
    return () => clearTimeout(timer);
  }, []);

  /* ─────────────────────────────────────────────
   *  PHASE 1: TYPEWRITER (0.0s – 1.2s)
   * ───────────────────────────────────────────── */
  useEffect(() => {
    if (currentPhase !== 1) return;

    const charDelay = 60;
    let charIndex = 0;

    const interval = setInterval(() => {
      charIndex++;
      setDisplayedChars(charIndex);

      if (charIndex >= INTRO_TEXT.length) {
        clearInterval(interval);

        // Brighten text fully
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        setTimeout(() => setCurrentPhase(2), 300);
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, [currentPhase]);

  /* ─────────────────────────────────────────────
   *  PHASE 2: CONSTELLATION CONVERGENCE (1.2s – 2.0s)
   * ───────────────────────────────────────────── */
  useEffect(() => {
    if (currentPhase !== 2) return;

    // Pulse rings
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ringOpacity, { toValue: 0.3, duration: 200, useNativeDriver: true }),
        Animated.spring(ringScale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(ringOpacity2, { toValue: 0.15, duration: 200, useNativeDriver: true }),
        Animated.spring(ringScale2, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      ]),
    ]).start();

    // Dots converge
    const dotAnimations = dotAnims.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: CONSTELLATION_DOTS[index].opacity,
          duration: 250,
          delay: index * 60,
          useNativeDriver: true,
        }),
        Animated.spring(anim.progress, {
          toValue: 1,
          friction: 7,
          tension: 45,
          delay: index * 60,
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          delay: index * 60,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(0, dotAnimations).start(() => {
      // Dissolve dots & rings
      const dissolve = [
        ...dotAnims.map((anim) =>
          Animated.timing(anim.opacity, { toValue: 0, duration: 250, useNativeDriver: true })
        ),
        Animated.timing(ringOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(ringOpacity2, { toValue: 0, duration: 250, useNativeDriver: true }),
      ];

      Animated.parallel(dissolve).start(() => setCurrentPhase(3));
    });
  }, [currentPhase]);

  /* ─────────────────────────────────────────────
   *  PHASE 3: FLOATING TAGS + EXIT (2.0s – 2.8s)
   * ───────────────────────────────────────────── */
  useEffect(() => {
    if (currentPhase !== 3) return;

    // Bottom accent line
    Animated.timing(lineWidth, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Subtitle
    Animated.parallel([
      Animated.timing(subtitleFade, { toValue: 1, duration: 350, delay: 50, useNativeDriver: true }),
      Animated.spring(subtitleSlide, { toValue: 0, friction: 10, tension: 60, delay: 50, useNativeDriver: true }),
    ]).start();

    // Tags appear one by one then gently float up & fade
    const tagAnimations = tagAnims.map((anim, index) =>
      Animated.sequence([
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 180,
            delay: index * 50,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            friction: 8,
            tension: 100,
            delay: index * 50,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: 0,
            friction: 8,
            tension: 80,
            delay: index * 50,
            useNativeDriver: true,
          }),
        ]),
        // Float upward and dissolve
        Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: -20,
            duration: 500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 500,
            delay: 100,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    Animated.stagger(0, tagAnimations).start();

    // Cross-fade exit
    const exitTimer = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 450,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => onIntroComplete());
    }, 650);

    return () => clearTimeout(exitTimer);
  }, [currentPhase]);

  /* ─────────────────────────────────────────────
   *  RENDER
   * ───────────────────────────────────────────── */
  const displayedText = INTRO_TEXT.substring(0, displayedChars);
  const showCursor = currentPhase <= 1;

  // Animated top line width
  const topLineDynamic = topLineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 32],
  });

  // Animated bottom line width
  const bottomLineDynamic = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 48],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      <StatusBar barStyle="light-content" backgroundColor={DEEP_NAVY} />

      {/* ── Ambient floating particles ── */}
      {AMBIENT_PARTICLES.map((p, i) => {
        const driftY = ambientAnims[i].drift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 8 + (i % 4) * 3],
        });
        return (
          <Animated.View
            key={`ambient-${i}`}
            style={[
              styles.ambientDot,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                left: SCREEN_WIDTH / 2 + p.x,
                top: SCREEN_HEIGHT / 2 + p.y,
                opacity: ambientAnims[i].opacity,
                transform: [{ translateY: driftY }],
              },
            ]}
          />
        );
      })}

      {/* ── Subtle radial gradient overlay ── */}
      <View style={styles.radialOverlay} />

      {/* ── Pulse rings (Phase 2) ── */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: 140,
            height: 140,
            borderRadius: 70,
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: 200,
            height: 200,
            borderRadius: 100,
            opacity: ringOpacity2,
            transform: [{ scale: ringScale2 }],
          },
        ]}
      />

      {/* ── Constellation dots (Phase 2) ── */}
      {CONSTELLATION_DOTS.map((dot, index) => {
        const anim = dotAnims[index];
        const tx = anim.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [dot.startX, 0],
        });
        const ty = anim.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [dot.startY, 0],
        });

        return (
          <Animated.View
            key={`dot-${index}`}
            style={[
              styles.constellationDot,
              {
                width: dot.size,
                height: dot.size,
                borderRadius: dot.size / 2,
                opacity: anim.opacity,
                transform: [{ translateX: tx }, { translateY: ty }, { scale: anim.scale }],
              },
            ]}
          />
        );
      })}

      {/* ── Top decorative line ── */}
      <Animated.View style={[styles.topLine, { width: topLineDynamic }]} />

      {/* ── Main text area ── */}
      <View style={styles.textContainer}>
        <View style={styles.typewriterRow}>
          <Animated.Text style={[styles.heroText, { opacity: textOpacity }]}>
            {displayedText}
          </Animated.Text>
          {showCursor && (
            <Animated.View style={[styles.cursor, { opacity: cursorBlink }]} />
          )}
        </View>

        {/* ── Subtitle ── */}
        <Animated.Text
          style={[
            styles.subtitleText,
            {
              opacity: subtitleFade,
              transform: [{ translateY: subtitleSlide }],
            },
          ]}
        >
          멤버십 혜택 대시보드
        </Animated.Text>
      </View>

      {/* ── Floating tag pills (Phase 3) ── */}
      <View style={styles.tagCloud}>
        {FLOATING_TAGS.map((tag, index) => {
          const anim = tagAnims[index];
          return (
            <Animated.View
              key={`ftag-${index}`}
              style={[
                styles.floatingTag,
                {
                  opacity: anim.opacity,
                  transform: [
                    { scale: anim.scale },
                    { translateY: anim.translateY },
                  ],
                },
              ]}
            >
              <Text style={styles.floatingTagText}>{tag}</Text>
            </Animated.View>
          );
        })}
      </View>

      {/* ── Bottom accent line ── */}
      <Animated.View style={[styles.bottomLine, { width: bottomLineDynamic }]} />
    </Animated.View>
  );
}

/* ═══════════════════════════════════════════════
 *  STYLES
 * ═══════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DEEP_NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  /* Ambient dots */
  ambientDot: {
    position: 'absolute',
    backgroundColor: ROYAL_BLUE_SOFT,
  },

  /* Radial subtle overlay */
  radialOverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: SCREEN_WIDTH * 0.4,
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
  },

  /* Pulse rings */
  pulseRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.25)',
    backgroundColor: 'transparent',
  },

  /* Constellation dots */
  constellationDot: {
    position: 'absolute',
    backgroundColor: ROYAL_BLUE,
  },

  /* Top decorative line */
  topLine: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.18,
    height: 1.5,
    backgroundColor: 'rgba(0, 82, 204, 0.3)',
    borderRadius: 1,
  },

  /* Text container */
  textContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  typewriterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroText: {
    fontSize: Platform.OS === 'web' ? 26 : 22,
    fontWeight: '700',
    color: PURE_WHITE,
    letterSpacing: -0.3,
  },
  cursor: {
    width: 2,
    height: Platform.OS === 'web' ? 28 : 24,
    backgroundColor: ROYAL_BLUE,
    marginLeft: 2,
    borderRadius: 1,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '500',
    color: MUTED_WHITE,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  /* Floating tags */
  tagCloud: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  floatingTag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.25)',
    backgroundColor: GHOST_WHITE,
  },
  floatingTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.3,
  },

  /* Bottom accent line */
  bottomLine: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    height: 1.5,
    backgroundColor: 'rgba(0, 82, 204, 0.3)',
    borderRadius: 1,
  },
});
