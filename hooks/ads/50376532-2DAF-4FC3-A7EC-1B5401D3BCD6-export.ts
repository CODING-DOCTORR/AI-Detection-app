import { useAppSelector } from '@/store/hooks';
import {
    PlacementConfig,
    selectAdsConfig,
    selectAdsConfigError,
    selectAdsConfigLoading,
    selectPlacementValue,
    selectPlatformAdsConfig,
    selectShouldShowAd
} from '@/store/slices/adsConfigSlice';
import { Platform } from 'react-native';

export const useAdsConfig = () => {
  const config = useAppSelector(selectAdsConfig);
  const loading = useAppSelector(selectAdsConfigLoading);
  const error = useAppSelector(selectAdsConfigError);
  const platformConfig = useAppSelector(selectPlatformAdsConfig);

  const getAdUnitId = (adType: 'banner' | 'interstitial' | 'rewarded' | 'native' | 'appOpen'): string | undefined => {
    if (!platformConfig) return undefined;
    
    switch (adType) {
      case 'banner':
        return platformConfig.bannerAdId;
      case 'interstitial':
        return platformConfig.interstitialAdId;
      case 'rewarded':
        return platformConfig.rewardedAdId;
      case 'native':
        return platformConfig.nativeAdId;
      case 'appOpen':
        return platformConfig.appOpenAdId;
      default:
        return undefined;
    }
  };

  const getPlacementValue = (placementKey: keyof PlacementConfig): number => {
    return useAppSelector(selectPlacementValue(placementKey));
  };

  const shouldShowAd = (placementKey: keyof PlacementConfig): boolean => {
    return useAppSelector(selectShouldShowAd(placementKey));
  };

  const isConfigReady = () => {
    return !loading && !error && config !== null;
  };

  return {
    config,
    platformConfig,
    loading,
    error,
    getAdUnitId,
    getPlacementValue,
    shouldShowAd,
    isConfigReady,
    platform: Platform.OS,
  };
};
