import { SettingSection } from '../types/settings.types';

export const getSettingsSections = (handlers: {
  onProfileInfo: () => void;
  on2FA: () => void;
  onPrivacy: () => void;
  onNotifications: () => void;
  onAppearance: () => void;
  onLanguage: () => void;
  onAbout: () => void;
  onTerms: () => void;
}): SettingSection[] => [
  {
    id: 'account',
    title: 'ACCOUNT & SECURITY',
    items: [
      {
        id: 'profile',
        label: 'Profile Information',
        icon: 'User',
        type: 'navigate',
        onPress: handlers.onProfileInfo,
      },
      
      {
        id: 'privacy',
        label: 'Privacy & Permissions',
        icon: 'ShieldOff',
        type: 'navigate',
        onPress: handlers.onPrivacy,
      },
    ],
  },
  {
    id: 'preferences',
    title: 'PREFERENCES',
    items: [
      
      {
        id: 'appearance',
        label: 'Appearance',
        icon: 'Palette',
        type: 'value',
        value: 'System',
        onPress: handlers.onAppearance,
      },
      {
        id: 'language',
        label: 'Language',
        icon: 'Globe',
        type: 'value',
        value: 'English (US)',
        onPress: handlers.onLanguage,
      },
    ],
  },
  {
    id: 'application',
    title: 'APPLICATION',
    items: [
      {
        id: 'about',
        label: 'About Deepfake Analysis',
        icon: 'Info',
        type: 'navigate',
        onPress: handlers.onAbout,
      },
      {
        id: 'terms',
        label: 'Terms of Service',
        icon: 'FileText',
        type: 'navigate',
        onPress: handlers.onTerms,
      },
    ],
  },
];
