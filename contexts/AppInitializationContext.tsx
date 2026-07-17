// contexts/AppInitializationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { useConsent } from './ConsentContext';
import { crashLog } from '../services/crashMonitor';

interface AppInitContextType {
  sdkReady: boolean;
  canCreateAds: boolean;
}

const AppInitializationContext = createContext<AppInitContextType | null>(null);

export const useAppInitialization = () => {
  const context = useContext(AppInitializationContext);
  if (!context) {
    throw new Error('useAppInitialization must be used within an AppInitializationProvider');
  }
  return context;
};

export const AppInitializationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sdkReady, setSdkReady] = useState(false);
  const [canCreateAds, setCanCreateAds] = useState(false);
  const { consentReady, canShowAds } = useConsent();

  useEffect(() => {
    if (!consentReady) return;

    const initSdk = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await mobileAds().initialize();
        crashLog('AdMob SDK initialized');
        setSdkReady(true);
        if (canShowAds) setCanCreateAds(true);
      } catch (e) {
        crashLog('SDK init error: ' + String(e));
        setSdkReady(true);
      }
    };

    initSdk();
  }, [consentReady, canShowAds]);

  return (
    <AppInitializationContext.Provider value={{ sdkReady, canCreateAds }}>
      {children}
    </AppInitializationContext.Provider>
  );
};