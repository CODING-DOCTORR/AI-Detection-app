import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import type { RootState } from '../index';
import {
    BannerAdId,
    InterstitialAdId,
    NativeAdId,
    AppOpenAdId,
    RewardedAdId,
} from '../../services/adsConfig';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PlacementConfig {
    Screen_Open_Interstitial: number;
    Screen_Open_Count: number;
    Home_Button_Count: number;
    Home_Button_Cooldown: number;
    Bottom_Tab_Interstitial: number;
    Bottom_Tab_Count: number;
    Bottom_Tab_Cooldown: number;
    [key: string]: number;
}

export interface PlatformAdConfig {
    bannerAdId: string;
    interstitialAdId: string;
    rewardedAdId: string;
    nativeAdId: string;
    appOpenAdId: string;
    placements: PlacementConfig;
}

interface AdsConfigState {
    android: PlatformAdConfig;
    ios: PlatformAdConfig;
    loading: boolean;
    error: string | null;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const buildDefaultPlacements = (): PlacementConfig => ({
    Screen_Open_Interstitial: 1,
    Screen_Open_Count: 3,
    Home_Button_Count: 3,
    Home_Button_Cooldown: 2,
    Bottom_Tab_Interstitial: 1,
    Bottom_Tab_Count: 3,
    Bottom_Tab_Cooldown: 2,
    home_screen: 1,
    history_screen: 1,
    result_screen: 3,
    settings_screen: 0,
    upload_screen: 1,
    profile_screen: 0,
});

const buildPlatformConfig = (): PlatformAdConfig => ({
    bannerAdId: BannerAdId,
    interstitialAdId: InterstitialAdId,
    rewardedAdId: RewardedAdId,
    nativeAdId: NativeAdId,
    appOpenAdId: AppOpenAdId,
    placements: buildDefaultPlacements(),
});

const initialState: AdsConfigState = {
    android: buildPlatformConfig(),
    ios: buildPlatformConfig(),
    loading: false,
    error: null,
};

// ── Async thunk (stub — wire to Firebase Remote Config later) ──────────────────

export const fetchAdsConfig = createAsyncThunk(
    'adsConfig/fetch',
    async (_, { rejectWithValue }) => {
        try {
            await new Promise((r) => setTimeout(r, 300));
            return {
                android: buildPlatformConfig(),
                ios: buildPlatformConfig(),
            };
        } catch (e: any) {
            return rejectWithValue(e?.message ?? 'Failed to fetch ads config');
        }
    },
);

// ── Helper: normalize partial placements into a full PlacementConfig ───────────

const mergePlacements = (
    current: PlacementConfig,
    updates: Partial<PlacementConfig>,
): PlacementConfig => {
    const merged: PlacementConfig = { ...current };
    for (const key of Object.keys(updates)) {
        const value = updates[key];
        merged[key] = typeof value === 'number' ? value : 0;
    }
    return merged;
};

// ── Slice ──────────────────────────────────────────────────────────────────────

const adsConfigSlice = createSlice({
    name: 'adsConfig',
    initialState,
    reducers: {
        setAdsConfig(state, action: PayloadAction<Partial<AdsConfigState>>) {
            return { ...state, ...action.payload };
        },
        updatePlacements(
            state,
            action: PayloadAction<{
                platform: 'android' | 'ios';
                placements: Partial<PlacementConfig>;
            }>,
        ) {
            const { platform, placements } = action.payload;
            state[platform].placements = mergePlacements(
                state[platform].placements,
                placements,
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdsConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdsConfig.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.android) state.android = action.payload.android;
                if (action.payload.ios) state.ios = action.payload.ios;
            })
            .addCase(fetchAdsConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? 'Unknown error';
            });
    },
});

export const { setAdsConfig, updatePlacements } = adsConfigSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectAdsConfig = (state: RootState) => state.adsConfig;

export const selectAdsConfigLoading = (state: RootState) =>
    state.adsConfig.loading;

export const selectAdsConfigError = (state: RootState) =>
    state.adsConfig.error;

export const selectPlatformAdsConfig = (state: RootState): PlatformAdConfig =>
    Platform.OS === 'ios' ? state.adsConfig.ios : state.adsConfig.android;

export const selectPlacementValue =
    (placementKey: string) =>
        (state: RootState): number => {
            const cfg =
                Platform.OS === 'ios' ? state.adsConfig.ios : state.adsConfig.android;
            return cfg.placements[placementKey] ?? 0;
        };

export const selectShouldShowAd =
    (placementKey: string) =>
        (state: RootState): boolean =>
            selectPlacementValue(placementKey)(state) > 0;

export default adsConfigSlice.reducer;