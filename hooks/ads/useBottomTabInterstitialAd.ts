import { useCallback, useRef } from 'react';
import { useInterstitialAd } from './useInterstitialAd';
import { useAppSelector } from '../../store/hooks';
import { selectPlacementValue } from '../../store/slices/adsConfigSlice';

export const useBottomTabInterstitialAd = () => {
    const { showInterstitial, isAdLoading } = useInterstitialAd();
    const tabSwitchCount = useRef(0);
    const lastAdTime = useRef(0);

    const maxCount = useAppSelector(selectPlacementValue('Bottom_Tab_Count'));
    const cooldown = useAppSelector(selectPlacementValue('Bottom_Tab_Cooldown'));

    const onTabSwitch = useCallback(async () => {
        tabSwitchCount.current += 1;

        const cooldownMs = (cooldown || 120) * 1000;
        const withinCooldown = Date.now() - lastAdTime.current < cooldownMs;

        if (tabSwitchCount.current >= (maxCount || 4) && !withinCooldown) {
            tabSwitchCount.current = 0;
            lastAdTime.current = Date.now();
            await showInterstitial();
        }
    }, [showInterstitial, maxCount, cooldown]);

    return { onTabSwitch, isAdLoading };
};