import { AdLoadingOverlay } from "../components/AdLoadingOverlay";
import React from "react";

interface AppOpenAdLoadingModalProps {
  visible: boolean;
  /** iOS-only: fires after the modal is fully dismissed. Used to safely present
   *  the native App Open ad without a view-controller presentation conflict. */
  onDismiss?: () => void;
}

/**
 * Loading animation shown while an App Open ad loads on-demand. Reuses the
 * shared full-screen Lottie overlay so interstitial and app-open loaders look
 * identical.
 */
export const AppOpenAdLoadingModal: React.FC<AppOpenAdLoadingModalProps> = ({
  visible,
  onDismiss,
}) => {
  return <AdLoadingOverlay visible={visible} onDismiss={onDismiss} />;
};
