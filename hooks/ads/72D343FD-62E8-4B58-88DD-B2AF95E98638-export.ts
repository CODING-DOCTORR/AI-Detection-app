import { useAdManager } from '@/contexts/AdManagerContext';
import { useConsent } from '@/contexts/ConsentContext';
import { useInterstitialTracking } from '@/contexts/InterstitialTrackingContext';
import { selectPlacementValue } from '@/store/slices/adsConfigSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

interface UseButtonInterstitialAdOptions {
  placement?: string;
  countKey?: string;
  defaultCount?: number;
  cooldownKey?: string;
  defaultCooldownSeconds?: number;
  enabled?: boolean;
}

interface UseButtonInterstitialAdReturn {
  handleButtonPress: (onPress: () => void) => Promise<void>;
  buttonClickCount: number;
  showInterstitial: (adType?: string) => Promise<boolean>;
  isShowingAd: boolean;
  isPlacementEnabled: boolean;
  isInCooldown: boolean;
  cooldownRemainingSeconds: number;
  resetCounter: () => void;
}

/**
 * Hook for showing interstitial ads based on button click count
 * 
 * @example
 * ```tsx
 * const { handleButtonPress } = useButtonInterstitialAd({
 *   placement: 'Home_To_Send_Interstitial',
 *   countKey: 'Home_Button_Count',
 *   defaultCount: 3
 * });
 * 
 * <TouchableOpacity onPress={() => handleButtonPress(() => router.push('/sendFlow'))}>
 *   <Text>Send</Text>
 * </TouchableOpacity>
 * ```
 */
