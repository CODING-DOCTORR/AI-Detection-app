import { useColorScheme } from 'react-native';

interface ThemeColors {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
}

const LIGHT: ThemeColors = {
    background: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    accent: '#4F46E5',
};

const DARK: ThemeColors = {
    background: '#0D0B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    accent: '#A69EFF',
};

export function useThemeColors(): ThemeColors {
    const scheme = useColorScheme();
    return scheme === 'dark' ? DARK : DARK; // app is dark-only for now; swap to `LIGHT` for light mode
}