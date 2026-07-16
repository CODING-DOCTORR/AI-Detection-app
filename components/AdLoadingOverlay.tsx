import { useThemeColors } from "@/hooks/ui/useThemeColors";
import LottieView from "lottie-react-native";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface AdLoadingOverlayProps {
  visible: boolean;
  /** iOS-only: fires once the modal's view controller is fully dismissed. Wire
   *  this when a native ad is presented immediately after, so the ad doesn't
   *  present over a dismissing modal (causes a touch-blocking overlay). */
  onDismiss?: () => void;
}

export const AdLoadingOverlay: React.FC<AdLoadingOverlayProps> = ({
  visible,
  onDismiss,
}) => {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onDismiss={onDismiss}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LottieView
          source={require("@/assets/lottie/LoadingV2.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Loading Ad
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 160,
    height: 160,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

export default AdLoadingOverlay;
