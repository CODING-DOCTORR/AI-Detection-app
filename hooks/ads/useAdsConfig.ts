// hooks/ads/useAdsConfig.ts
import { useAppSelector } from '../../store/hooks';
import {
    selectPlatformAdsConfig,
    selectPlacementValue,
    selectShouldShowAd,
} from '../../store/slices/adsConfigSlice';

export const useAdsConfig = () => {
    const platformConfig = useAppSelector(selectPlatformAdsConfig);

    return {
        bannerAdId: platformConfig.bannerAdId,
        interstitialAdId: platformConfig.interstitialAdId,
        nativeAdId: platformConfig.nativeAdId,
        appOpenAdId: platformConfig.appOpenAdId,
        rewardedAdId: platformConfig.rewardedAdId,
        getPlacementValue: (key: string) => platformConfig.placements[key] ?? 0,
    };
};