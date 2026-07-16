// contexts/InterstitialTrackingContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface InterstitialTrackingContextType {
  isInterstitialInProgress: boolean;
  setInterstitialInProgress: (v: boolean) => void;
  lastInterstitialDismissTime: number;
  recordDismissal: () => void;
  isWithinCooldown: (cooldownMs?: number) => boolean;
}

const InterstitialTrackingContext = createContext<InterstitialTrackingContextType | null>(null);

export const useInterstitialTracking = () => {
  const context = useContext(InterstitialTrackingContext);
  if (!context) {
    throw new Error('useInterstitialTracking must be used within an InterstitialTrackingProvider');
  }
  return context;
};

export const InterstitialTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInterstitialInProgress, setInterstitialInProgress] = useState(false);
  const lastDismissTime = useRef(0);

  const recordDismissal = useCallback(() => {
    lastDismissTime.current = Date.now();
    setInterstitialInProgress(false);
  }, []);

  const isWithinCooldown = useCallback((cooldownMs = 30000) => {
    return Date.now() - lastDismissTime.current < cooldownMs;
  }, []);

  return (
    <InterstitialTrackingContext.Provider
      value={{
        isInterstitialInProgress,
        setInterstitialInProgress,
        lastInterstitialDismissTime: lastDismissTime.current,
        recordDismissal,
        isWithinCooldown,
      }}
    >
      {children}
    </InterstitialTrackingContext.Provider>
  );
};