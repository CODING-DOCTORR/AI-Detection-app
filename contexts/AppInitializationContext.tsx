import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import mobileAds from "react-native-google-mobile-ads";

interface AppInitializationContextType {
  isAppReady: boolean;
  isAdsInitialized: boolean;
  initializationProgress: string;
  canCreateAds: () => boolean; // Check if enough time has passed since SDK init to safely create ads
}

const AppInitializationContext = createContext<
  AppInitializationContextType | undefined
>(undefined);

export const AppInitializationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAdsInitialized, setIsAdsInitialized] = useState(false);
  const [initializationProgress, setInitializationProgress] = useState(
    "Starting app initialization..."
  );
  const sdkInitTimeRef = React.useRef<number | null>(null);
  // Ref mirror of isAdsInitialized so canCreateAds() can stay a stable function
  // that always reads the latest value. Without this, an in-flight ad-load poll
  // loop (e.g. AdManager) would hold a stale canCreateAds closure that never
  // flips true even after the SDK becomes ready.
  const isAdsInitializedRef = React.useRef(false);
  const minWaitAfterInitMs = Platform.OS === "android" ? 3000 : 2000; // Minimum wait time after SDK init

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Step 1: Wait for basic app setup
        setInitializationProgress("Waiting for app to be ready...");
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 2: Initialize Google Mobile Ads SDK
        setInitializationProgress("Initializing Google Mobile Ads SDK...");
        try {
          await mobileAds().initialize();
          console.log("✅ Google Mobile Ads SDK initialized");

          // Mute video ads after initialization to reduce ExoPlayer main-thread processing,
          // which can cause GC-pressure ANRs on Android. The SDK requires initialize()
          // to be called before setAppMuted/setAppVolume.
          if (Platform.OS === "android") {
            mobileAds().setAppMuted(true);
            mobileAds().setAppVolume(0);
          }

          // Record the time when SDK initialization completed
          sdkInitTimeRef.current = Date.now();

          // CRITICAL: After initialization, wait for JavaScript engine to be ready
          // The SDK needs additional time, especially on Android, for the JS engine
          // to be fully available before ads can be created
          if (Platform.OS === "android") {
            setInitializationProgress(
              "Waiting for JavaScript engine to be ready (Android)..."
            );
            await new Promise((resolve) => setTimeout(resolve, 3000));
          } else {
            setInitializationProgress(
              "Waiting for JavaScript engine to be ready (iOS)..."
            );
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }

          isAdsInitializedRef.current = true;
          setIsAdsInitialized(true);
          setInitializationProgress(
            "Google Mobile Ads SDK initialized successfully"
          );
        } catch (error) {
          console.warn("⚠️ Failed to initialize Google Mobile Ads SDK:", error);
          setInitializationProgress(
            "Google Mobile Ads SDK initialization failed, continuing..."
          );
          // Even on error, wait before marking as initialized to prevent immediate ad creation
          if (Platform.OS === "android") {
            await new Promise((resolve) => setTimeout(resolve, 3000));
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
          // Continue even if ads fail to initialize
          isAdsInitializedRef.current = true;
          setIsAdsInitialized(true);
        }

        // Step 3: Additional delay for Android Activity to be fully ready
        if (Platform.OS === "android") {
          setInitializationProgress(
            "Waiting for Android Activity to be ready..."
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Step 4: Mark app as ready
        setInitializationProgress("App initialization complete");
        setIsAppReady(true);
        console.log("✅ App initialization complete");
      } catch (error) {
        console.error("❌ App initialization failed:", error);
        // Still mark as ready to prevent app from hanging, but with delay
        if (Platform.OS === "android") {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        // Fallback path: the SDK init may have thrown before we recorded the
        // init time — set it now so canCreateAds() can eventually return true.
        if (!sdkInitTimeRef.current) sdkInitTimeRef.current = Date.now();
        isAdsInitializedRef.current = true;
        setIsAppReady(true);
        setIsAdsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Check if enough time has passed since SDK initialization to safely create
  // ads. Reads from refs (not state) so this stays a single stable function —
  // an in-flight poll loop holding this closure will see readiness flip to true.
  const canCreateAds = React.useCallback((): boolean => {
    if (!isAdsInitializedRef.current || !sdkInitTimeRef.current) {
      return false;
    }
    const timeSinceInit = Date.now() - sdkInitTimeRef.current;
    const canCreate = timeSinceInit >= minWaitAfterInitMs;
    if (!canCreate) {
      console.log(
        `Ad creation blocked: Only ${timeSinceInit}ms since SDK init, need ${minWaitAfterInitMs}ms`
      );
    }
    return canCreate;
  }, [minWaitAfterInitMs]);

  const contextValue: AppInitializationContextType = {
    isAppReady,
    isAdsInitialized,
    initializationProgress,
    canCreateAds,
  };

  return (
    <AppInitializationContext.Provider value={contextValue}>
      {children}
    </AppInitializationContext.Provider>
  );
};

export const useAppInitialization = (): AppInitializationContextType => {
  const context = useContext(AppInitializationContext);
  if (!context) {
    throw new Error(
      "useAppInitialization must be used within an AppInitializationProvider"
    );
  }
  return context;
};
