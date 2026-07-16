import { useAppInitialization } from "@/contexts/AppInitializationContext";
import { useConsent } from "@/contexts/ConsentContext";
import { BannerAdId } from "@/services/adsConfig";
import { selectPlacementValue } from "@/store/slices/adsConfigSlice";
import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { useSelector } from "react-redux";

interface Props {
  placement: string;
  visible: boolean;
  adUnitId?: string;
  size?: any;
  style?: StyleProp<ViewStyle>;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

const BannerAdComponent: React.FC<Props> = ({
  placement,
  visible,
  adUnitId,
  size,
  style,
  onAdLoaded,
  onAdFailedToLoad,
}) => {
  const { canShowAds, isInitialized, isConsentFormVisible } = useConsent();
  const { isAppReady, isAdsInitialized } = useAppInitialization();
  const isFocused = useIsFocused();

  // Get placement value using the same logic as splash screen
  const placementValue = useSelector(selectPlacementValue(placement as any));

  // If the parent says not visible, don't create the ad at all
  if (!visible) return null;

  // Screens stay mounted under the navigation stack; an unfocused banner keeps
  // auto-refreshing (matched requests) while physically invisible (no
  // impressions), which tanks AdMob show-rate.
  if (!isFocused) return null;

  // Respect app initialization state
  if (!isAppReady || !isAdsInitialized) return null;

  // Respect consent state
  if (!isInitialized || isConsentFormVisible || !canShowAds()) return null;

  // Respect remote-config placement flags - only show if placement value is 1 (banner)
  if (placementValue !== 1) return null;

  const unitId = adUnitId || BannerAdId;

  // Some versions of the ad SDK type the exported component in a way
  // that TypeScript/JSX does not accept. Cast to any to render safely.
  const AnyBanner: any = BannerAd as any;

  return (
    <View
      style={[
        { width: "100%", alignItems: "center", justifyContent: "center" },
        style,
      ]}
    >
      <AnyBanner
        unitId={unitId}
        size={(size as any) || BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: !canShowAds() }}
        onAdLoaded={() => {
          // ToastAndroid.show('📊 A?d loaded successfully '+placement, ToastAndroid.SHORT);
          console.log("📊 Ad loaded successfully " + placement);
          onAdLoaded?.();
        }}
        onAdFailedToLoad={(err: any) => onAdFailedToLoad?.(err)}
      />
    </View>
  );
};

export default BannerAdComponent;
