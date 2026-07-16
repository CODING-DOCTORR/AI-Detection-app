import { useAdManager } from '@/contexts/AdManagerContext';
import { useConsent } from '@/contexts/ConsentContext';
import { useInterstitialTracking } from '@/contexts/InterstitialTrackingContext';
import { selectPlacementValue } from '@/store/slices/adsConfigSlice';
import * as crashMonitor from '@/services/crashMonitor';
import { useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

/**
 * Shows an interstitial ad after the user opens Send, Receive, or Clean
 * screens N times (N = Screen_Open_Count from Firebase, default 3).
 * Controlled by Screen_Open_Interstitial (1 = on, 0 = off).
 *
 * Usage:
 *   const { handleScreenOpen } = useScreenOpenInterstitialAd();
 *   // call handleScreenOpen('send') before navigating
 */
export const useScreenOpenInterstitialAd = () => {
  const { trackInterstitialDismissed } = useInterstitialTracking();
  const { showAd } = useAdManager();
  const { canShowAds, isConsentFormVisible, isInitialized } = useConsent();

  const placementEnabled = useSelector(
    selectPlacementValue('Screen_Open_Interstitial' as any)
  );
  const countThreshold = useSelector(
    selectPlacementValue('Screen_Open_Count' as any)
  );

  // Persisted counter across renders without causing re-renders itself
  const openCountRef = useRef(0);

  const threshold = useMemo(
    () => (countThreshold && Number(countThreshold) > 0 ? Number(countThreshold) : 3),
    [countThreshold]
  );

  const isEnabled = useMemo(() => placementEnabled === 1, [placementEnabled]);

  /**
   * Call this every time the user opens Send, Receive, or Clean.
   * `onNavigate` is the navigation callback that fires after the ad closes
   * (or immediately if the ad is disabled / not ready).
   */
  const handleScreenOpen = useCallback(
    (screenName: string, onNavigate: () => void) => {
      // Ads-allowed gate (everything except readiness).
      const adsAllowed =
        isEnabled && isInitialized && !isConsentFormVisible && canShowAds();

      if (!adsAllowed) {
        onNavigate();
        return;
      }

      openCountRef.current += 1;
      console.log(
        `📊 ScreenOpen: ${screenName} — count ${openCountRef.current}/${threshold}`
      );

      if (openCountRef.current >= threshold) {
        openCountRef.current = 0;
        console.log(`🎯 ScreenOpen: threshold reached, showing interstitial`);
        crashMonitor.setCrashKey('showing_interstitial', 'Screen_Open_Interstitial');
        crashMonitor.crashLog('interstitial_show Screen_Open_Interstitial');
        showAd('Screen_Open_Interstitial', () => {
          crashMonitor.setCrashKey('showing_interstitial', 'none');
          trackInterstitialDismissed();
          onNavigate();
        });
      } else {
        onNavigate();
      }
    },
    [
      isEnabled,
      isInitialized,
      isConsentFormVisible,
      canShowAds,
      threshold,
      showAd,
      trackInterstitialDismissed,
    ]
  );

  return { handleScreenOpen };
};

export default useScreenOpenInterstitialAd;
