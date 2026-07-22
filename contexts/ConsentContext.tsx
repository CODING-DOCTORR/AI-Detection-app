// contexts/ConsentContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { crashLog } from '../services/crashMonitor';

const CUSTOM_CONSENT_KEY = 'custom_consent_accepted';

interface ConsentContextType {
  consentReady: boolean;
  canShowAds: boolean;
  consentStatus: string;
  showCustomConsent: boolean;      // 🆕 controls our own consent modal
  acceptCustomConsent: () => void; // 🆕 call this when user taps "Accept"
}

const ConsentContext = createContext<ConsentContextType>({
  consentReady: false,
  canShowAds: false,
  consentStatus: 'unknown',
  showCustomConsent: false,
  acceptCustomConsent: () => {},
});

export const useConsent = () => useContext(ConsentContext);

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consentReady, setConsentReady] = useState(false);
  const [canShowAds, setCanShowAds] = useState(false);
  const [consentStatus, setConsentStatus] = useState('unknown');
  const [showCustomConsent, setShowCustomConsent] = useState(false); // 🆕

  useEffect(() => {
    const initConsent = async () => {
      try {
        // 🆕 Check if user already accepted our custom consent before
        const alreadyAccepted = await AsyncStorage.getItem(CUSTOM_CONSENT_KEY);

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
            // Google's official GDPR form (only for EU/UK users)
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

            // 🆕 For non-EU users (NOT_REQUIRED), show our own custom consent
            // screen once, if they haven't accepted it before
            if (
              consentInfo.status === AdsConsentStatus.NOT_REQUIRED &&
              !alreadyAccepted
            ) {
              setShowCustomConsent(true);
            }
          }
        } catch (e) {
          crashLog('UMP consent error: ' + String(e));
          setCanShowAds(true);
          // 🆕 Fallback: still show custom consent if not accepted before
          if (!alreadyAccepted) {
            setShowCustomConsent(true);
          }
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

  // 🆕 Called when user taps "Accept & Continue" on our custom modal
  const acceptCustomConsent = async () => {
    try {
      await AsyncStorage.setItem(CUSTOM_CONSENT_KEY, 'true');
    } catch (e) {
      crashLog('Failed to save custom consent: ' + String(e));
    }
    setShowCustomConsent(false);
  };

  return (
    <ConsentContext.Provider
      value={{ consentReady, canShowAds, consentStatus, showCustomConsent, acceptCustomConsent }}
    >
      {children}
    </ConsentContext.Provider>
  );
};