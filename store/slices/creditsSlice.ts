// store/slices/creditsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import {
    getCredits,
    addCredits as addCreditsToStorage,
    deductCredits as deductCreditsFromStorage,
    setCredits as setCreditsInStorage,
} from '../../services/creditsService';

interface CreditsState {
    balance: number;
    loading: boolean;
    initialized: boolean;
}

const initialState: CreditsState = {
    balance: 0,
    loading: false,
    initialized: false,
};

// ═══════════════════════════════════════════════════════════════
// THUNK: Load credits from AsyncStorage on app startup
// ═══════════════════════════════════════════════════════════════
export const loadCredits = createAsyncThunk('credits/load', async () => {
    const balance = await getCredits();
    return balance;
});

// ═══════════════════════════════════════════════════════════════
// THUNK: Add credits (e.g., after rewarded ad)
// ═══════════════════════════════════════════════════════════════
export const addCredits = createAsyncThunk('credits/add', async (amount: number) => {
    const newBalance = await addCreditsToStorage(amount);
    return newBalance;
});

// ═══════════════════════════════════════════════════════════════
// THUNK: Deduct credits (before analysis)
// ═══════════════════════════════════════════════════════════════
export const deductCredits = createAsyncThunk('credits/deduct', async (amount: number = 1) => {
    const newBalance = await deductCreditsFromStorage(amount);
    return newBalance;
});

// ═══════════════════════════════════════════════════════════════
// SLICE
// ═══════════════════════════════════════════════════════════════
const creditsSlice = createSlice({
    name: 'credits',
    initialState,
    reducers: {
        setBalance(state, action: PayloadAction<number>) {
            state.balance = Math.max(0, action.payload);
            setCreditsInStorage(action.payload); // Also update storage
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCredits.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadCredits.fulfilled, (state, action) => {
                state.balance = action.payload;
                state.loading = false;
                state.initialized = true;
            })
            .addCase(loadCredits.rejected, (state) => {
                state.loading = false;
                state.initialized = true;
            })
            .addCase(addCredits.fulfilled, (state, action) => {
                state.balance = action.payload;
            })
            .addCase(deductCredits.fulfilled, (state, action) => {
                state.balance = action.payload;
            });
    },
});

export const { setBalance } = creditsSlice.actions;

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════
export const selectCreditsBalance = (state: RootState): number => state.credits.balance;
export const selectCreditsLoading = (state: RootState): boolean => state.credits.loading;
export const selectCreditsInitialized = (state: RootState): boolean => state.credits.initialized;
export const selectHasCredits = (state: RootState): boolean => state.credits.balance > 0;

export default creditsSlice.reducer;