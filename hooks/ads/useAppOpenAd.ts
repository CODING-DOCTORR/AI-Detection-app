// hooks/ads/useAppOpenAd.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';
import { AppOpenAdId } from '../../services/adsConfig';
import { useAppInitialization } from '../../contexts/AppInitializationContext';
import { useAppSelector } from '../../store/hooks';
import { selectIsProActive } from '../../store/slices/appPreferencesSlice';
import { selectIsWithinCooldown } from '../../store/slices/interstitialCooldownSlice';
import { crashLog } from '../../services/crashMonitor';

const RESTRICTED_SCREENS = ['Splash', 'Onboarding', 'Login', 'Register', 'ForgotPassword'];

export const useAppOpenAd = (currentScreen?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const { canCreateAds } = useAppInitialization();
    const isPro = useAppSelector(selectIsProActive);
    const isWithinCooldown = useAppSelector(selectIsWithinCooldown);
    const appState = useRef(AppState.currentState);

    const showAppOpenAd = useCallback(() => {
        // Skip conditions
        if (!canCreateAds || isPro) return;
        if (isWithinCooldown) return;
        if (currentScreen && RESTRICTED_SCREENS.includes(currentScreen)) return;

        setIsLoading(true);

        const ad = AppOpenAd.createForAdRequest(AppOpenAdId);

        const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
            setIsLoading(false);
            ad.show();
        });

        const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
            setIsLoading(false);
            unsubLoaded();
            unsubClosed();
            unsubError();
        });

        const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
            crashLog('App open ad error: ' + String(error));
            setIsLoading(false);
            unsubLoaded();
            unsubClosed();
            unsubError();
        });

        ad.load();
    }, [canCreateAds, isPro, isWithinCooldown, currentScreen]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                showAppOpenAd();
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, [showAppOpenAd]);

    return { isLoading };
};