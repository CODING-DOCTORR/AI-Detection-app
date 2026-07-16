// store/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface ThemeColors {
    background: string;
    card: string;
    card2: string;
    cardBackground: string;
    containerBackground: string;
    border: string;
    accent: string;
    accentSoft: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    badge: string;
    badgeText: string;
}

export interface ThemeState {
    mode: 'light' | 'dark';
    colors: ThemeColors;
}

const darkColors: ThemeColors = {
    background: '#0D0B14',
    card: '#1A1826',
    card2: '#1E1B2E',
    cardBackground: '#1A1826',
    containerBackground: '#0D0B14',
    border: '#2A2740',
    accent: '#A69EFF',
    accentSoft: '#818cf8',
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textMuted: 'rgba(255,255,255,0.4)',
    badge: 'rgba(166,158,255,0.2)',
    badgeText: '#A69EFF',
};

const lightColors: ThemeColors = {
    background: '#FFFFFF',
    card: '#F9FAFB',
    card2: '#F3F4F6',
    cardBackground: '#F9FAFB',
    containerBackground: '#FFFFFF',
    border: '#E5E7EB',
    accent: '#4F46E5',
    accentSoft: '#818cf8',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    badge: 'rgba(79,70,229,0.15)',
    badgeText: '#4F46E5',
};

const initialState: ThemeState = {
    mode: 'dark',
    colors: darkColors,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeMode(state, action: PayloadAction<'light' | 'dark'>) {
            state.mode = action.payload;
            state.colors = action.payload === 'dark' ? darkColors : lightColors;
        },
        toggleTheme(state) {
            const newMode = state.mode === 'dark' ? 'light' : 'dark';
            state.mode = newMode;
            state.colors = newMode === 'dark' ? darkColors : lightColors;
        },
    },
});

export const { setThemeMode, toggleTheme } = themeSlice.actions;

// Selectors
export const selectTheme = (state: RootState) => state.theme;
export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectThemeColors = (state: RootState) => state.theme.colors;

export default themeSlice.reducer;