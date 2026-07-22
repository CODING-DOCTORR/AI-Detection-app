// components/BannerAdComponent.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BannerAdId } from '../services/adsConfig';
import { useAppInitialization } from '../contexts/AppInitializationContext';

interface BannerAdComponentProps {
  size?: BannerAdSize;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
}) => {
  const { canCreateAds } = useAppInitialization();

  if (!canCreateAds) return null;

  return (
    <View style={{ alignItems: 'center', marginVertical: 8 }}>
      <Text style={{ color: '#9CA3AF', fontSize: 10, marginBottom: 4 }}>Ad</Text>
      <BannerAd
        unitId={BannerAdId}
        size={size}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdLoaded={() => {
          console.log('✅ Banner ad LOADED successfully. Unit ID:', BannerAdId);
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('❌ Banner ad FAILED to load. Unit ID:', BannerAdId);
          console.log('❌ Error code:', error?.code);
          console.log('❌ Error message:', error?.message);
          console.log('❌ Full error:', JSON.stringify(error));
        }}
        onAdOpened={() => {
          console.log('Banner ad opened');
        }}
      />
    </View>
  );
};

export default BannerAdComponent;