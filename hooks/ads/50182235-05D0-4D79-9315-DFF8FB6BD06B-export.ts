import { useAdManager } from '@/contexts/AdManagerContext';
import { useConsent } from '@/contexts/ConsentContext';
import { selectPlacementValue } from '@/store/slices/adsConfigSlice';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useInterstitialAd = (onAdClosed: () => void, placement?: string) => {
  const { showAd } = useAdManager();
  const { canShowAds, isInitialized, isConsentFormVisible } = useConsent();

  // Get placement value using the same logic as AdComponent
  const placementValue = useSelector(selectPlacementValue(placement as any));

  // Memoize placement enabled check to prevent unnecessary re-computations
  const isPlacementEnabled = useMemo((): boolean => {
    if (!placement) {
      return true;
    }

    const isEnabled = placementValue === 1;
    return isEnabled;
  }, [placement, placementValue]);

  const showInterstitialAd = useCallback(() => {
    if (!placement) {
      console.warn("No placement specified for interstitial ad");
      onAdClosed?.();
      return;
    }

    if (!isPlacementEnabled) {
      console.log(`Interstitial ad placement "${placement}" is disabled`);
      onAdClosed?.();
      return;
    }

    // Don't show ad if consent is not ready
    if (!isInitialized || isConsentFormVisible || !canShowAds()) {
      console.log('Consent not ready, cannot show interstitial ad');
      onAdClosed?.();
      return;
    }

    console.log(`📺 Interstitial Ad: Showing ad for placement: ${placement}`);
    // showAd loads on-demand behind the Lottie loader and runs the callback
    // when the ad closes (or immediately if no ad can be shown).
    showAd(placement, () => {
      console.log('✅ Interstitial Ad: Ad closed');
      onAdClosed?.();
    });
  }, [
    placement,
    isPlacementEnabled,
    isInitialized,
    isConsentFormVisible,
    canShowAds,
    showAd,
    onAdClosed,
  ]);

  return {
    showAd: showInterstitialAd,
    isLoadingAd: false,
    isShowingAd: false,
    loaded: false,
    isPlacementEnabled: isPlacementEnabled,
  };
};

export default useInterstitialAd;
