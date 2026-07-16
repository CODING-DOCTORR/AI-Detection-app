import { useConsent } from "@/contexts/ConsentContext";
import { selectPlacementValue } from "@/store/slices/adsConfigSlice";
import { selectIsProActive } from "@/store/slices/appPreferencesSlice";
import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useSelector } from "react-redux";
import BannerAdComponent from "./BannerAdComponent";
import NativeAdComponent from "./NativeAd";

interface Props {
  placement: string;
  visible?: boolean;
  media?: boolean;
  nativeAdType?: "small" | "medium" | "large" | "full_screen" | "app_card";
  style?: StyleProp<ViewStyle>;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

const AdComponent: React.FC<Props> = ({
  placement,
  visible = true,
  media = false,
  nativeAdType,
  style,
  onAdLoaded,
  onAdFailedToLoad,
}) => {
  const { canShowAds, isInitialized, isConsentFormVisible } = useConsent();
  // console.log("placement value in ad component", placement);  
  // console.log(isInitialized, isConsentFormVisible)
  const isPro = useSelector(selectIsProActive);

  // Get placement value using the same logic as splash screen
  const placementValue = useSelector(selectPlacementValue(placement as any));
  // If the parent says not visible, don't create the ad at all
  if (!visible) return null;

  // Pro users see no ads
  if (isPro) return null;

  // Respect consent state
  if (!isInitialized || isConsentFormVisible || !canShowAds()) return null;

  // Full screen ads bypass placement value check - they're explicitly requested

  // Check placement configuration for other ad types
  // 0 = no ad, 1 = banner ad, 2 = native ad
  if (placementValue === 0) return null;
  // console.log("placement value in ad component", placementValue);
  if (nativeAdType === "full_screen") {
    return (
      <NativeAdComponent
        type={"full_screen"}
        style={style}
        placement={placement}
        visible={visible}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    );
  }

  if (placementValue === 1) {
    return (
      <BannerAdComponent
        placement={placement}
        visible={visible}
        style={style}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    );
  }

  if (placementValue === 2) {
    return (
      <NativeAdComponent
        type={"small"}
        style={style}
        placement={placement}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    );
  }

  if (placementValue === 3) {
    return (
      <NativeAdComponent
        type={"medium"}
        style={style}
        placement={placement}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    );
  }

  if (placementValue === 4) {
    return (
      <NativeAdComponent
        type={"large"}
        style={style}
        placement={placement}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    );
  }

  if (placementValue === 5) {
    return (
      <NativeAdComponent
        type={"app_card"}
        style={style}
        placement={placement}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    );
  }

  // Default to null if placement is not 1 or 2, or if 0
  return null;
};

export default AdComponent;