export const useButtonInterstitialAd = (
  options?: UseButtonInterstitialAdOptions
): UseButtonInterstitialAdReturn => {
  const {
    placement = '',
    countKey = 'Home_Button_Count',
    defaultCount = 3,
    cooldownKey = 'Home_Button_Cooldown',
    defaultCooldownSeconds = 2,
    enabled = true,
  } = options || {};

  const { trackInterstitialDismissed } = useInterstitialTracking();
  const { showAd } = useAdManager();
  const { canShowAds, isConsentFormVisible, isInitialized } = useConsent();
  
  const [buttonClickCount, setButtonClickCount] = useState(0);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);
  const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState(0);

  // Get placement values using the same logic as AdComponent
  const placementValue = useSelector(selectPlacementValue(placement as any));
  const countValue = useSelector(selectPlacementValue(countKey as any));
  const cooldownValue = useSelector(selectPlacementValue(cooldownKey as any));

  // Memoize placement enabled check to prevent unnecessary re-computations
  const isPlacementEnabled = useMemo((): boolean => {
    if (!enabled) {
      return false;
    }

    if (!placement) {
      return true;
    }

    const isEnabled = placementValue === 1;
    return isEnabled;
  }, [placement, placementValue, enabled]);

  // Memoize count threshold to prevent unnecessary re-computations
  const countThreshold = useMemo((): number => {
    const count = countValue || defaultCount;
    return count;
  }, [countValue, countKey, defaultCount]);

  // Memoize cooldown duration in milliseconds
  const cooldownDurationMs = useMemo((): number => {
    const cooldownSeconds = cooldownValue || defaultCooldownSeconds;
    return cooldownSeconds * 1000; // Convert to milliseconds
  }, [cooldownValue, cooldownKey, defaultCooldownSeconds]);

  // Update cooldown remaining seconds every second while in cooldown
  useEffect(() => {
    if (!cooldownEndTime) {
      setCooldownRemainingSeconds(0);
      return;
    }

    // Calculate initial remaining time
    const updateRemaining = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((cooldownEndTime - now) / 1000));
      setCooldownRemainingSeconds(remaining);

      // Clear cooldown if expired
      if (remaining <= 0) {
        setCooldownEndTime(null);
      }
    };

    // Update immediately
    updateRemaining();

    // Update every second while in cooldown
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [cooldownEndTime]);

  // Calculate if we're in cooldown based on remaining seconds
  const isInCooldown = useMemo((): boolean => {
    return cooldownRemainingSeconds > 0;
  }, [cooldownRemainingSeconds]);

  const showInterstitial = useCallback(async (adType: string = 'button', onAdClosed?: () => void): Promise<boolean> => {
    // Don't show ad if placement is disabled
    if (!isPlacementEnabled) {
      console.log(`🚫 Button Ad: Placement "${placement}" is disabled`);
      return false;
    }

    // Don't show ad if consent is not ready
    if (!isInitialized || isConsentFormVisible || !canShowAds()) {
      console.log('🚫 Button Ad: Consent not ready or ads not allowed');
      return false;
    }

    if (isShowingAd) {
      console.log('🚫 Button Ad: Already showing');
      return false;
    }

    try {
      setIsShowingAd(true);
      console.log(`📺 Button Ad: Showing ${adType} interstitial ad`);

      // showAd loads on-demand behind the Lottie loader and runs the callback
      // when the ad closes (or immediately if no ad can be shown).
      showAd(placement, () => {
        console.log('✅ Button Ad: Ad closed');
        setIsShowingAd(false);
        
        // Track dismissal for cooldown (prevents app open ad from showing immediately)
        trackInterstitialDismissed();

        // Start cooldown period - don't count button presses for cooldown duration
        const endTime = Date.now() + cooldownDurationMs;
        setCooldownEndTime(endTime);
        console.log(`⏰ Button: Starting cooldown for ${cooldownDurationMs / 1000} seconds`);
        
        // Call the onAdClosed callback if provided
        onAdClosed?.();
      });

      return true;
    } catch (error) {
      console.error('❌ Button Ad: Error showing ad:', error);
      setIsShowingAd(false);
      return false;
    }
  }, [
    isPlacementEnabled,
    isInitialized,
    isConsentFormVisible,
    canShowAds,
    isShowingAd,
    placement,
    showAd,
    trackInterstitialDismissed,
    cooldownDurationMs,
  ]);

  const handleButtonPress = useCallback(async (onPress: () => void) => {
    console.log(`🔄 Button: Button pressed`);

    // Don't count if we're in cooldown
    if (isInCooldown) {
      console.log(`⏳ Button: In cooldown (${cooldownRemainingSeconds}s remaining), executing action without counting`);
      onPress();
      return;
    }

    // Increment counter
    const newCount = buttonClickCount + 1;
    setButtonClickCount(newCount);

    console.log(`📊 Button: Click count ${newCount}/${countThreshold}`);

    // Show ad on every Nth button click
    if (newCount >= countThreshold) {
      console.log(`🎯 Button: Threshold reached (${newCount}/${countThreshold}), attempting to show ad...`);

      const adShown = await showInterstitial('button', onPress);

      // Always reset the counter — keeping it on miss caused every
      // subsequent click to re-trigger a preload. showInterstitial()
      // already queues a fresh preload when the ad wasn't ready.
      setButtonClickCount(0);

      if (adShown) {
        console.log('✅ Button: Ad shown, counter reset');
        // onPress is invoked from the showInterstitial callback when the ad closes.
        return;
      }
      console.log('⚠️ Button: Ad not ready, counter reset, fresh preload queued');
      onPress();
    } else {
      // Execute action normally if threshold not reached
      onPress();
    }
  }, [buttonClickCount, showInterstitial, countThreshold, isInCooldown, cooldownRemainingSeconds]);

  const resetCounter = useCallback(() => {
    console.log('🔄 Button: Resetting counter');
    setButtonClickCount(0);
    setCooldownEndTime(null);
  }, []);

  return {
    handleButtonPress,
    buttonClickCount,
    showInterstitial,
    isShowingAd,
    isPlacementEnabled: isPlacementEnabled,
    isInCooldown,
    cooldownRemainingSeconds,
    resetCounter,
  };
};

export default useButtonInterstitialAd;

