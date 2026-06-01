import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
  Linking,
  LayoutAnimation,
  UIManager,
  Modal,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ═══════════════════════════════════════════════
 *  1. BENEFITS DATASET
 * ═══════════════════════════════════════════════ */
const FALLBACK_BENEFITS_DATA = [
  {
    id: '1',
    membership: '네이버플러스',
    tags: ['차량', '렌트', '렌터카', '카셰어링', '쏘카', '이동', '여행', '제주도'],
    title: '쏘카(Socar) 대여료 50% 즉시 할인 및 네이버페이 적립',
    url: 'https://m.socar.kr',
  },
  {
    id: '2',
    membership: '네이버플러스',
    tags: ['주유', '기름', '주유소', '자동차', '세차', 'gs칼텍스', '에너지'],
    title: 'GS칼텍스 리터당 최대 100원 할인/적립 및 세차 쿠폰',
    url: 'https://www.gscaltex.com',
  },
  {
    id: '3',
    membership: '네이버플러스',
    tags: ['편의점', '간식', '야식', '담배', 'cu', '씨유', '세계맥주'],
    title: 'CU 편의점 전 상품 10% 즉시 할인 및 추가 적립',
    url: 'https://www.bgfcu.co.kr',
  },
  {
    id: '4',
    membership: '네이버플러스',
    tags: ['배달', '야식', '치킨', '피자', '요기요', '음식', '주문'],
    title: '요기요 요기패스X 무료 배달 및 추가 할인 혜택',
    url: 'https://www.yogiyo.co.kr',
  },
  {
    id: '5',
    membership: '네이버플러스',
    tags: ['영화', '극장', '데이트', '영화관', '롯데시네마', '팝콘'],
    title: '롯데시네마 영화 예매권 최대 4,000원 할인 쿠폰',
    url: 'https://www.lottecinema.co.kr',
  },
  {
    id: '6',
    membership: '네이버플러스',
    tags: ['항공', '비행기', '여행', '해외여행', '제주도', '에어로케이', '휴가'],
    title: '에어로케이 항공권 최대 10% 할인 및 기내샵 혜택',
    url: 'https://www.aerok.com',
  },
  {
    id: '7',
    membership: '네이버플러스',
    tags: ['마트', '장보기', '쇼핑', '생필품', '롯데마트', '식재료'],
    title: '롯데마트 오프라인 매장 결제 시 최대 10% 즉시 할인',
    url: 'https://www.lottemart.com',
  },
  {
    id: '8',
    membership: '네이버플러스',
    tags: ['택시', '이동', '호출', '우버', '우티', 'ut', 'uber'],
    title: '우버(Uber) 택시 호출 및 상시 결제 5% 할인 혜택',
    url: 'https://www.uber.com/kr/ko/',
  },
  {
    id: '9',
    membership: 'KT',
    tags: ['호텔', '숙박', '여행', '펜션', '아고다', '야놀자', '휴가'],
    title: 'VIP 초이스: 야놀자/아고다 숙박 10,000원 즉시 할인 쿠폰',
    url: 'https://m.membership.kt.com',
  },
  {
    id: '10',
    membership: 'KT',
    tags: ['영화', '극장', '데이트', 'cgv', '공짜', '무료영화'],
    title: 'VIP 초이스: CGV 평일 무료 예매권 및 동반자 할인',
    url: 'https://m.membership.kt.com',
  },
  {
    id: '11',
    membership: 'SKT',
    tags: ['커피', '카페', '디저트', '스타벅스', '폴바셋', '빵'],
    title: 'T멤버십: 폴바셋 전 메뉴 10% 할인 또는 적립',
    url: 'https://www.sktmembership.co.kr',
  },
  {
    id: '12',
    membership: '쿠팡와우',
    tags: ['배달', '야식', '치킨', '피자', '쿠팡이츠', '무료배달'],
    title: '와우 혜택: 쿠팡이츠 매 주문 배달비 무제한 0원 무료',
    url: 'https://www.coupangeats.com',
  },
  {
    id: '13',
    membership: '토스',
    tags: ['커피', '카페', '스타벅스', '디저트', '캐시백', '환급'],
    title: '브랜드 캐시백: 스타벅스 결제 금액의 10% 토스머니 환급',
    url: 'https://toss.im',
  },
  {
    id: '14',
    membership: 'LGU+',
    tags: ['영화', '극장', 'cgv', '데이트', '공짜', '무료영화'],
    title: 'VIP/VVIP 초이스: CGV 무료 영화 티켓',
    url: 'https://www.uplus.co.kr/',
  },
  {
    id: '15',
    membership: 'LGU+',
    tags: ["ott", "넷플릭스", "디즈니", "유튜브", "티빙", "영화", "구독", "유독"],
    title: "LGU+ 유독: 넷플릭스/유튜브 프리미엄 무제한 구독 최대 20% 할인",
    url: "https://www.uplus.co.kr",
  },
  {
    id: '16',
    membership: 'SKT',
    tags: ["ott", "웨이브", "wavve", "넷플릭스", "유튜브", "우주패스", "구독", "드라마"],
    title: "T멤버십 우주패스: 넷플릭스 및 wavve 상시 추가 할인 혜택",
    url: "https://www.sktmembership.co.kr",
  },
  {
    id: '17',
    membership: 'KT',
    tags: ["ott", "디즈니", "디즈니플러스", "티빙", "넷플릭스", "지니뮤직", "초이스"],
    title: "KT 요금제 초이스: 티빙 / 디즈니+ / 넷플릭스 매달 초이스 무료 이용",
    url: "https://m.membership.kt.com",
  },
];

