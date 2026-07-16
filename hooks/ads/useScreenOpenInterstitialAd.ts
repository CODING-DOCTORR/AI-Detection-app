// hooks/ads/useScreenOpenInterstitialAd.ts
import { useEffect, useRef } from 'react';
import { useInterstitialAd } from './useInterstitialAd';
import { useAppSelector } from '../../store/hooks';
import { selectPlacementValue } from '../../store/slices/adsConfigSlice';

export const useScreenOpenInterstitialAd = (screenName: string) => {
    const { showInterstitial } = useInterstitialAd();
    const openCount = useRef(0);

    const enabled = useAppSelector(selectPlacementValue('Screen_Open_Interstitial'));
    const maxCount = useAppSelector(selectPlacementValue('Screen_Open_Count'));

    useEffect(() => {
        if (!enabled) return;

        openCount.current += 1;
        if (openCount.current >= (maxCount || 3)) {
            openCount.current = 0;
            showInterstitial();
        }
    }, []);
};