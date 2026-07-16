import { configureStore } from '@reduxjs/toolkit';
import adsConfigReducer from '../store/slices/adsConfigSlice';
import appPreferencesReducer from '../store/slices/appPreferencesSlice'
import interstitialCooldownReducer from '../store/slices/interstitialCooldownSlice'

export const store = configureStore({
    reducer: {
        adsConfig: adsConfigReducer,
        appPreferences: appPreferencesReducer,
        interstitialCooldown: interstitialCooldownReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;