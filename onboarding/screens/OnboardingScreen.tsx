import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import { COLORS, ONBOARDING_SLIDES } from '../constants/onboarding';
import { PaginationDots } from '../components/PaginationDots';
import { PrimaryButton } from '../components/PrimaryButton';
import { Slide1 } from '../components/slides/Slide1';
import { Slide2 } from '../components/slides/Slide2';
import { Slide3 } from '../components/slides/Slide3';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL = ONBOARDING_SLIDES.length;

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  
  const goToNext = useCallback(() => {
    if (activeIndex < TOTAL - 1) {
      const next = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      setActiveIndex(next);
    } else {
      onComplete();
    }
  }, [activeIndex, onComplete]);

  const handleSkip = useCallback(() => onComplete(), [onComplete]);

 
  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (index !== activeIndex) setActiveIndex(index);
    },
    [activeIndex],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Skip button — only on first screen */}
        {/* {activeIndex === 0 && (
          <View style={styles.skipRow}>
            <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        )} */}

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={32}
          disableIntervalMomentum
          decelerationRate="fast"
          bounces={false}
          removeClippedSubviews={false} // ✅ false — image rendering fix for Android
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ✅ Fix: Correct slide order — Slide1, Slide2, Slide3 */}
          <View style={styles.slide}><Slide1 /></View>
          <View style={styles.slide}><Slide3 onSkip={handleSkip} /></View>
          <View style={styles.slide}><Slide2  /></View>
        </ScrollView>

        {/* Bottom controls */}
        <View style={styles.bottomSection}>
          <PaginationDots total={TOTAL} activeIndex={activeIndex} />

          {/* ✅ Fix: button label directly from index — not from currentSlide object */}
          <PrimaryButton
            label={
              activeIndex === TOTAL - 1 ? 'Get Started' : 'Next'
            }
            onPress={goToNext}
          />

          {/* {activeIndex === 0 && (
            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.7}
              style={styles.skipLabelBtn}
            >
              <Text style={styles.skipLabelText}>Skip Introduction</Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea:     { flex: 1, backgroundColor: COLORS.background },
  container:    { flex: 1, backgroundColor: COLORS.background },
  skipRow:      { paddingHorizontal: 24, paddingTop: 8, alignItems: 'flex-end' },
  skipBtn:      { padding: 8 },
  skipText:     { color: COLORS.textMuted, fontSize: 15, fontWeight: '600' },
  scrollView:   { flex: 1 },
  // ✅ Fix: width extracted to style — no inline object creation on re-render
  scrollContent: { width: SCREEN_WIDTH * TOTAL },
  slide:         { width: SCREEN_WIDTH },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 16 },
  skipLabelBtn:  { marginTop: 16, alignItems: 'center' },
  skipLabelText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '500' },
});