/**
 * Popular search tag chips
 */
const POPULAR_TAGS = [
  { key: 'hotel', label: '#호텔' },
  { key: 'car', label: '#차량' },
  { key: 'ott', label: '#OTT' },
  { key: 'movie', label: '#영화' },
  { key: 'manga', label: '#만화' },
];

/**
 * Map internal brand key → official display name
 */
const BRAND_KEY_TO_LABEL = {
  skt: 'SKT',
  kt: 'KT',
  lguplus: 'LGU+',
  naverplus: '네이버플러스',
  coupangwow: '쿠팡와우',
  toss: '토스',
};

function getBrandLabel(key) {
  return BRAND_KEY_TO_LABEL[key] || key;
}

/**
 * Reverse map: official membership name → brand key
 * Used for matching dataset membership names to onboarding keys
 */
const LABEL_TO_BRAND_KEY = Object.fromEntries(
  Object.entries(BRAND_KEY_TO_LABEL).map(([k, v]) => [v, k])
);

/* ═══════════════════════════════════════════════
 *  ASYNC STORAGE KEY
 * ═══════════════════════════════════════════════ */
const STORAGE_KEY_SAVED_AMOUNT = '@membership_app/saved_amount';

/* ═══════════════════════════════════════════════
 *  REWARD INCREMENT PER CLICK
 * ═══════════════════════════════════════════════ */
const REWARD_PER_CLICK = 10000;

/* ═══════════════════════════════════════════════
 *  MEMBERSHIP BADGE COLOR MAP
 * ═══════════════════════════════════════════════ */
const MEMBERSHIP_COLORS = {
  SKT: '#E60012',
  KT: '#000000',
  'LGU+': '#E6007E',
  '네이버플러스': '#03C75A',
  '쿠팡와우': '#E31837',
  '토스': '#0064FF',
};



/* ═══════════════════════════════════════════════
 *  BENEFIT CARD COMPONENT
 * ═══════════════════════════════════════════════ */
function BenefitCard({ item, onPressLink, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const badgeColor = MEMBERSHIP_COLORS[item.membership] || Colors.royalBlue;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 90,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.benefitCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Header: Membership dot + label */}
      <View style={styles.benefitCardHeader}>
        <View style={[styles.membershipDot, { backgroundColor: badgeColor }]} />
        <Text style={styles.membershipLabel}>{item.membership}</Text>
      </View>

      {/* Divider */}
      <View style={styles.benefitDivider} />

      {/* Title */}
      <Text style={styles.benefitTitle} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Premium Black CTA Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressLink(item)}
        style={styles.benefitCta}
      >
        <Text style={styles.benefitCtaText}>혜택 바로가기</Text>
        <Text style={styles.benefitCtaArrow}>→</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ═══════════════════════════════════════════════
 *  MAIN DASHBOARD SCREEN
 * ═══════════════════════════════════════════════ */
