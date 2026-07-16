import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

const COOLDOWN_DURATION_MS = 30_000; // 30 seconds

interface InterstitialCooldownState {
    lastDismissalTime: number | null;
    shouldShowAd: boolean;
}

const initialState: InterstitialCooldownState = {
    lastDismissalTime: null,
    shouldShowAd: true,
};

const interstitialCooldownSlice = createSlice({
    name: 'interstitialCooldown',
    initialState,
    reducers: {
        trackInterstitialDismissed(state) {
            state.lastDismissalTime = Date.now();
            state.shouldShowAd = false;
        },
        resetCooldown(state) {
            state.lastDismissalTime = null;
            state.shouldShowAd = true;
        },
        setShouldShowAd(state, action: PayloadAction<boolean>) {
            state.shouldShowAd = action.payload;
        },
    },
});

export const {
    trackInterstitialDismissed,
    resetCooldown,
    setShouldShowAd,
} = interstitialCooldownSlice.actions;

export const selectLastDismissalTime = (state: RootState): number | null =>
    state.interstitialCooldown.lastDismissalTime;

export const selectShouldShowAd = (state: RootState): boolean =>
    state.interstitialCooldown.shouldShowAd;

export const selectIsWithinCooldown = (state: RootState): boolean => {
    const last = state.interstitialCooldown.lastDismissalTime;
    if (last === null) return false;
    return Date.now() - last < COOLDOWN_DURATION_MS;
};

export default interstitialCooldownSlice.reducer;