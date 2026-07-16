import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface AppPreferencesState {
    isPro: boolean;
}

const initialState: AppPreferencesState = {
    isPro: false,
};

const appPreferencesSlice = createSlice({
    name: 'appPreferences',
    initialState,
    reducers: {
        setIsPro(state, action: PayloadAction<boolean>) {
            state.isPro = action.payload;
        },
    },
});

export const { setIsPro } = appPreferencesSlice.actions;

export const selectIsProActive = (state: RootState): boolean =>
    state.appPreferences.isPro;

export const selectIsProEnabled = (state: RootState): boolean =>
    state.appPreferences.isPro;

export default appPreferencesSlice.reducer;