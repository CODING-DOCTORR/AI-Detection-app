import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import {
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from "react-native-google-mobile-ads";

import { useConsent } from "@/contexts/ConsentContext";
import { useTranslation } from "@/hooks/app/translation";
import { useThemeColors } from "@/hooks/ui/useThemeColors";
import { useNativeAdFromPool } from "@/hooks/ads/useNativeAdFromPool";
import { useAppSelector } from "@/store/hooks";
import { selectTheme } from "@/store/slices/themeSlice";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// Logical dp width < 380 covers most 720p devices (360dp at 2x density)
const isSmallScreen = SCREEN_WIDTH < 380;

interface NativeAdProps {
  type: "small" | "medium" | "large" | "full_screen" | "app_card";
  style?: any;
  placement?: string;
  visible?: boolean;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

const NativeAdComponent: React.FC<NativeAdProps> = ({
  type,
  style,
  placement = "default",
  visible = true,
  onAdLoaded,
}) => {
  const { canShowAds, isInitialized, isConsentFormVisible } = useConsent();
  const { isRTL, t } = useTranslation();
  const theme = useAppSelector(selectTheme);
  const colors = useThemeColors();
  const styles = createStyles(colors, theme);

  const gatesOpen =
    visible && isInitialized && !isConsentFormVisible && canShowAds();

  const nativeAd = useNativeAdFromPool(gatesOpen, placement);

  useEffect(() => {
    if (nativeAd) onAdLoaded?.();
  }, [nativeAd, onAdLoaded]);

  if (!gatesOpen) return null;
  if (!nativeAd) return null;

  const containerStyle = [
    type === "full_screen" ? styles.fullScreenContainer : styles.container,
    type === "small" && styles.smallContainer,
    style,
  ];

  return (
    <View style={[containerStyle, { direction: "ltr" }]}>
      <NativeAdView nativeAd={nativeAd}>
        {type === "small" ? (
          // Small: clean two-row layout — icon | headline + body+adlabel | cta
          <View style={styles.smallAd}>
            {nativeAd.icon && (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image
                  source={{ uri: nativeAd.icon.url }}
                  style={styles.smallAdIcon}
                  resizeMode="cover"
                />
              </NativeAsset>
            )}

            <View style={styles.smallAdContent}>
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={styles.smallAdHeadline} numberOfLines={1}>
                  {nativeAd.headline}
                </Text>
              </NativeAsset>

              <View style={styles.smallAdMeta}>
                <NativeAsset assetType={NativeAssetType.BODY}>
                  <Text style={styles.smallAdBody} numberOfLines={1}>
                    {nativeAd.body}
                  </Text>
                </NativeAsset>
                <View style={styles.adLabel}>
                  <Text style={styles.adLabelText}>{t("ads.badge")}</Text>
                </View>
              </View>
            </View>

            <View style={styles.smallAdCta}>
              <LinearGradient
                colors={["#3B82F6", "#1D4ED8"]}
                style={styles.smallAdCtaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                  <Text style={styles.smallAdCtaText} numberOfLines={1}>
                    {nativeAd.callToAction}
                  </Text>
                </NativeAsset>
              </LinearGradient>
            </View>
          </View>
        ) : type === "medium" ? (
          // Medium: image left | content right
          <View style={styles.mediumAd}>
            <View style={styles.mediumAdMediaWrapper}>
              <NativeMediaView
                style={styles.mediumAdImageContainer}
                resizeMode="contain"
              />
            </View>

            <View style={styles.mediumAdContent}>
              {/* Headline row with inline Ad label */}
              <View style={styles.mediumAdHeadlineRow}>
                <View style={styles.adLabel}>
                  <Text style={styles.adLabelText}>{t("ads.badge")}</Text>
                </View>
                {nativeAd.icon && (
                  <NativeAsset assetType={NativeAssetType.ICON}>
                    <Image
                      source={{ uri: nativeAd.icon.url }}
                      style={styles.mediumAdIcon}
                      resizeMode="cover"
                    />
                  </NativeAsset>
                )}
              </View>

              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={styles.mediumAdHeadline} numberOfLines={2}>
                  {nativeAd.headline}
                </Text>
              </NativeAsset>

              <NativeAsset assetType={NativeAssetType.BODY}>
                <Text style={styles.mediumAdBody} numberOfLines={2}>
                  {nativeAd.body}
                </Text>
              </NativeAsset>

              <View style={styles.mediumAdCtaRow}>
                <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                  <Text style={styles.mediumAdCta} numberOfLines={1}>
                    {nativeAd.callToAction}
                  </Text>
                </NativeAsset>
                <Ionicons
                  name={isRTL ? "chevron-back" : "chevron-forward"}
                  size={14}
                  color={colors.accent}
                />
              </View>
            </View>
          </View>
        ) : type === "large" ? (
          // Large: full-width image top, content below
          <View style={styles.largeAd}>
            <View style={styles.largeAdMediaContainer}>
              <NativeMediaView
                style={styles.largeAdImageContainer}
                resizeMode="cover"
              />
            </View>

            <View style={styles.largeAdContent}>
              <View style={styles.largeAdHeader}>
                {nativeAd.icon && (
                  <NativeAsset assetType={NativeAssetType.ICON}>
                    <Image
                      source={{ uri: nativeAd.icon.url }}
                      style={styles.largeAdIcon}
                      resizeMode="cover"
                    />
                  </NativeAsset>
                )}
                <View style={styles.largeAdInfo}>
                  <NativeAsset assetType={NativeAssetType.HEADLINE}>
                    <Text style={styles.largeAdHeadline} numberOfLines={2}>
                      {nativeAd.headline}
                    </Text>
                  </NativeAsset>
                  <NativeAsset assetType={NativeAssetType.BODY}>
                    <Text style={styles.largeAdBody} numberOfLines={2}>
                      {nativeAd.body}
                    </Text>
                  </NativeAsset>
                </View>
              </View>

              {/* Footer: Ad label left, CTA right */}
              <View style={styles.largeAdFooter}>
                <View style={styles.adLabel}>
                  <Text style={styles.adLabelText}>{t("ads.badge")}</Text>
                </View>
                <LinearGradient
                  colors={["#3B82F6", "#1D4ED8"]}
                  style={styles.largeAdCtaGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                    <Text style={styles.largeAdCtaText}>
                      {nativeAd.callToAction}
                    </Text>
                  </NativeAsset>
                </LinearGradient>
              </View>
            </View>
          </View>
        ) : type === "app_card" ? (
          // App Card: Ad badge top-left, large icon + name + stars, wide pill CTA
          <View style={styles.appCardAd}>
            {/* Ad badge */}
            <View style={styles.appCardAdLabel}>
              <Text style={styles.appCardAdLabelText}>{t("ads.badge")}</Text>
            </View>

            {/* Icon + info row */}
            <View style={styles.appCardRow}>
              {nativeAd.icon && (
                <NativeAsset assetType={NativeAssetType.ICON}>
                  <Image
                    source={{ uri: nativeAd.icon.url }}
                    style={styles.appCardIcon}
                    resizeMode="cover"
                  />
                </NativeAsset>
              )}

              <View style={styles.appCardInfo}>
                <NativeAsset assetType={NativeAssetType.HEADLINE}>
                  <Text style={styles.appCardHeadline} numberOfLines={1}>
                    {nativeAd.headline}
                  </Text>
                </NativeAsset>

                {/* Star rating row */}
                <View style={styles.appCardStarsRow}>
                  {nativeAd.starRating != null && (
                    <>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={
                            star <= Math.round(nativeAd.starRating ?? 0)
                              ? "star"
                              : "star-outline"
                          }
                          size={isSmallScreen ? 13 : 15}
                          color="#F59E0B"
                        />
                      ))}
                      <Text style={styles.appCardRatingText}>
                        ({nativeAd.starRating.toFixed(1)}/5.0)
                      </Text>
                    </>
                  )}
                  {nativeAd.starRating == null && (
                    <NativeAsset assetType={NativeAssetType.BODY}>
                      <Text style={styles.appCardBody} numberOfLines={1}>
                        {nativeAd.body}
                      </Text>
                    </NativeAsset>
                  )}
                </View>
              </View>
            </View>

            {/* Wide pill CTA */}
            <LinearGradient
              colors={["#42A5F5", "#1E88E5"]}
              style={styles.appCardCtaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                <Text style={styles.appCardCtaText}>
                  {nativeAd.callToAction}
                </Text>
              </NativeAsset>
            </LinearGradient>
          </View>
        ) : type === "full_screen" ? (
          // Full Screen: Immersive experience
          <View style={styles.fullScreenAd}>
            <View style={styles.fullScreenAdMediaContainer}>
              <NativeMediaView
                style={styles.fullScreenAdImageContainer}
                resizeMode="contain"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.fullScreenMediaGradient}
              />
            </View>

            <LinearGradient
              colors={
                theme === "dark"
                  ? [colors.cardBackground, colors.containerBackground]
                  : ["#1F2937", "#111827"]
              }
              style={styles.fullScreenAdContent}
            >
              <View style={styles.fullScreenAdHeader}>
                {nativeAd.icon && (
                  <NativeAsset assetType={NativeAssetType.ICON}>
                    <LinearGradient
                      colors={["#3B82F6", "#2563EB"]}
                      style={styles.fullScreenAdIconGradient}
                    >
                      <Image
                        source={{ uri: nativeAd.icon.url }}
                        style={styles.fullScreenAdIcon}
                        resizeMode="cover"
                      />
                    </LinearGradient>
                  </NativeAsset>
                )}

                <View style={styles.fullScreenAdInfo}>
                  <NativeAsset assetType={NativeAssetType.HEADLINE}>
                    <Text style={styles.fullScreenAdHeadline} numberOfLines={2}>
                      {nativeAd.headline}
                    </Text>
                  </NativeAsset>

                  <NativeAsset assetType={NativeAssetType.BODY}>
                    <Text style={styles.fullScreenAdBody} numberOfLines={3}>
                      {nativeAd.body}
                    </Text>
                  </NativeAsset>
                </View>
              </View>

              <View style={styles.fullScreenAdFooter}>
                <View style={styles.fullScreenAdCtaButton}>
                  <LinearGradient
                    colors={["#3B82F6", "#1D4ED8"]}
                    style={styles.fullScreenAdCtaGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                      <Text style={styles.fullScreenAdCtaText}>
                        {nativeAd.callToAction}
                      </Text>
                    </NativeAsset>
                    <View style={styles.fullScreenCtaIconWrapper}>
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#FFFFFF"
                      />
                    </View>
                  </LinearGradient>
                </View>
                <View style={styles.fullScreenAdLabelRow}>
                  <View style={styles.adLabel}>
                    <Text style={[styles.adLabelText, styles.fullScreenAdLabelText]}>
                      {t("ads.badge")}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        ) : null}
      </NativeAdView>
    </View>
  );
};

// Create styles function that uses theme colors
const createStyles = (
  colors: typeof import("@/constants/theme").Colors.light,
  theme: "light" | "dark"
) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: isSmallScreen ? 8 : 10,
      // marginHorizontal:1,
      marginBottom: 16,
      // elevation:3,
      borderWidth: 1,
      borderColor: theme === "dark" ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 0, 0, 0.1)",
    },
    smallContainer: {
      borderRadius: 16,
    },
    errorContainer: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 16,
    },
    errorGradient: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingHorizontal: 16,
      borderRadius: 16,
    },
    errorIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme === "dark" ? colors.cardBackground : "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      fontSize: 14,
      color: theme === "dark" ? "#FCA5A5" : "#991B1B",
      fontWeight: "600",
    },

    // Inline Ad Label — Google-compliant, non-overlapping
    adLabel: {
      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.12)" : "#E8F0FE",
      borderWidth: 1,
      borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#C5D4F0",
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
    },
    adLabelText: {
      fontSize: 10,
      fontWeight: "700",
      color: theme === "dark" ? "rgba(255,255,255,0.8)" : "#1A73E8",
      letterSpacing: 0.3,
    },

    // ── Small Ad ──────────────────────────────────────────────────────────
    smallAd: {
      flexDirection: "row",
      alignItems: "center",
      gap: isSmallScreen ? 8 : 12,
      paddingHorizontal: isSmallScreen ? 10 : 14,
      paddingVertical: isSmallScreen ? 10 : 12,
    },
    smallAdIcon: {
      width: isSmallScreen ? 42 : 52,
      height: isSmallScreen ? 42 : 52,
      borderRadius: isSmallScreen ? 10 : 12,
    },
    smallAdContent: {
      flex: 1,
      justifyContent: "center",
      gap: 4,
    },
    smallAdHeadline: {
      fontSize: isSmallScreen ? 13 : 14,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: isSmallScreen ? 17 : 19,
    },
    smallAdMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    smallAdBody: {
      flex: 1,
      fontSize: isSmallScreen ? 11 : 12,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    smallAdCta: {
      borderRadius: isSmallScreen ? 8 : 10,
      overflow: "hidden",
      flexShrink: 0,
    },
    smallAdCtaGradient: {
      paddingHorizontal: isSmallScreen ? 10 : 14,
      paddingVertical: isSmallScreen ? 8 : 10,
      alignItems: "center",
      justifyContent: "center",
      minWidth: isSmallScreen ? 70 : 80,
    },
    smallAdCtaText: {
      fontSize: isSmallScreen ? 12 : 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    // ── Medium Ad ─────────────────────────────────────────────────────────
    mediumAd: {
      flexDirection: "row",
      gap: isSmallScreen ? 10 : 12,
      alignItems: "stretch",
    },
    mediumAdMediaWrapper: {
      width: isSmallScreen ? 100 : 120,
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      overflow: "hidden",
      // backgroundColor:'red'
    },
    mediumAdImageContainer: {
      width: "100%",
      alignItems:'center',
      justifyContent:'center',
      alignSelf:'center',
      flex: 1,
    },
    mediumAdContent: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: isSmallScreen ? 10 : 12,
      paddingRight: isSmallScreen ? 10 : 14,
      gap: isSmallScreen ? 4 : 6,
    },
    mediumAdHeadlineRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    mediumAdIcon: {
      width: isSmallScreen ? 18 : 20,
      height: isSmallScreen ? 18 : 20,
      borderRadius: 4,
    },
    mediumAdHeadline: {
      fontSize: isSmallScreen ? 13 : 14,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: isSmallScreen ? 17 : 19,
    },
    mediumAdBody: {
      fontSize: isSmallScreen ? 11 : 12,
      color: colors.textSecondary,
      lineHeight: isSmallScreen ? 15 : 17,
      fontWeight: "400",
    },
    mediumAdCtaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    mediumAdCta: {
      fontSize: isSmallScreen ? 12 : 13,
      fontWeight: "700",
      color: colors.accent,
    },

    // ── Large Ad ──────────────────────────────────────────────────────────
    largeAd: {},
    largeAdMediaContainer: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    largeAdImageContainer: {
      height: isSmallScreen ? 160 : 200,
      width: "100%",
    },
    largeAdContent: {
      padding: isSmallScreen ? 12 : 16,
      gap: isSmallScreen ? 8 : 12,
    },
    largeAdHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: isSmallScreen ? 10 : 12,
    },
    largeAdIcon: {
      width: isSmallScreen ? 36 : 44,
      height: isSmallScreen ? 36 : 44,
      borderRadius: isSmallScreen ? 9 : 11,
    },
    largeAdInfo: {
      flex: 1,
      gap: 3,
    },
    largeAdHeadline: {
      fontSize: isSmallScreen ? 14 : 16,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: isSmallScreen ? 18 : 21,
    },
    largeAdBody: {
      fontSize: isSmallScreen ? 12 : 13,
      color: colors.textSecondary,
      lineHeight: isSmallScreen ? 16 : 18,
      fontWeight: "400",
    },
    // Footer: Ad label left + CTA button right
    largeAdFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    largeAdCtaGradient: {
      borderRadius: isSmallScreen ? 10 : 12,
      overflow: "hidden",
      paddingHorizontal: isSmallScreen ? 18 : 24,
      paddingVertical: isSmallScreen ? 10 : 12,
      alignItems: "center",
      justifyContent: "center",
    },
    largeAdCtaText: {
      fontSize: isSmallScreen ? 13 : 15,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    // ── App Card Ad ───────────────────────────────────────────────────────
    appCardAd: {
      padding: isSmallScreen ? 5 : 8,
      gap: isSmallScreen ? 5 : 8,
    },
    appCardAdLabel: {
      alignSelf: "flex-start",
      backgroundColor: "#1A73E8",
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 5,
    },
    appCardAdLabelText: {
      fontSize: 10,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 0.3,
    },
    appCardRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: isSmallScreen ? 10 : 14,
    },
    appCardIcon: {
      width: isSmallScreen ? 54 : 64,
      height: isSmallScreen ? 54 : 64,
      borderRadius: isSmallScreen ? 12 : 14,
    },
    appCardInfo: {
      flex: 1,
      gap: 5,
    },
    appCardHeadline: {
      fontSize: isSmallScreen ? 15 : 17,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    appCardStarsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    appCardRatingText: {
      fontSize: isSmallScreen ? 11 : 12,
      color: colors.textSecondary,
      fontWeight: "500",
      marginLeft: 4,
    },
    appCardBody: {
      fontSize: isSmallScreen ? 11 : 12,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    appCardCtaGradient: {
      borderRadius: 30,
      paddingVertical: isSmallScreen ? 12 : 14,
      alignItems: "center",
      justifyContent: "center",
    },
    appCardCtaText: {
      fontSize: isSmallScreen ? 14 : 16,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },

    // Full Screen Ad Styles
    fullScreenContainer: {
      marginHorizontal: 0,
      marginVertical: 0,
      borderRadius: 0,
      padding: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
    fullScreenAd: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: "#000",
    },
    fullScreenAdMediaContainer: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.6,
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",
    },
    fullScreenAdImageContainer: {
      width: "100%",
      height: "100%",
    },
    fullScreenMediaGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    fullScreenAdContent: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.4,
      paddingHorizontal: isSmallScreen ? 16 : 24,
      paddingTop: isSmallScreen ? 16 : 24,
      paddingBottom: isSmallScreen ? 20 : 32,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    fullScreenAdHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: isSmallScreen ? 12 : 16,
    },
    fullScreenAdIconGradient: {
      width: isSmallScreen ? 44 : 56,
      height: isSmallScreen ? 44 : 56,
      borderRadius: 16,
      padding: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    fullScreenAdIcon: {
      width: isSmallScreen ? 40 : 52,
      height: isSmallScreen ? 40 : 52,
      borderRadius: 14,
    },
    fullScreenAdInfo: {
      flex: 1,
    },
    fullScreenAdHeadline: {
      fontSize: isSmallScreen ? 17 : 22,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 8,
      lineHeight: isSmallScreen ? 22 : 28,
      letterSpacing: -0.5,
    },
    fullScreenAdBody: {
      fontSize: isSmallScreen ? 13 : 15,
      color: "#D1D5DB",
      lineHeight: isSmallScreen ? 18 : 22,
      fontWeight: "500",
    },
    fullScreenAdFooter: {
      width: "100%",
      alignItems: "center",
    },
    fullScreenAdCtaButton: {
      borderRadius: 20,
      overflow: "hidden",
      width: "100%",
    },
    fullScreenAdCtaGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: isSmallScreen ? 20 : 32,
      paddingVertical: isSmallScreen ? 14 : 18,
      gap: 12,
    },
    fullScreenAdCtaText: {
      fontSize: isSmallScreen ? 15 : 18,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    fullScreenCtaIconWrapper: {
      width: isSmallScreen ? 26 : 32,
      height: isSmallScreen ? 26 : 32,
      borderRadius: isSmallScreen ? 13 : 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    fullScreenAdLabelRow: {
      marginTop: 10,
      alignItems: "center",
    },
    fullScreenAdLabelText: {
      color: "rgba(255,255,255,0.7)",
      borderColor: "rgba(255,255,255,0.25)",
    },
  });

export default NativeAdComponent;
