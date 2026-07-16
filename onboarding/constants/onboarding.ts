export const COLORS = {
  primary: '#1A56DB',
  primaryLight: '#EEF2FF',
  white: '#FFFFFF',
  background: '#F4F6FB',
  textDark: '#111827',
  textMuted: '#6B7280',
  success: '#16A34A',
  warning: '#F59E0B',
  border: '#E5E7EB',
  cardBg: '#FFFFFF',
  scanLine: '#3B82F6',
};

export const FONTS = {
  heading: 32,
  subheading: 20,
  body: 15,
  small: 13,
  label: 12,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export interface OnboardingSlide {
  id: string;
  badge?: string;
  title: string;
  description: string;
  imageType: 'face' | 'server' | 'verify';
  features?: { icon: string; label: string; description: string }[];
  tags?: { label: string; type: 'success' | 'info' | 'warning' }[];
  buttonLabel: string;
  showSkip?: boolean;
  skipLabel?: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'slide1',
    imageType: 'face',
    badge: 'VERACITY SHIELD',
    title: 'AI-Powered Precision',
    description:
      'Our multi-layered neural networks analyze biometric markers, lighting inconsistencies, and acoustic artifacts with forensic accuracy.',
    tags: [
      { label: 'Deep Layer Analysis', type: 'info' },
      { label: '89% Confidence', type: 'success' },
    ],
    buttonLabel: 'Next',
    skipLabel: 'Skip Introduction',
    showSkip: true,
  },
  {
    id: 'slide2',
    imageType: 'server',
    title: 'Secure Your Content.',
    description:
      'Your data is protected with clinical precision and military-grade encryption. No one else has access.',
    features: [
      {
        icon: '🔒',
        label: 'End-to-End Encryption',
        description: 'Your uploads are encrypted before they even leave your device.',
      },
      {
        icon: '👁️',
        label: 'Zero-Knowledge Policy',
        description: 'We never store your personal biometrics or raw video data.',
      },
    ],
    buttonLabel: 'Get Started',
    showSkip: false,
  },
  {
    id: 'slide3',
    imageType: 'verify',
    badge: 'Deepfake',
    title: 'Detect. Verify. Trust.',
    description:
      'Advanced AI forensic analysis to protect your digital identity and restore truth in every pixel.',
    tags: [
      { label: 'VERIFIED  98.4%', type: 'success' },
      { label: 'Threat Detected', type: 'warning' },
    ],
    buttonLabel: 'Next',
    showSkip: true,
    skipLabel: 'Skip',
  },
];
