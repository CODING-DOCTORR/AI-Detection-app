// contexts/AdManagerContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { InterstitialAdId } from '../services/adsConfig';
import { useAppInitialization } from './AppInitializationContext';
import { useInterstitialTracking } from './InterstitialTrackingContext';
import { crashLog } from '../services/crashMonitor';

interface AdManagerContextType {
  showAd: (placement?: string) => Promise<boolean>;
  isAdLoading: boolean;
  isAdReady: boolean;
}

const AdManagerContext = createContext<AdManagerContextType | null>(null);

export const useAdManager = () => {
  const context = useContext(AdManagerContext);
  if (!context) {
    throw new Error('useAdManager must be used within an AdManagerProvider');
  }
  return context;
};

export const AdManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isAdReady, setIsAdReady] = useState(false);
  const adRef = useRef<InterstitialAd | null>(null);
  const { canCreateAds } = useAppInitialization();
  const { setInterstitialInProgress, recordDismissal } = useInterstitialTracking();

  const showAd = useCallback(async (placement?: string): Promise<boolean> => {
    if (!canCreateAds) {
      crashLog('Cannot show ad: SDK not ready');
      return false;
    }

    return new Promise((resolve) => {
      setIsAdLoading(true);
      setInterstitialInProgress(true);

      const ad = InterstitialAd.createForAdRequest(InterstitialAdId);
      adRef.current = ad;

      const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
        setIsAdLoading(false);
        setIsAdReady(true);
        ad.show();
      });

      const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        setIsAdReady(false);
        recordDismissal();
        unsubLoaded();
        unsubClosed();
        unsubError();
        resolve(true);
      });

      const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
        crashLog('Interstitial error: ' + String(error));
        setIsAdLoading(false);
        setIsAdReady(false);
        setInterstitialInProgress(false);
        unsubLoaded();
        unsubClosed();
        unsubError();
        resolve(false);
      });

      ad.load();
    });
  }, [canCreateAds, setInterstitialInProgress, recordDismissal]);

  return (
    <AdManagerContext.Provider value={{ showAd, isAdLoading, isAdReady }}>
      {children}
    </AdManagerContext.Provider>
  );
};