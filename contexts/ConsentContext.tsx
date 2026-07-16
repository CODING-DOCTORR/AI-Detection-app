// contexts/ConsentContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { crashLog } from '../services/crashMonitor';

interface ConsentContextType {
  consentReady: boolean;
  canShowAds: boolean;
  consentStatus: string;
}

const ConsentContext = createContext<ConsentContextType>({
  consentReady: false,
  canShowAds: false,
  consentStatus: 'unknown',
});

export const useConsent = () => useContext(ConsentContext);

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consentReady, setConsentReady] = useState(false);
  const [canShowAds, setCanShowAds] = useState(false);
  const [consentStatus, setConsentStatus] = useState('unknown');

  useEffect(() => {
    const initConsent = async () => {
      try {
        if (Platform.OS === 'ios') {
          try {
            await requestTrackingPermissionsAsync();
          } catch (e) {
            crashLog('ATT request failed: ' + String(e));
          }
        }

        try {
          const consentInfo = await AdsConsent.requestInfoUpdate();
          crashLog('Consent status: ' + consentInfo.status);

          if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
            const result = await AdsConsent.showForm();
            setConsentStatus(result.status);
            setCanShowAds(
              result.status === AdsConsentStatus.OBTAINED ||
              result.status === AdsConsentStatus.NOT_REQUIRED
            );
          } else {
            setConsentStatus(consentInfo.status);
            setCanShowAds(
              consentInfo.status === AdsConsentStatus.OBTAINED ||
              consentInfo.status === AdsConsentStatus.NOT_REQUIRED
            );
          }
        } catch (e) {
          crashLog('UMP consent error: ' + String(e));
          setCanShowAds(true);
        }
      } catch (e) {
        crashLog('Consent init error: ' + String(e));
        setCanShowAds(true);
      } finally {
        setConsentReady(true);
      }
    };

    initConsent();
  }, []);

  return (
    <ConsentContext.Provider value={{ consentReady, canShowAds, consentStatus }}>
      {children}
    </ConsentContext.Provider>
  );
};