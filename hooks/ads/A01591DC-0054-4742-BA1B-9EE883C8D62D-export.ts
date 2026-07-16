import { useAppInitialization } from '@/contexts/AppInitializationContext';
import { useConsent } from '@/contexts/ConsentContext';
import { globalGetShouldShowAd, globalIsInterstitialInProgress, globalTrackInterstitialDismissed, wasInterstitialRecentlyDismissed } from '@/contexts/InterstitialTrackingContext';
import { AppOpenAdId } from '@/services/adsConfig';
import { selectAdsConfig } from '@/store/slices/adsConfigSlice';
import { selectIsProEnabled } from '@/store/slices/appPreferencesSlice';
import { useSegments } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { AdEventType, AppOpenAd } from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';

export type AppOpenAdStatus = 'idle' | 'loading' | 'loaded' | 'showing' | 'closed' | 'error';

interface UseAppOpenAdOptions {
  recentInterstitialThresholdMs?: number;
  loadTimeoutMs?: number;
  enableAppStateListener?: boolean;
  onAdLoaded?: () => void;
  onAdShown?: () => void;
  onAdClosed?: () => void;
  onAdError?: (error: any) => void;
  onLoadTimeout?: () => void;
}

interface UseAppOpenAdReturn {
  status: AppOpenAdStatus;
  isLoading: boolean;
  isLoaded: boolean;
  isShowing: boolean;
  showLoadingModal: boolean;
  loadAd: () => void;
  showAd: () => Promise<boolean>;
  cancelLoad: () => void;
  /** Wire to <AppOpenAdLoadingModal onDismiss={...}> so the native ad is only
   *  presented after the RN loading modal's view controller is fully gone. */
  onLoadingModalDismissed: () => void;
}

