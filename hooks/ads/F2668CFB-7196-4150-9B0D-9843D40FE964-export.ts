import { useAdManager } from '@/contexts/AdManagerContext';
import { useConsent } from '@/contexts/ConsentContext';
import { useInterstitialTracking } from '@/contexts/InterstitialTrackingContext';
import { selectPlacementValue } from '@/store/slices/adsConfigSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

interface UseBottomTabInterstitialAdOptions {
  placement?: string;
  countKey?: string;
  defaultCount?: number;
  cooldownKey?: string;
  defaultCooldownSeconds?: number;
  enabled?: boolean;
}

interface UseBottomTabInterstitialAdReturn {
  handleTabPress: (tabName: string) => Promise<void>;
  tabClickCount: number;
  currentTab: string | null;
  resetCounter: () => void;
  showInterstitial: (adType?: string) => Promise<boolean>;
  isShowingAd: boolean;
  isPlacementEnabled: boolean;
  isInCooldown: boolean;
  cooldownRemainingSeconds: number;
}

/**
 * Hook for showing interstitial ads based on tab navigation count
 * 
 * @example
 * ```tsx
 * const { handleTabPress, tabClickCount } = useBottomTabInterstitialAd({
 *   placement: 'Bottom_Tab_Interstitial',
 *   countKey: 'Bottom_Tab_Count',
 *   defaultCount: 3
 * });
 * 
 * // In your tab navigator
 * <Tab.Screen 
 *   listeners={{
 *     tabPress: () => handleTabPress('Home')
 *   }}
 * />
 * ```
 */
export const useBottomTabInterstitialAd = (
  options?: UseBottomTabInterstitialAdOptions
): UseBottomTabInterstitialAdReturn => {
  const {
    placement = 'Bottom_Tab_Interstitial',
    countKey = 'Bottom_Tab_Count',
    defaultCount = 3,
    cooldownKey = 'Bottom_Tab_Cooldown',
    defaultCooldownSeconds = 2,
    enabled = true,
  } = options || {};

  const { trackInterstitialDismissed } = useInterstitialTracking();
  const { showAd } = useAdManager();
  const { canShowAds, isConsentFormVisible, isInitialized } = useConsent();
  
  const [tabClickCount, setTabClickCount] = useState(0);
  const [currentTab, setCurrentTab] = useState<string | null>(null);
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

  const showInterstitial = useCallback(async (adType: string = 'bottom_tab'): Promise<boolean> => {
    // Don't show ad if placement is disabled
    if (!isPlacementEnabled) {
      console.log(`🚫 Bottom Tab Ad: Placement "${placement}" is disabled`);
      return false;
    }

    // Don't show ad if consent is not ready
    if (!isInitialized || isConsentFormVisible || !canShowAds()) {
      console.log('🚫 Bottom Tab Ad: Consent not ready or ads not allowed');
      return false;
    }

    if (isShowingAd) {
      console.log('🚫 Bottom Tab Ad: Already showing');
      return false;
    }

    try {
      setIsShowingAd(true);
      console.log(`📺 Bottom Tab Ad: Showing ${adType} interstitial ad`);

      // showAd loads the interstitial on-demand behind the Lottie loader and
      // invokes the callback once it closes (or immediately if no ad shows).
      showAd(placement, () => {
        console.log('✅ Bottom Tab Ad: Ad closed');
        setIsShowingAd(false);
        
        // Track dismissal for cooldown (prevents app open ad from showing immediately)
        trackInterstitialDismissed();

        // Start cooldown period - don't count tab presses for cooldown duration
        const endTime = Date.now() + cooldownDurationMs;
        setCooldownEndTime(endTime);
        console.log(`⏰ Bottom Tab: Starting cooldown for ${cooldownDurationMs / 1000} seconds`);
      });

      return true;
    } catch (error) {
      console.error('❌ Bottom Tab Ad: Error showing ad:', error);
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

  const handleTabPress = useCallback(async (tabName: string) => {
    console.log(`🔄 Bottom Tab: Tab pressed - ${tabName}`);

    // Don't count if we're in cooldown
    if (isInCooldown) {
      console.log(`⏳ Bottom Tab: In cooldown (${cooldownRemainingSeconds}s remaining), ignoring tab press`);
      return;
    }

    // Only increment counter if switching to a different tab
    if (currentTab !== tabName) {
      const newCount = tabClickCount + 1;
      setTabClickCount(newCount);
      setCurrentTab(tabName);

      console.log(`📊 Bottom Tab: Switch count ${newCount}/${countThreshold} (to: ${tabName})`);

      // Show ad on every Nth tab switch
      if (newCount >= countThreshold) {
        console.log(`🎯 Bottom Tab: Threshold reached (${newCount}/${countThreshold}), attempting to show ad...`);

        const adShown = await showInterstitial('bottom_tab');

        // Always reset the counter — keeping it caused a cascading reload
        // storm where every subsequent tab switch retried the preload.
        // showInterstitial() already triggers a fresh preload on miss.
        setTabClickCount(0);
        console.log(
          adShown
            ? '✅ Bottom Tab: Ad shown, counter reset'
            : '⚠️ Bottom Tab: Ad not ready, counter reset, fresh preload queued'
        );
      }
    } else {
      console.log(`⏭️ Bottom Tab: Same tab clicked (${tabName}), no counter increment`);
    }
  }, [tabClickCount, currentTab, showInterstitial, countThreshold, isInCooldown, cooldownRemainingSeconds]);

  const resetCounter = useCallback(() => {
    console.log('🔄 Bottom Tab: Resetting counter');
    setTabClickCount(0);
    setCurrentTab(null);
    setCooldownEndTime(null);
  }, []);

  // Reset counter when ad is shown from other sources
  useEffect(() => {
    if (isShowingAd) {
      console.log('📺 Bottom Tab: Ad is showing from another source');
    }
  }, [isShowingAd]);

  return {
    handleTabPress,
    tabClickCount,
    currentTab,
    resetCounter,
    showInterstitial,
    isShowingAd,
    isPlacementEnabled: isPlacementEnabled,
    isInCooldown,
    cooldownRemainingSeconds,
  };
};

export default useBottomTabInterstitialAd;
