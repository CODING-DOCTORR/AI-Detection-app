// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import adsConfigReducer from './slices/adsConfigSlice';
import appPreferencesReducer from './slices/appPreferencesSlice';
import interstitialCooldownReducer from './slices/interstitialCooldownSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
    reducer: {
        adsConfig: adsConfigReducer,
        appPreferences: appPreferencesReducer,
        interstitialCooldown: interstitialCooldownReducer,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;