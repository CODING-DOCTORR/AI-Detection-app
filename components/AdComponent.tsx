// components/AdComponent.tsx
import React from 'react';
import BannerAdComponent from './BannerAdComponent';
import NativeAd from './NativeAd';
import { useAppSelector } from '../store/hooks';
import { selectPlacementValue } from '../store/slices/adsConfigSlice';
import { selectIsProActive } from '../store/slices/appPreferencesSlice';

interface AdComponentProps {
  placement: string;
}

// Placement value meaning:
// 0 = no ad
// 1 = banner
// 2 = native small
// 3 = native medium
// 4 = native large
// 5 = app_card
const SIZE_MAP: Record<number, 'small' | 'medium' | 'large' | 'full_screen' | 'app_card'> = {
  2: 'small',
  3: 'medium',
  4: 'large',
  5: 'app_card',
};

const AdComponent: React.FC<AdComponentProps> = ({ placement }) => {
  const placementValue = useAppSelector(selectPlacementValue(placement));
  const isPro = useAppSelector(selectIsProActive);

  // Pro users don't see ads
  if (isPro) return null;

  // No ad for this placement
  if (placementValue === 0) return null;

  // Banner ad
  if (placementValue === 1) return <BannerAdComponent />;

  // Native ad (sizes 2-5)
  const nativeSize = SIZE_MAP[placementValue];
  if (nativeSize) return <NativeAd size={nativeSize} />;

  // Fallback to banner
  return <BannerAdComponent />;
};

export default AdComponent;