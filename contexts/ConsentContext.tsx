import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AdsConsent,
  AdsConsentStatus,
  AdsConsentDebugGeography,
} from "react-native-google-mobile-ads";
import {
  requestTrackingPermissionsAsync,
  getTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import { useAppInitialization } from "./AppInitializationContext";
import { nativeAdPool } from "../services/nativeAdPool";
import { useAppSelector } from "../store/hooks";
import { selectIsProEnabled } from "../store/slices/appPreferencesSlice";

// Persisted consent status — lets returning users show ads on the splash
// screen instantly instead of waiting for the async consent flow to finish.
const CONSENT_STATUS_KEY = "@ads_consent_status";

// ATT (App Tracking Transparency) status types
export enum ATTStatus {
  NOT_DETERMINED = "not-determined",
  RESTRICTED = "restricted",
  DENIED = "denied",
  AUTHORIZED = "authorized",
}

interface ConsentContextType {
  canShowAds: () => boolean;
  isInitialized: boolean;
  isConsentFormVisible: boolean;
  consentStatus: AdsConsentStatus;
  attStatus: ATTStatus | null;
  requestConsent: () => Promise<void>;
  requestATT: () => Promise<ATTStatus | null>;
  resetConsent: () => Promise<void>;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConsentFormVisible, setIsConsentFormVisible] = useState(false);
  const [consentStatus, setConsentStatus] = useState<AdsConsentStatus>(
    AdsConsentStatus.UNKNOWN
  );
  const [attStatus, setAttStatus] = useState<ATTStatus | null>(null);
  const consentRequestedRef = useRef(false);
  const attRequestedRef = useRef(false);
  // True once we've optimistically restored consent from local storage, so the
  // background refresh knows not to flip the ad gate (form-visible) off.
  const hydratedFromCacheRef = useRef(false);
  const { isAppReady, isAdsInitialized, canCreateAds } = useAppInitialization();
  const isPro = useAppSelector(selectIsProEnabled);

  const canShowAds = (): boolean => {
    // Debug logging
    const debugInfo = {
      isInitialized,
      isConsentFormVisible,
      consentStatus: AdsConsentStatus[consentStatus],
    };
    
    if (!isInitialized) {
      console.log("🚫 canShowAds: false - consent not initialized", debugInfo);
      return false;
    }
    
    if (isConsentFormVisible) {
      console.log("🚫 canShowAds: false - consent form visible", debugInfo);
      return false;
    }

    // Can show ads if consent is OBTAINED or NOT_REQUIRED
    // Also allow ads if consent is REQUIRED or UNKNOWN (will show non-personalized ads)
    // This ensures ads can still be displayed even if user hasn't consented yet
    const canShow = (
      consentStatus === AdsConsentStatus.OBTAINED ||
      consentStatus === AdsConsentStatus.NOT_REQUIRED ||
      consentStatus === AdsConsentStatus.REQUIRED ||
      consentStatus === AdsConsentStatus.UNKNOWN
    );
    
    // if (canShow) {
    //   console.log("✅ canShowAds: true", debugInfo);
    // } else {
    //   console.log("🚫 canShowAds: false - consent status not allowed", debugInfo);
    // }
    
    return canShow;
  };

  // Reset consent for testing (ONLY USE IN DEVELOPMENT)
  const resetConsent = async (): Promise<void> => {
    try {
      console.log("🔄 Resetting consent for testing...");
      await AdsConsent.reset();
      await AsyncStorage.removeItem(CONSENT_STATUS_KEY);
      consentRequestedRef.current = false;
      hydratedFromCacheRef.current = false;
      setConsentStatus(AdsConsentStatus.UNKNOWN);
      setIsInitialized(false);
      console.log("✅ Consent reset successfully");
    } catch (error) {
      console.error("❌ Error resetting consent:", error);
    }
  };

  const runConsentFlow = async (silent = false): Promise<void> => {
    if (consentRequestedRef.current) {
      console.log("📋 Consent already requested, skipping...");
      return;
    }

    try {
      // In silent mode (background refresh after a cache hydration) we don't
      // flip the form-visible gate, so ads keep showing while we re-check.
      if (!silent) setIsConsentFormVisible(true);
      consentRequestedRef.current = true;

      console.log("📋 ========================================");
      console.log("📋 STARTING CONSENT FLOW");
      console.log("📋 ========================================");

      // CRITICAL: For testing with VPN in EEA, use debug geography
      // Remove this in production or set to DISABLED
      if (__DEV__) {
        console.log(
          "📋 DEV MODE: Setting debug geography to EEA for testing..."
        );
        console.log("📋 NOTE: This forces the SDK to treat device as EEA user");
        console.log("📋 IMPORTANT: Remove this for production builds!");

        await AdsConsent.requestInfoUpdate({
          debugGeography: AdsConsentDebugGeography.EEA,
        });

        console.log("📋 ✅ Debug geography set to EEA");
      } else {
        console.log("📋 PRODUCTION MODE: Using actual device location");
        await AdsConsent.requestInfoUpdate();
      }

      console.log("📋 Step 2: Getting consent info...");
      const consentInfo = await AdsConsent.getConsentInfo();

      console.log("📋 Consent Info Details:");
      console.log("   - Status:", consentInfo.status);
      console.log("   - Status Name:", AdsConsentStatus[consentInfo.status]);
      console.log(
        "   - Is Consent Form Available:",
        consentInfo.isConsentFormAvailable
      );
      console.log("   - Can Request Ads:", consentInfo.canRequestAds);

      setConsentStatus(consentInfo.status);

      // Step 3: If consent is REQUIRED and form is available, show it
      if (
        consentInfo.status === AdsConsentStatus.REQUIRED &&
        consentInfo.isConsentFormAvailable
      ) {
        console.log(
          "📋 Step 3: Consent REQUIRED - Loading and showing form..."
        );

        try {
          // Load and show consent form
          const formResult =
            await AdsConsent.loadAndShowConsentFormIfRequired();
          console.log("📋 ✅ Form shown successfully");
          console.log("📋 Form Result:", formResult);

          // Get updated consent info after form interaction
          const updatedConsentInfo = await AdsConsent.getConsentInfo();
          console.log("📋 Updated Consent Status:", updatedConsentInfo.status);
          console.log(
            "📋 Updated Status Name:",
            AdsConsentStatus[updatedConsentInfo.status]
          );
          console.log("📋 Can Request Ads:", updatedConsentInfo.canRequestAds);

          setConsentStatus(updatedConsentInfo.status);

          if (updatedConsentInfo.status === AdsConsentStatus.OBTAINED) {
            console.log("✅ User provided consent!");
          } else if (updatedConsentInfo.status === AdsConsentStatus.REQUIRED) {
            console.log("⚠️ User closed form without providing consent");
          }
        } catch (formError: any) {
          console.error("❌ Error showing consent form:", formError);
          console.error("❌ Error message:", formError.message);
          console.error("❌ Error code:", formError.code);

          // Check if it's a form not available error
          const errorMessage = formError.message || "";
          if (
            errorMessage.includes("no form") ||
            errorMessage.includes("Publisher misconfiguration") ||
            errorMessage.includes("UserMessagingPlatform")
          ) {
            console.warn("⚠️ ========================================");
            console.warn("⚠️ CONSENT FORM NOT PROPERLY CONFIGURED");
            console.warn("⚠️ ========================================");
            console.warn("⚠️ STEPS TO FIX:");
            console.warn("⚠️ 1. Go to: https://admob.google.com");
            console.warn("⚠️ 2. Click 'Privacy & messaging'");
            console.warn("⚠️ 3. Click 'European regulations' card");
            console.warn("⚠️ 4. Ensure message is PUBLISHED (not draft)");
            console.warn("⚠️ 5. Turn ON 'Ad unit deployment' toggles");
            console.warn("⚠️ 6. Wait 1-2 hours for changes to propagate");
            console.warn("⚠️ 7. Clear app data and reinstall");
            console.warn("⚠️ ========================================");
            console.warn("⚠️ Error:", errorMessage);
            console.warn("⚠️ ========================================");

            setConsentStatus(AdsConsentStatus.NOT_REQUIRED);
          } else {
            // Try to get status anyway
            try {
              const fallbackInfo = await AdsConsent.getConsentInfo();
              setConsentStatus(fallbackInfo.status);
            } catch (e) {
              setConsentStatus(AdsConsentStatus.NOT_REQUIRED);
            }
          }
        }
      } else if (consentInfo.status === AdsConsentStatus.NOT_REQUIRED) {
        console.log("✅ Consent NOT REQUIRED (user not in EEA/UK)");
      } else if (consentInfo.status === AdsConsentStatus.OBTAINED) {
        console.log("✅ Consent ALREADY OBTAINED");
      } else if (
        consentInfo.status === AdsConsentStatus.REQUIRED &&
        !consentInfo.isConsentFormAvailable
      ) {
        console.warn("⚠️ ========================================");
        console.warn("⚠️ Consent REQUIRED but form NOT AVAILABLE");
        console.warn("⚠️ ========================================");
        console.warn("⚠️ This usually means:");
        console.warn("⚠️ 1. Message is not published in AdMob");
        console.warn("⚠️ 2. Message is still propagating (wait 1-2 hours)");
        console.warn("⚠️ 3. Wrong app selected in message configuration");
        console.warn("⚠️ ========================================");
      }

      console.log("📋 ========================================");
      console.log("📋 CONSENT FLOW COMPLETED");
      console.log("📋 Final Status:", AdsConsentStatus[consentStatus]);
      console.log("📋 ========================================");
    } catch (error: any) {
      console.error("❌ ========================================");
      console.error("❌ ERROR IN CONSENT FLOW");
      console.error("❌ ========================================");
      console.error("❌ Error:", error);
      console.error("❌ Message:", error.message);
      console.error("❌ Code:", error.code);
      console.error("❌ ========================================");

      // Fallback to NOT_REQUIRED on error
      setConsentStatus(AdsConsentStatus.NOT_REQUIRED);
    } finally {
      if (!silent) setIsConsentFormVisible(false);
    }
  };

  const requestConsent = runConsentFlow;

  const mapATTStatus = (status: string): ATTStatus => {
    switch (status) {
      case "authorized": return ATTStatus.AUTHORIZED;
      case "denied": return ATTStatus.DENIED;
      case "restricted": return ATTStatus.RESTRICTED;
      default: return ATTStatus.NOT_DETERMINED;
    }
  };

  const requestATT = async (): Promise<ATTStatus | null> => {
    if (Platform.OS !== "ios") {
      return null;
    }

    if (attRequestedRef.current) {
      return attStatus;
    }

    try {
      console.log("📱 ATT: Checking current tracking permission status...");

      // Check current status — if already determined, don't re-prompt
      const { status: currentStatus } = await getTrackingPermissionsAsync();
      console.log("📱 ATT: Current status:", currentStatus);

      if (currentStatus !== "undetermined") {
        const mapped = mapATTStatus(currentStatus);
        setAttStatus(mapped);
        attRequestedRef.current = true;
        console.log("📱 ATT: Already determined:", mapped);
        return mapped;
      }

      // Status is undetermined — show the system ATT prompt
      console.log("📱 ATT: Requesting tracking permission...");
      attRequestedRef.current = true;
      const { status } = await requestTrackingPermissionsAsync();
      console.log("📱 ATT: Request result:", status);

      const mapped = mapATTStatus(status);
      setAttStatus(mapped);
      console.log("📱 ATT: Final status:", mapped);
      return mapped;
    } catch (error) {
      console.error("❌ ATT Error:", error);
      setAttStatus(ATTStatus.DENIED);
      return ATTStatus.DENIED;
    }
  };

  // Gather consent as early as possible at launch — on mount, in parallel with
  // (not gated behind) the Mobile Ads SDK init. The UMP APIs used by
  // runConsentFlow don't depend on mobileAds().initialize(), and Google's
  // guidance is to request consent info at every launch ASAP. Ad *creation*
  // stays separately gated by canCreateAds()/canShowAds(), so nothing is
  // requested before both the SDK and consent are ready.
  useEffect(() => {
    const initializeConsent = async () => {
      // The heavy flow runs once per launch. We guard on the ref (not
      // isInitialized) because a cache hydration may already have flipped
      // isInitialized — we still want to refresh consent in the background.
      if (consentRequestedRef.current) {
        console.log("✅ Consent flow already ran this launch");
        return;
      }

      // Step 0: Hydrate consent from local storage first. On a returning launch
      // this opens the ad gate immediately (isInitialized + status) so the
      // splash-screen ad isn't missed, and marks the refresh below as "silent"
      // so it doesn't flip the form-visible gate off while re-checking. Reading
      // the cache here (rather than in a separate effect) keeps this ordering
      // deterministic now that the flow no longer waits on app/ads init.
      let silent = false;
      try {
        const cached = await AsyncStorage.getItem(CONSENT_STATUS_KEY);
        if (cached != null) {
          const cachedStatus = cached as AdsConsentStatus;
          console.log("⚡ Hydrated consent from storage:", cachedStatus);
          hydratedFromCacheRef.current = true;
          silent = true;
          setConsentStatus(cachedStatus);
          setIsInitialized(true);
        }
      } catch (error) {
        console.warn("⚠️ Failed to read cached consent:", error);
      }

      try {
        console.log("🚀 ========================================");
        console.log(`🚀 INITIALIZING CONSENT SYSTEM${silent ? " (silent refresh)" : ""}`);
        console.log("🚀 ========================================");

        // Run consent flow
        await runConsentFlow(silent);

        // Small delay to ensure state is updated
        await new Promise((resolve) => setTimeout(resolve, 500));

        // ATT must be requested for all iOS users before any tracking occurs,
        // regardless of GDPR consent status (Apple policy, global requirement)
        if (Platform.OS === "ios") {
          // Small delay to ensure consent form is fully dismissed before ATT prompt
          await new Promise((resolve) => setTimeout(resolve, 500));
          await requestATT();
        }

        // Get the final consent status before setting initialized
        const finalConsentInfo = await AdsConsent.getConsentInfo();
        const finalStatus = finalConsentInfo.status;
        setConsentStatus(finalStatus);

        // Persist so the next launch can open the ad gate instantly.
        AsyncStorage.setItem(CONSENT_STATUS_KEY, finalStatus).catch(
          (e) => console.warn("⚠️ Failed to persist consent:", e)
        );

        setIsInitialized(true);

        console.log("✅ ========================================");
        console.log("✅ CONSENT INITIALIZATION COMPLETE");
        console.log("✅ Final Status:", AdsConsentStatus[finalStatus]);
        console.log("✅ Can Request Ads:", finalConsentInfo.canRequestAds);
        console.log("✅ Can Show Ads:", canShowAds());
        console.log("✅ isInitialized:", true);
        console.log("✅ isConsentFormVisible:", false);
        console.log("✅ ========================================");
      } catch (error) {
        console.error("❌ Consent initialization failed:", error);
        setIsInitialized(true);
        setConsentStatus(AdsConsentStatus.NOT_REQUIRED);
      }
    };

    initializeConsent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start / stop the native ad prefetch pool once all gates are green.
  useEffect(() => {
    const ready =
      isAppReady &&
      isAdsInitialized &&
      isInitialized &&
      !isConsentFormVisible &&
      canShowAds() &&
      !isPro;

    // console.log(
    //   `[NativeAdPool:gate] appReady=${isAppReady} adsInit=${isAdsInitialized} consentInit=${isInitialized} formVisible=${isConsentFormVisible} canShow=${canShowAds()} isPro=${isPro} → ${ready ? "START" : "STOP"}`
    // );

    if (ready) {
      nativeAdPool.start(canCreateAds);
    } else {
      nativeAdPool.stop();
    }
  }, [isAppReady, isAdsInitialized, isInitialized, isConsentFormVisible, consentStatus, canCreateAds, isPro]);

  const contextValue: ConsentContextType = {
    canShowAds,
    isInitialized,
    isConsentFormVisible,
    consentStatus,
    attStatus,
    requestConsent,
    requestATT,
    resetConsent,
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
};
