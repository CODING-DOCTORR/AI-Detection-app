import { I18nManager } from 'react-native';

const strings: Record<string, string> = {
    'ads.badge': 'Ad',
    'ads.loading': 'Loading\u2026',
    'ads.sponsored': 'Sponsored',
    'ads.continue': 'Continue',
};

export function useTranslation() {
    /** Look up a translation key; returns the key itself if not found. */
    const t = (key: string): string => strings[key] ?? key;

    /** True when the device locale is right-to-left. */
    const isRTL: boolean = I18nManager.isRTL;

    return { t, isRTL } as const;
}