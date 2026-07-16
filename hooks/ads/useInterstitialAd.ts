// hooks/ads/useInterstitialAd.ts
import { useCallback, useState } from 'react';
import { useAdManager } from '../../contexts/AdManagerContext';
import { useAppSelector } from '../../store/hooks';
import { selectIsProActive } from '../../store/slices/appPreferencesSlice';

export const useInterstitialAd = () => {
    const { showAd } = useAdManager();
    const [isAdLoading, setIsAdLoading] = useState(false);
    const isPro = useAppSelector(selectIsProActive);

    const show = useCallback(async (): Promise<boolean> => {
        if (isPro) return false;
        setIsAdLoading(true);
        try {
            // Pass a placement string since your AdManagerContext requires it
            const result = await showAd('interstitial');
            return !!result;
        } catch (e) {
            console.log('Interstitial error:', e);
            return false;
        } finally {
            setIsAdLoading(false);
        }
    }, [isPro, showAd]);

    return { showInterstitial: show, isAdLoading };
};