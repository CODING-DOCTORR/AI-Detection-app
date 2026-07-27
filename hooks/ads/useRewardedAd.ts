// hooks/ads/useRewardedAd.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import { RewardedAdId } from '../../services/adsConfig';
import { useAppInitialization } from '../../contexts/AppInitializationContext';

interface UseRewardedAdReturn {
    loaded: boolean;
    loading: boolean;
    showAd: () => Promise<{ earned: boolean; error?: string }>;
    reload: () => void;
}

export const useRewardedAd = (): UseRewardedAdReturn => {
    const { canCreateAds } = useAppInitialization();
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const rewardedRef = useRef<RewardedAd | null>(null);
    const listenersRef = useRef<(() => void)[]>([]);

    const cleanup = useCallback(() => {
        listenersRef.current.forEach((remove) => remove());
        listenersRef.current = [];
    }, []);

    const loadAd = useCallback(() => {
        if (!canCreateAds) {
            console.log('🎁 Cannot load rewarded ad: SDK not ready');
            return;
        }

        cleanup();
        setLoading(true);
        setLoaded(false);

        const ad = RewardedAd.createForAdRequest(RewardedAdId, {
            requestNonPersonalizedAdsOnly: false,
        });

        const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
            console.log('🎁 Rewarded ad loaded');
            setLoaded(true);
            setLoading(false);
        });

        const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
            console.log('🎁 Rewarded ad error:', error);
            setLoaded(false);
            setLoading(false);
        });

        listenersRef.current = [unsubLoaded, unsubError];
        rewardedRef.current = ad;
        ad.load();
    }, [canCreateAds, cleanup]);

    // Load ad on mount + when SDK becomes ready
    useEffect(() => {
        if (canCreateAds) {
            loadAd();
        }
        return cleanup;
    }, [canCreateAds, loadAd, cleanup]);

    const showAd = useCallback((): Promise<{ earned: boolean; error?: string }> => {
        return new Promise((resolve) => {
            const ad = rewardedRef.current;

            if (!ad || !loaded) {
                console.log('🎁 Rewarded ad not ready, attempting to load...');
                loadAd();
                resolve({ earned: false, error: 'Ad not ready. Please try again in a moment.' });
                return;
            }

            let earned = false;

            const unsubEarned = ad.addAdEventListener(
                RewardedAdEventType.EARNED_REWARD,
                (reward) => {
                    console.log('🎁 User earned reward:', reward);
                    earned = true;
                }
            );

            const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
                console.log('🎁 Rewarded ad closed. Earned:', earned);
                unsubEarned();
                unsubClosed();
                unsubShowError();
                setLoaded(false);
                loadAd(); // Preload next ad
                resolve({ earned });
            });

            const unsubShowError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
                console.log('🎁 Rewarded ad show error:', error);
                unsubEarned();
                unsubClosed();
                unsubShowError();
                setLoaded(false);
                loadAd();
                resolve({ earned: false, error: String(error) });
            });

            ad.show();
        });
    }, [loaded, loadAd]);

    return {
        loaded,
        loading,
        showAd,
        reload: loadAd,
    };
};