export default function DashboardScreen({ route }) {
  // Receive selected memberships from onboarding (array of brand keys)
  const selectedBrands = route?.params?.selectedBrands || [];

  // Convert brand keys to official display names for dataset matching
  const selectedMembershipLabels = useMemo(
    () => selectedBrands.map((key) => getBrandLabel(key)),
    [selectedBrands]
  );

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [savedAmount, setSavedAmount] = useState(0);
  const [activeTag, setActiveTag] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic API Fetch logic with Fallback
  useEffect(() => {
    async function fetchBenefits() {
      try {
        const response = await fetch('https://gist.githubusercontent.com/hanseo8/4d112a5616696c11f01b4bd76f1b8206/raw/b58a667a2f79d1a4953cd221ded94abdb28fb543/lgu%2520vip%2520benefits');
        if (!response.ok) throw new Error('API server returned error');
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.record || FALLBACK_BENEFITS_DATA);
        setBenefits(list);
      } catch (error) {
        console.warn('Network fetch failed, loading local fallback:', error);
        setBenefits(FALLBACK_BENEFITS_DATA);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBenefits();
  }, []);

  // Diagnosis logic:
  // Each brand is assumed to have a potential monthly saving value of 35,000 KRW
  const potentialSavings = useMemo(() => {
    return Math.max(50000, selectedBrands.length * 35000);
  }, [selectedBrands.length]);

  const defenseRate = useMemo(() => {
    if (savedAmount === 0) return 12; // Capped default to alert the user
    return Math.min(100, Math.round((savedAmount / potentialSavings) * 100));
  }, [savedAmount, potentialSavings]);

  const lostAmount = useMemo(() => {
    return Math.max(0, potentialSavings - savedAmount);
  }, [potentialSavings, savedAmount]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleShare = useCallback(() => {
    const shareText = `나 멤버십 본전도 못 뽑고 있었네ㅋㅋ 너네도 해봐: https://benefit-wallet.app/diagnose?rate=${defenseRate}`;
    if (Platform.OS === 'web' && navigator?.clipboard) {
      navigator.clipboard.writeText(shareText);
    } else {
      Clipboard.setString(shareText);
    }
    setShowToast(true);
  }, [defenseRate]);


  // Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const searchFade = useRef(new Animated.Value(0)).current;
  const searchSlide = useRef(new Animated.Value(20)).current;
  const tagAnims = useRef(
    POPULAR_TAGS.map(() => new Animated.Value(0))
  ).current;
  const searchBorderAnim = useRef(new Animated.Value(0)).current;
  const rewardPulse = useRef(new Animated.Value(1)).current;

  // Search input ref
  const searchInputRef = useRef(null);

  /* ── Load persisted savedAmount ── */
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_SAVED_AMOUNT);
        if (stored !== null) {
          setSavedAmount(parseInt(stored, 10));
        }
      } catch (e) {
        console.warn('AsyncStorage read error:', e);
      }
    })();
  }, []);

  /* ── Persist savedAmount whenever it changes ── */
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY_SAVED_AMOUNT,
          savedAmount.toString()
        );
      } catch (e) {
        console.warn('AsyncStorage write error:', e);
      }
    })();
  }, [savedAmount]);

  /* ── Entrance animations ── */
  useEffect(() => {
    // Header entrance
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Search bar entrance (delayed)
    Animated.parallel([
      Animated.timing(searchFade, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(searchSlide, {
        toValue: 0,
        friction: 8,
        tension: 80,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger tag chips
    const tagAnimations = tagAnims.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 80,
        delay: 400 + index * 70,
        useNativeDriver: true,
      })
    );
    Animated.stagger(0, tagAnimations).start();
  }, []);

  // Search focus border animation
  useEffect(() => {
    Animated.timing(searchBorderAnim, {
      toValue: isSearchFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSearchFocused]);

  /* ═══════════════════════════════════════════════
   *  2. MATCHING / FILTERING ENGINE
   * ═══════════════════════════════════════════════ */
  const filteredBenefits = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    if (rawQuery.length === 0) return null; // null = "no search yet"

    // Split query into individual tokens for multi-word support
    // e.g. "제주도 렌트" → ["제주도", "렌트"]
    const queryTokens = rawQuery
      .split(/\s+/)
      .filter((t) => t.length > 0);

    return benefits.filter((benefit) => {
      // 1) Must be in user's selected memberships
      const membershipMatch = selectedMembershipLabels.includes(
        benefit.membership
      );
      if (!membershipMatch) return false;

      // 2) Every query token must match either tags, title, or membership name (AND logic)
      //    Matching is bidirectional for tags, and checks inclusion for title and membership.
      const tagMatch = queryTokens.every((token) => {
        const inTags = benefit.tags.some((tag) => {
          const t = tag.toLowerCase();
          return t.includes(token) || token.includes(t);
        });
        const inTitle = benefit.title.toLowerCase().includes(token);
        const inMembership = benefit.membership.toLowerCase().includes(token);
        return inTags || inTitle || inMembership;
      });
      return tagMatch;
    });
  }, [searchQuery, selectedMembershipLabels, benefits]);

  /* ── Handlers ── */
  const handleTagPress = useCallback(
    (tag) => {
      const queryText = tag.label.replace('#', '');
      setSearchQuery(queryText);
      setActiveTag(tag.key === activeTag ? null : tag.key);
      searchInputRef.current?.focus();
    },
    [activeTag]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setActiveTag(null);
  }, []);

  /* ═══════════════════════════════════════════════
   *  3. OUTBOUND LINK + REWARD INCREMENT
   * ═══════════════════════════════════════════════ */
  const handleBenefitPress = useCallback(
    async (benefit) => {
      // Increment reward counter
      setSavedAmount((prev) => prev + REWARD_PER_CLICK);

      // Pulse animation on reward bar
      Animated.sequence([
        Animated.timing(rewardPulse, {
          toValue: 1.04,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(rewardPulse, {
          toValue: 1,
          friction: 4,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start();

      // Open external URL
      try {
        const supported = await Linking.canOpenURL(benefit.url);
        if (supported) {
          await Linking.openURL(benefit.url);
        }
      } catch (e) {
        console.warn('Linking error:', e);
      }
    },
    []
  );

  // Formatted saved amount
  const formattedAmount = savedAmount.toLocaleString('ko-KR');

  // Animated border color for search
  const searchBorderColor = searchBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.royalBlue],
  });

  /* ── Determine result state ── */
  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = filteredBenefits !== null && filteredBenefits.length > 0;
  const noResults = filteredBenefits !== null && filteredBenefits.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Reward Bar ─── */}
        <Animated.View
          style={[
            styles.rewardBar,
            {
              opacity: headerFade,
              transform: [
                { translateY: headerSlide },
                { scale: rewardPulse },
              ],
            },
          ]}
        >
          <View style={styles.rewardContent}>
            <Text style={styles.rewardLabel}>이번 달 방어한 지출</Text>
            <View style={styles.rewardAmountRow}>
              <Text style={styles.rewardAmount}>{formattedAmount}</Text>
              <Text style={styles.rewardUnit}>원</Text>
            </View>
          </View>
          <View style={styles.rewardIconContainer}>
            <Text style={styles.rewardIcon}>🛡️</Text>
          </View>
        </Animated.View>

        {/* ─── Diagnosis Entrance Button ─── */}
        <Animated.View style={{ opacity: headerFade, transform: [{ translateY: headerSlide }], marginBottom: Spacing.lg }}>
          <TouchableOpacity
            style={styles.diagnosisEntry}
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.diagnosisEntryText}>내 혜택 방어율 진단하기 ➔</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ─── Selected Membership Badges ─── */}
        {selectedBrands.length > 0 && (
          <Animated.View
            style={[
              styles.badgeRow,
              {
                opacity: headerFade,
                transform: [{ translateY: headerSlide }],
              },
            ]}
          >
            <Text style={styles.badgeLabel}>선택된 멤버십</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgeScroll}
            >
              {selectedBrands.map((brand) => {
                const dotColor = MEMBERSHIP_COLORS[getBrandLabel(brand)] || Colors.royalBlue;
                return (
                  <View key={brand} style={styles.badge}>
                    <View style={[styles.badgeDot, { backgroundColor: dotColor }]} />
                    <Text style={styles.badgeText}>
                      {getBrandLabel(brand)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* ─── Search Section ─── */}
        <Animated.View
          style={[
            styles.searchSection,
            {
              opacity: searchFade,
              transform: [{ translateY: searchSlide }],
            },
          ]}
        >
          <Text style={styles.searchTitle}>무엇을 찾고 계세요?</Text>

          {/* Search Input */}
          <Animated.View
            style={[
              styles.searchContainer,
              {
                borderColor: searchBorderColor,
              },
            ]}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="호텔, 차량, 만화 등 목적을 검색하세요"
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setActiveTag(null);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* ─── Popular Tag Chips ─── */}
          <View style={styles.tagSection}>
            <Text style={styles.tagSectionTitle}>인기 검색</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagList}
            >
              {POPULAR_TAGS.map((tag, index) => {
                const isTagActive = activeTag === tag.key;
                const scale = tagAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                });

                return (
                  <Animated.View
                    key={tag.key}
                    style={{
                      opacity: tagAnims[index],
                      transform: [{ scale }],
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleTagPress(tag)}
                      style={[
                        styles.tagChip,
                        isTagActive && styles.tagChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          isTagActive && styles.tagTextActive,
                        ]}
                      >
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>

        {/* ═══════════════════════════════════════════
         *  RESULTS AREA
         * ═══════════════════════════════════════════ */}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.royalBlue} />
            <Text style={styles.loadingText}>혜택 데이터를 불러오는 중...</Text>
          </View>
        ) : (
          <>
            {/* State A: No search query yet → Guide prompt */}
            {!hasQuery && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💡</Text>
                <Text style={styles.emptyTitle}>혜택을 검색해 보세요</Text>
                <Text style={styles.emptySubtitle}>
                  가입한 멤버십에서 받을 수 있는{'\n'}최적의 혜택을 찾아드릴게요
                </Text>
              </View>
            )}

            {/* State B: Query exists but no matches */}
            {noResults && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔎</Text>
                <Text style={styles.emptyTitle}>관련 혜택이 없습니다</Text>
                <Text style={styles.emptySubtitle}>
                  현재 보유하신 멤버십에는{'\n'}관련 혜택이 없습니다
                </Text>
              </View>
            )}

            {/* State C: Matching results */}
            {hasResults && (
              <View style={styles.resultsSection}>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsSectionTitle}>
                    매칭된 혜택
                  </Text>
                  <View style={styles.resultsCount}>
                    <Text style={styles.resultsCountText}>
                      {filteredBenefits.length}건
                    </Text>
                  </View>
                </View>
                {filteredBenefits.map((benefit, index) => (
                  <BenefitCard
                    key={benefit.id}
                    item={benefit}
                    index={index}
                    onPressLink={handleBenefitPress}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* Bottom padding for scroll */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* ─── Diagnosis Result Modal ─── */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <Text style={styles.modalTitle}>
              회원님의 현재 멤버십{'\n'}방어율은{' '}
              <Text style={styles.modalTitleAccent}>{defenseRate}%</Text>입니다.
            </Text>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                매달 약 <Text style={styles.modalTextHighlight}>{lostAmount.toLocaleString('ko-KR')}원</Text>의 숨은 권리와 혜택을 땅에 버리고 계시네요! 조금 더 분발해서 지갑을 지키세요.
              </Text>
            </View>

            {/* Copy Toast Message Feedback */}
            {showToast && (
              <View style={styles.toastContainer}>
                <Text style={styles.toastText}>📋 링크가 클립보드에 복사되었습니다!</Text>
              </View>
            )}

            {/* Modal Footer / Buttons */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                activeOpacity={0.85}
              >
                <Text style={styles.shareButtonText}>내 방어율 링크 공유하기 🔗</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>진단 결과 닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════════════════
 *  STYLES
 * ═══════════════════════════════════════════════ */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },

  /* ── Reward Bar — clean, elevated ── */
  rewardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.lg + 4,
    paddingHorizontal: Spacing.lg,
    marginTop: Platform.OS === 'android' ? Spacing.xxl : Spacing.lg + 8,
    marginBottom: Spacing.lg,
  },
  rewardContent: {
    flex: 1,
  },
  rewardLabel: {
    ...Typography.label,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs + 2,
  },
  rewardAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rewardAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1.2,
  },
  rewardUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 4,
    letterSpacing: -0.3,
  },
  rewardIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIcon: {
    fontSize: 22,
  },

  /* ── Membership Badges — subtle pills ── */
  badgeRow: {
    marginBottom: Spacing.lg + 4,
  },
  badgeLabel: {
    ...Typography.label,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm + 2,
  },
  badgeScroll: {
    gap: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.xs + 3,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs + 2,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  /* ── Search Section ── */
  searchSection: {
    marginBottom: Spacing.sm,
  },
  searchTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    marginBottom: Spacing.md + 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md + 2,
    height: 54,
    marginBottom: Spacing.lg,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm + 4,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '400',
    letterSpacing: -0.2,
    height: '100%',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  clearButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  clearIcon: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
  },

  /* ── Tag Chips — minimal capsules ── */
  tagSection: {},
  tagSectionTitle: {
    ...Typography.label,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm + 4,
  },
  tagList: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  tagChip: {
    paddingVertical: Spacing.sm + 3,
    paddingHorizontal: Spacing.md + 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  tagChipActive: {
    backgroundColor: Colors.accentBlack,
    borderColor: Colors.accentBlack,
  },
  tagText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tagTextActive: {
    color: Colors.white,
  },

  /* ── Empty State ── */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: Spacing.md,
    opacity: 0.8,
  },
  emptyTitle: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs + 2,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* ── Results Section ── */
  resultsSection: {
    marginTop: Spacing.lg + 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md + 4,
  },
  resultsSectionTitle: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resultsCount: {
    marginLeft: Spacing.sm,
    backgroundColor: Colors.accentBlack,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  resultsCountText: {
    ...Typography.label,
    color: Colors.white,
    fontWeight: '800',
  },

  /* ── Benefit Card — premium minimal ── */
  benefitCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  benefitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membershipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  membershipLabel: {
    ...Typography.label,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  benefitDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 24,
    letterSpacing: -0.3,
    marginBottom: Spacing.lg,
  },
  benefitCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentBlack,
    paddingVertical: Spacing.sm + 5,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  benefitCtaText: {
    ...Typography.buttonSmall,
    color: Colors.white,
  },
  benefitCtaArrow: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  /* ── Diagnosis & Modal Styles ── */
  diagnosisEntry: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagnosisEntryText: {
    ...Typography.buttonSmall,
    color: Colors.royalBlue,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 17, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  modalTitleAccent: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.royalBlue,
  },
  modalBody: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  modalText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  modalTextHighlight: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalFooter: {
    gap: Spacing.sm,
    width: '100%',
  },
  shareButton: {
    backgroundColor: Colors.accentBlack,
    height: 54,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  shareButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  closeButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  closeButtonText: {
    ...Typography.buttonSmall,
    color: Colors.textTertiary,
  },
  toastContainer: {
    backgroundColor: Colors.royalBlueLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.royalBlueMuted,
    marginBottom: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.royalBlue,
  },
  /* ── Loading Spinner Styles ── */
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.md,
  },

  /* ── Carrier Selection Grid (Glassmorphism) ── */
  carrierSection: {
    marginBottom: Spacing.lg + 4,
  },
  carrierSectionTitle: {
    ...Typography.label,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm + 4,
  },
  carrierGrid: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  carrierCardTouchable: {
    flex: 1,
  },
  carrierCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: Spacing.lg + 2,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 104,
  },
  carrierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: Spacing.sm + 2,
  },
  carrierLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  carrierSub: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textTertiary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  /* ── Grade Accordion Pills ── */
  gradeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md + 2,
    justifyContent: 'center',
  },
  gradeChip: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md + 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  gradeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  gradeChipTextActive: {
    color: Colors.white,
  },
});
