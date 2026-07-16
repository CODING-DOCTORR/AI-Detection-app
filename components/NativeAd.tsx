// components/NativeAd.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useNativeAdFromPool } from '../hooks/ads/useNativeAdFromPool';
import { useAppSelector } from '../store/hooks';
import { selectThemeColors } from '../store/slices/themeSlice';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL_DEVICE = SCREEN_WIDTH < 380;

type NativeAdSize = 'small' | 'medium' | 'large' | 'full_screen' | 'app_card';

interface NativeAdProps {
  size?: NativeAdSize;
}

const HEIGHT_MAP: Record<NativeAdSize, number> = {
  small: IS_SMALL_DEVICE ? 70 : 80,
  medium: IS_SMALL_DEVICE ? 130 : 150,
  large: IS_SMALL_DEVICE ? 240 : 280,
  full_screen: SCREEN_HEIGHT * 0.6,
  app_card: IS_SMALL_DEVICE ? 180 : 200,
};

const NativeAdComponent: React.FC<NativeAdProps> = ({ size = 'medium' }) => {
  const { adItem } = useNativeAdFromPool();
  const colors = useAppSelector(selectThemeColors);

  if (!adItem) return null;

  return (
    <View
      style={{
        height: HEIGHT_MAP[size],
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginHorizontal: 16,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      {/* Ad badge */}
      <View
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: colors.badge,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            color: colors.badgeText,
            fontSize: 10,
            fontWeight: '700',
          }}
        >
          Ad
        </Text>
      </View>

      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 14,
          fontWeight: '600',
          marginTop: 8,
        }}
      >
        Native Ad ({size})
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 11,
          marginTop: 4,
        }}
      >
        Sponsored content placeholder
      </Text>
    </View>
  );
};

export default NativeAdComponent;