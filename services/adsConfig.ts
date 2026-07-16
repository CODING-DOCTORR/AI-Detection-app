import { Platform } from 'react-native';

// ── Official Google AdMob TEST ad-unit IDs ─────────────────────────────────────
// https://developers.google.com/admob/android/test-ads
// https://developers.google.com/admob/ios/test-ads

const TEST_IDS = {
    android: {
        banner: 'ca-app-pub-3940256099942544/9214589741',
        interstitial: 'ca-app-pub-3940256099942544/1033173712',
        native: 'ca-app-pub-3940256099942544/2247696110',
        appOpen: 'ca-app-pub-3940256099942544/9257395921',
        rewarded: 'ca-app-pub-3940256099942544/5224354917',
    },
    ios: {
        banner: 'ca-app-pub-3940256099942544/2435281174',
        interstitial: 'ca-app-pub-3940256099942544/4411468910',
        native: 'ca-app-pub-3940256099942544/3986624511',
        appOpen: 'ca-app-pub-3940256099942544/5575463023',
        rewarded: 'ca-app-pub-3940256099942544/1712485313',
    },
};

// ── Production IDs (replace before publishing) ─────────────────────────────────

const PROD_IDS = {
    android: {
        banner: 'YOUR_ANDROID_BANNER_AD_UNIT_ID',       // TODO: replace with real AdMob ad unit ID
        interstitial: 'YOUR_ANDROID_INTERSTITIAL_AD_UNIT_ID', // TODO: replace with real AdMob ad unit ID
        native: 'YOUR_ANDROID_NATIVE_AD_UNIT_ID',       // TODO: replace with real AdMob ad unit ID
        appOpen: 'YOUR_ANDROID_APP_OPEN_AD_UNIT_ID',     // TODO: replace with real AdMob ad unit ID
        rewarded: 'YOUR_ANDROID_REWARDED_AD_UNIT_ID',     // TODO: replace with real AdMob ad unit ID
    },
    ios: {
        banner: 'YOUR_IOS_BANNER_AD_UNIT_ID',           // TODO: replace with real AdMob ad unit ID
        interstitial: 'YOUR_IOS_INTERSTITIAL_AD_UNIT_ID',     // TODO: replace with real AdMob ad unit ID
        native: 'YOUR_IOS_NATIVE_AD_UNIT_ID',           // TODO: replace with real AdMob ad unit ID
        appOpen: 'YOUR_IOS_APP_OPEN_AD_UNIT_ID',         // TODO: replace with real AdMob ad unit ID
        rewarded: 'YOUR_IOS_REWARDED_AD_UNIT_ID',         // TODO: replace with real AdMob ad unit ID
    },
};

// ── Resolve IDs ────────────────────────────────────────────────────────────────

const ids = (() => {
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    return __DEV__ ? TEST_IDS[platform] : PROD_IDS[platform];
})();

export const BannerAdId = ids.banner;
export const InterstitialAdId = ids.interstitial;
export const NativeAdId = ids.native;
export const AppOpenAdId = ids.appOpen;
export const RewardedAdId = ids.rewarded;