export const useAppOpenAd = (options?: UseAppOpenAdOptions): UseAppOpenAdReturn => {
  const {
    recentInterstitialThresholdMs = 5000,
    loadTimeoutMs = 8000,
    enableAppStateListener = true,
    onAdLoaded,
    onAdShown,
    onAdClosed,
    onAdError,
    onLoadTimeout,
  } = options || {};

  const ads = useSelector(selectAdsConfig);
  const isPro = useSelector(selectIsProEnabled);
  const { canShowAds, isInitialized, isConsentFormVisible } = useConsent();
  const { isAppReady, isAdsInitialized, canCreateAds } = useAppInitialization();
  const segments = useSegments();

  const [status, setStatus] = useState<AppOpenAdStatus>('idle');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const appOpenRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribersRef = useRef<Array<() => void>>([]);
  const shouldAutoShowRef = useRef(false); // Track if we should auto-show when loaded
  const pendingShowRef = useRef(false); // iOS: ad waiting for loading modal to dismiss before presenting
  const segmentsRef = useRef<string[]>(segments);
  const lastBackgroundTimeRef = useRef<number | null>(null); // Track when app went to background
  const permissionDialogCooldownMs = 3000; // 3 seconds - if app resumes within this time, skip ad (likely permission dialog)
  const shareDialogCooldownMs = 10000; // 10 seconds - if app resumes within this time, skip ad (likely share dialog or other system dialogs)
  const isAppStateChangeLoadRef = useRef(false); // Track if current load is from app state change

  const isPlacementEnabled = useCallback((): boolean => {
    return true; // App open ads are always enabled
  }, [ads]);

  const canLoadAd = useCallback((): boolean => {
    if (!isAppReady || !isAdsInitialized) {
      console.log('🚫 AppOpen: App not ready or ads not initialized');
      return false;
    }
    if (!isInitialized || isConsentFormVisible || !canShowAds()) {
      console.log('🚫 AppOpen: Cannot load - consent not ready or ads not allowed');
      return false;
    }
    if (!isPlacementEnabled()) {
      console.log('🚫 AppOpen: Placement disabled');
      return false;
    }
    return true;
  }, [isAppReady, isAdsInitialized, isInitialized, isConsentFormVisible, canShowAds, isPlacementEnabled]);

  const cleanup = useCallback(() => {
    console.log('🧹 AppOpen: Cleaning up...');

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Unsubscribe from all events
    unsubscribersRef.current.forEach(unsub => {
      try {
        unsub();
      } catch (e) {
        console.warn('Failed to unsubscribe:', e);
      }
    });
    unsubscribersRef.current = [];

    // Clear ad reference
    if (appOpenRef.current) {
      appOpenRef.current = null;
    }
  }, []);

  const cancelLoad = useCallback(() => {
    console.log('❌ AppOpen: Canceling load');
    setShowLoadingModal(false); // Hide modal when canceling
    isAppStateChangeLoadRef.current = false;
    pendingShowRef.current = false;
    cleanup();
    setStatus('idle');
  }, [cleanup]);

  const loadAd = useCallback(async () => {
    // Pro users get no ads
    if (isPro) {
      console.log('🚫 AppOpen: Pro user, skipping ad load');
      return;
    }

    if (status === 'loading' || status === 'showing') {
      console.log(`⏭️ AppOpen: Already ${status}, skipping load`);
      return;
    }

    // Check if ads should be shown
    if (!globalGetShouldShowAd()) {
      console.log('🚫 AppOpen: Ads are disabled (shouldShowAd is false)');
      setStatus('error');
      onAdError?.({ message: 'Ads are disabled' });
      return;
    }

    if (!canLoadAd()) {
      console.log('🚫 AppOpen: Cannot load ad at this time');
      setStatus('error');
      onAdError?.({ message: 'Ad load conditions not met' });
      return;
    }

    console.log('🔄 AppOpen: Starting to load ad...');
    setStatus('loading');
    
    // Show loading modal if this is triggered by app state change
    if (isAppStateChangeLoadRef.current) {
      setShowLoadingModal(true);
    }
    
    cleanup();

    const unitId = AppOpenAdId;
    let currentStatus: AppOpenAdStatus = 'loading';

    try {
      // CRITICAL: Ensure SDK is ready to create ads (prevents "Unable to obtain JavascriptEngine" error)
      if (!canCreateAds()) {
        console.warn('AppOpen: SDK not ready to create ads yet, waiting...');
        // Wait until SDK is ready (poll every 500ms, max 10s)
        let waitCount = 0;
        const maxWaitCount = 20; // 20 * 500ms = 10s max
        while (!canCreateAds() && waitCount < maxWaitCount) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          waitCount++;
        }
        if (!canCreateAds()) {
          console.error('AppOpen: Timeout waiting for SDK to be ready for ad creation');
          setStatus('error');
          setShowLoadingModal(false);
          onAdError?.({ message: 'SDK not ready for ad creation' });
          cleanup();
          return;
        }
      }

      appOpenRef.current = AppOpenAd.createForAdRequest(unitId, {
        requestNonPersonalizedAdsOnly: !canShowAds(),
      });
      console.log('🔄 AppOpen: App open ad created', unitId);

      // Set up timeout
      timeoutRef.current = setTimeout(() => {
        if (currentStatus === 'loading') {
          console.warn('⏰ AppOpen: Load timeout after', loadTimeoutMs, 'ms');
          currentStatus = 'error';
          setStatus('error');
          setShowLoadingModal(false); // Hide modal on timeout
          onLoadTimeout?.();
          onAdError?.({ message: 'Load timeout' });
          cleanup();
          shouldAutoShowRef.current = false; // Reset flag on timeout
          isAppStateChangeLoadRef.current = false;
        }
      }, loadTimeoutMs) as any;

      const unsubLoaded = appOpenRef.current.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log('✅ AppOpen: Ad loaded successfully');
          currentStatus = 'loaded';
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setStatus('loaded');
          // Keep modal visible until ad is shown
          onAdLoaded?.();
        }
      );

      const unsubError = appOpenRef.current.addAdEventListener(
        AdEventType.ERROR,
        (error: any) => {
          console.warn('❌ AppOpen: Ad load/show error:', error);
          currentStatus = 'error';
          setStatus('error');
          setShowLoadingModal(false); // Hide modal on error
          onAdError?.(error);
          cleanup();
          shouldAutoShowRef.current = false; // Reset flag on error
          isAppStateChangeLoadRef.current = false;
        }
      );

      unsubscribersRef.current.push(unsubLoaded, unsubError);
      appOpenRef.current.load();
    } catch (error) {
      console.error('❌ AppOpen: Failed to create ad:', error);
      setStatus('error');
      setShowLoadingModal(false); // Hide modal on error
      onAdError?.(error);
      cleanup();
      shouldAutoShowRef.current = false; // Reset flag on error
      isAppStateChangeLoadRef.current = false;
    }
  }, [isPro, status, canLoadAd, loadTimeoutMs, onAdLoaded, onAdError, onLoadTimeout, cleanup, canShowAds]);

  // Actually presents the native ad. Must only be called once any RN modal
  // (the loading modal) is fully dismissed — otherwise iOS presents the ad's
  // view controller over a dismissing modal, leaving an invisible, touch-blocking
  // overlay that freezes the app.
  const presentAd = useCallback(async (): Promise<boolean> => {
    if (!appOpenRef.current) {
      console.warn('⚠️ AppOpen: No ad reference available');
      setStatus('error');
      return false;
    }

    try {
      console.log('📺 AppOpen: Presenting ad...');
      isAppStateChangeLoadRef.current = false; // Reset flag

      // Set up closed listener before showing
      const unsubClosed = appOpenRef.current.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('✅ AppOpen: Ad closed by user');

          setStatus('closed');
          onAdClosed?.();
          cleanup();
          globalTrackInterstitialDismissed();
          shouldAutoShowRef.current = false; // Reset flag when ad closes
        }
      );
      unsubscribersRef.current.push(unsubClosed);

      await appOpenRef.current.show();
      return true;
    } catch (error) {
      console.error('❌ AppOpen: Failed to show ad:', error);
      setStatus('error');
      onAdError?.(error);
      cleanup();
      shouldAutoShowRef.current = false; // Reset flag on error
      return false;
    }
  }, [onAdClosed, onAdError, cleanup]);

  const showAd = useCallback(async (): Promise<boolean> => {
    if (status !== 'loaded') {
      console.warn('⚠️ AppOpen: Cannot show ad - not loaded (status:', status, ')');
      return false;
    }

    if (!appOpenRef.current) {
      console.warn('⚠️ AppOpen: No ad reference available');
      setStatus('error');
      return false;
    }

    setStatus('showing');
    onAdShown?.();

    // If the loading modal is up on iOS, wait for it to fully dismiss before
    // presenting the ad (see presentAd). onLoadingModalDismissed completes the show.
    if (showLoadingModal && Platform.OS === 'ios') {
      console.log('⏳ AppOpen: Deferring present until loading modal dismisses');
      pendingShowRef.current = true;
      setShowLoadingModal(false);
      return true;
    }

    setShowLoadingModal(false);
    return presentAd();
  }, [status, showLoadingModal, onAdShown, presentAd]);

  // Called from the loading modal's onDismiss — presents the ad now that the
  // modal's view controller is fully gone.
  const onLoadingModalDismissed = useCallback(() => {
    if (pendingShowRef.current) {
      pendingShowRef.current = false;
      console.log('🎬 AppOpen: Loading modal dismissed — presenting ad now');
      presentAd();
    }
  }, [presentAd]);

  // App State Change Listener
  useEffect(() => {
    if (!enableAppStateListener) {
      return;
    }

    const handleAppStateChange = (next: AppStateStatus) => {
      const now = Date.now();

      if (next === 'background' || next === 'inactive') {
        // Track when app goes to background
        lastBackgroundTimeRef.current = now;
        console.log('📱 AppOpen: App went to background/inactive');
        return;
      }

      if (next !== 'active') return;

      console.log('🔄 AppOpen: App became active');

      // Don't interrupt an in-progress load/show
      if (status === 'showing' || status === 'loading') {
        console.log('⏭️ AppOpen: Already', status);
        return;
      }

      // Fresh-load policy: discard any previously loaded ad — we never keep them around
      if (status === 'loaded') {
        console.log('🗑️ AppOpen: Discarding previously loaded ad (fresh-load policy)');
        cleanup();
        setStatus('idle');
      }

      // Skip if app resumed too quickly (likely a system dialog round-trip)
      if (lastBackgroundTimeRef.current !== null) {
        const timeInBackground = now - lastBackgroundTimeRef.current;
        if (timeInBackground < shareDialogCooldownMs) {
          console.log(`⏭️ AppOpen: Skipping - app resumed too quickly (${timeInBackground}ms), likely from system dialog`);
          lastBackgroundTimeRef.current = null;
          return;
        }
        lastBackgroundTimeRef.current = null;
      }

      // Skip on restricted screens
      const currentRoute = segmentsRef.current[segmentsRef.current.length - 1] || '';
      const shouldSkipOnCurrentRoute =
        currentRoute === 'permissions' ||
        currentRoute === 'ios-permissions' ||
        currentRoute === 'onboarding' ||
        currentRoute === 'index';

      if (shouldSkipOnCurrentRoute) {
        console.log('⏭️ AppOpen: Skipping - on restricted screen:', currentRoute);
        return;
      }

      // Avoid showing app-open while/just after an interstitial is on screen.
      // This flag is set synchronously when the interstitial is presented, so
      // it reliably catches the resume even though the ad's CLOSED event and
      // this "active" event race (which makes the timestamp check below flaky).
      if (globalIsInterstitialInProgress()) {
        console.log('⏭️ AppOpen: Skipping - interstitial in progress');
        return;
      }

      // Avoid showing app-open shortly after interstitial dismissal
      if (wasInterstitialRecentlyDismissed(recentInterstitialThresholdMs)) {
        console.log('⏭️ AppOpen: Skipping - interstitial recently dismissed');
        return;
      }

      // All checks passed - load a fresh ad, show our loader, then show the ad
      shouldAutoShowRef.current = true;
      isAppStateChangeLoadRef.current = true;
      loadAd().catch((error) => {
        console.error('AppOpen: Error loading ad from app state change:', error);
      });
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      try {
        subscription?.remove();
      } catch (e) {
        console.warn('Failed to remove AppState listener:', e);
      }
    };
  }, [enableAppStateListener, status, recentInterstitialThresholdMs, loadAd, showAd]);

  // Update segments ref whenever segments change
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  // Auto-show as soon as the ad finishes loading (conditions were checked before loading)
  useEffect(() => {
    if (enableAppStateListener && status === 'loaded' && shouldAutoShowRef.current && AppState.currentState === 'active') {
      console.log('🎯 AppOpen: Auto-showing ad after state change load');
      shouldAutoShowRef.current = false;
      showAd();
    }
  }, [status, showAd, enableAppStateListener]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    isLoading: status === 'loading',
    isLoaded: status === 'loaded',
    isShowing: status === 'showing',
    showLoadingModal,
    loadAd,
    showAd,
    cancelLoad,
    onLoadingModalDismissed,
  };
};

export default useAppOpenAd;
