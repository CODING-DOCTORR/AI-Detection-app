import { useCallback, useRef } from 'react';
import { useInterstitialAd } from './useInterstitialAd';
import { useAppSelector } from '../../store/hooks';
import { selectPlacementValue } from '../../store/slices/adsConfigSlice';

export const useButtonInterstitialAd = (placementKey = 'Home_Button_Count') => {
    const { showInterstitial, isAdLoading } = useInterstitialAd();
    const pressCount = useRef(0);
    const lastAdTime = useRef(0);

    const maxCount = useAppSelector(selectPlacementValue(placementKey));
    const cooldown = useAppSelector(selectPlacementValue('Home_Button_Cooldown'));

    const handlePress = useCallback(async (onComplete?: () => void) => {
        pressCount.current += 1;

        const cooldownMs = (cooldown || 60) * 1000;
        const withinCooldown = Date.now() - lastAdTime.current < cooldownMs;

        if (pressCount.current >= (maxCount || 5) && !withinCooldown) {
            pressCount.current = 0;
            lastAdTime.current = Date.now();
            await showInterstitial();
        }

        onComplete?.();
    }, [showInterstitial, maxCount, cooldown]);

    return { handlePress, isAdLoading };
};