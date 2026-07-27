// hooks/useCredits.ts
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store/hooks';
import { AppDispatch } from '../store';
import {
    loadCredits,
    addCredits as addCreditsAction,
    deductCredits as deductCreditsAction,
    selectCreditsBalance,
    selectCreditsInitialized,
} from '../store/slices/creditsSlice';
import { selectIsProActive } from '../store/slices/appPreferencesSlice';
import { useRewardedAd } from './ads/useRewardedAd';

interface UseCreditsReturn {
    balance: number;
    isPro: boolean;
    isUnlimited: boolean;             // true if Pro (bypass credit system)
    hasCredits: boolean;               // true if balance > 0
    canAnalyze: boolean;               // true if Pro OR balance > 0
    isRewardedAdReady: boolean;
    isRewardedAdLoading: boolean;
    deductOne: () => Promise<void>;
    watchAdForCredit: () => Promise<{ success: boolean; error?: string }>;
}

export const useCredits = (): UseCreditsReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const balance = useAppSelector(selectCreditsBalance);
    const initialized = useAppSelector(selectCreditsInitialized);
    const isPro = useAppSelector(selectIsProActive);
    const { loaded: isRewardedAdReady, loading: isRewardedAdLoading, showAd } = useRewardedAd();

    // Auto-load credits on first render
    useEffect(() => {
        if (!initialized) {
            dispatch(loadCredits());
        }
    }, [initialized, dispatch]);

    const deductOne = useCallback(async () => {
        if (isPro) return; // Pro users never deduct
        await dispatch(deductCreditsAction(1));
    }, [isPro, dispatch]);

    const watchAdForCredit = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await showAd();

            if (result.earned) {
                // Grant +1 credit
                await dispatch(addCreditsAction(1));
                return { success: true };
            }

            return { success: false, error: result.error || 'Ad was not completed' };
        } catch (e: any) {
            return { success: false, error: e?.message || 'Failed to show ad' };
        }
    }, [showAd, dispatch]);

    return {
        balance,
        isPro,
        isUnlimited: isPro,
        hasCredits: balance > 0,
        canAnalyze: isPro || balance > 0,
        isRewardedAdReady,
        isRewardedAdLoading,
        deductOne,
        watchAdForCredit,
    };
};