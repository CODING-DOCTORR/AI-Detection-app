import { RootState, store } from "../store";
import {
  resetCooldown,
  selectIsWithinCooldown,
  selectLastDismissalTime,
  selectShouldShowAd,
  setShouldShowAd,
  trackInterstitialDismissed,
} from "../store/slices/interstitialCooldownSlice";
import React, { createContext, ReactNode, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

interface InterstitialTrackingContextType {
  trackInterstitialDismissed: () => void;
  getLastDismissalTime: () => number | null;
  isWithinCooldown: () => boolean;
}

const InterstitialTrackingContext =
  createContext<InterstitialTrackingContextType | null>(null);

export const InterstitialTrackingProvider: React.FC<{
  children: ReactNode;
}> = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const lastDismissalTime = useSelector((state: RootState) =>
    selectLastDismissalTime(state)
  );
  const isWithinCooldown = useSelector((state: RootState) =>
    selectIsWithinCooldown(state)
  );

  const trackInterstitialDismissedAction = () => {
    dispatch(trackInterstitialDismissed());
  };

  const getLastDismissalTime = () => {
    return lastDismissalTime;
  };

  const isWithinCooldownCheck = () => {
    return isWithinCooldown;
  };

  return (
    <InterstitialTrackingContext.Provider
      value={{
        trackInterstitialDismissed: trackInterstitialDismissedAction,
        getLastDismissalTime,
        isWithinCooldown: isWithinCooldownCheck,
      }}
    >
      {children}
    </InterstitialTrackingContext.Provider>
  );
};

export const useInterstitialTracking = () => {
  const context = useContext(InterstitialTrackingContext);
  if (!context) {
    throw new Error(
      "useInterstitialTracking must be used within an InterstitialTrackingProvider"
    );
  }
  return context;
};

// Synchronous module-level flag marking that an interstitial is currently on
// screen (or just closed). Unlike the Redux dismissal timestamp, this is set
// the instant the ad is presented, so the app-open AppState listener can
// reliably skip — even though the ad's CLOSED event and the app's "active"
// event race on resume. Cleared a short while after the ad closes.
let interstitialInProgress = false;
let clearInProgressTimer: ReturnType<typeof setTimeout> | null = null;

export const globalSetInterstitialInProgress = (value: boolean) => {
  if (clearInProgressTimer) {
    clearTimeout(clearInProgressTimer);
    clearInProgressTimer = null;
  }
  if (value) {
    interstitialInProgress = true;
  } else {
    // Defer clearing so the "active" event fired as the ad dismisses still
    // sees the flag set and skips the app-open ad.
    clearInProgressTimer = setTimeout(() => {
      interstitialInProgress = false;
      clearInProgressTimer = null;
    }, 1500);
  }
};

export const globalIsInterstitialInProgress = () => interstitialInProgress;

// Redux-based global functions that can be used directly without context
export const globalTrackInterstitialDismissed = () => {
  console.log("globalTrackInterstitialDismissed");
  store.dispatch(trackInterstitialDismissed());
};
export const globalResetInterstitialDismissed = () => {
  store.dispatch(resetCooldown());
};

export const globalIsWithinCooldown = () => {
  const state = store.getState();
  return selectIsWithinCooldown(state as RootState);
};

export const globalGetShouldShowAd = () => {
  const state = store.getState();
  return selectShouldShowAd(state as RootState);
};

export const globalSetShouldShowAd = (shouldShow: boolean) => {
  store.dispatch(setShouldShowAd(shouldShow));
};

// Backwards-compatible helper used by other hooks (e.g. useAppOpenAd)
export const wasInterstitialRecentlyDismissed = (
  thresholdMs: number = 3000
): boolean => {
  const state = store.getState();
  const last = selectLastDismissalTime(state as RootState);
  if (!last) {
    console.log(
      "[InterstitialTracking] wasInterstitialRecentlyDismissed -> no last dismissal found, returning false"
    );
    return false;
  }

  const elapsed = Date.now() - last;
  const result = elapsed < thresholdMs;
  console.log(
    `[InterstitialTracking] wasInterstitialRecentlyDismissed -> last=${new Date(
      last
    ).toISOString()}, elapsed=${elapsed}ms, threshold=${thresholdMs}ms, result=${result}`
  );
  return result;
};

export default InterstitialTrackingContext;
