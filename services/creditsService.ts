// services/creditsService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDITS_KEY = '@app_credits';
const INITIAL_CREDIT_FLAG = '@app_initial_credit_given';
const INITIAL_FREE_CREDITS = 1;

// ═══════════════════════════════════════════════════════════════
// GET CURRENT CREDITS
// ═══════════════════════════════════════════════════════════════
export const getCredits = async (): Promise<number> => {
    try {
        const stored = await AsyncStorage.getItem(CREDITS_KEY);
        if (stored === null) {
            // First time — give initial free credits
            const hasReceivedInitial = await AsyncStorage.getItem(INITIAL_CREDIT_FLAG);
            if (!hasReceivedInitial) {
                await AsyncStorage.setItem(CREDITS_KEY, String(INITIAL_FREE_CREDITS));
                await AsyncStorage.setItem(INITIAL_CREDIT_FLAG, 'true');
                console.log(`💰 Gave initial ${INITIAL_FREE_CREDITS} free credit(s) to new user`);
                return INITIAL_FREE_CREDITS;
            }
            return 0;
        }
        return parseInt(stored, 10);
    } catch (e) {
        console.log('Error getting credits:', e);
        return 0;
    }
};

// ═══════════════════════════════════════════════════════════════
// SET CREDITS (used internally by Redux slice)
// ═══════════════════════════════════════════════════════════════
export const setCredits = async (amount: number): Promise<void> => {
    try {
        const safeAmount = Math.max(0, amount);
        await AsyncStorage.setItem(CREDITS_KEY, String(safeAmount));
        console.log(`💰 Credits set to: ${safeAmount}`);
    } catch (e) {
        console.log('Error setting credits:', e);
    }
};

// ═══════════════════════════════════════════════════════════════
// ADD CREDITS (e.g., after watching rewarded ad)
// ═══════════════════════════════════════════════════════════════
export const addCredits = async (amount: number): Promise<number> => {
    try {
        const current = await getCredits();
        const newTotal = current + amount;
        await setCredits(newTotal);
        console.log(`💰 Added ${amount} credit(s). New total: ${newTotal}`);
        return newTotal;
    } catch (e) {
        console.log('Error adding credits:', e);
        return 0;
    }
};

// ═══════════════════════════════════════════════════════════════
// DEDUCT CREDITS (called before analysis)
// ═══════════════════════════════════════════════════════════════
export const deductCredits = async (amount: number = 1): Promise<number> => {
    try {
        const current = await getCredits();
        const newTotal = Math.max(0, current - amount);
        await setCredits(newTotal);
        console.log(`💰 Deducted ${amount} credit(s). Remaining: ${newTotal}`);
        return newTotal;
    } catch (e) {
        console.log('Error deducting credits:', e);
        return 0;
    }
};

// ═══════════════════════════════════════════════════════════════
// RESET CREDITS (for testing/debug)
// ═══════════════════════════════════════════════════════════════
export const resetCredits = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(CREDITS_KEY);
        await AsyncStorage.removeItem(INITIAL_CREDIT_FLAG);
        console.log('💰 Credits reset (initial flag cleared)');
    } catch (e) {
        console.log('Error resetting credits:', e);
    }
};