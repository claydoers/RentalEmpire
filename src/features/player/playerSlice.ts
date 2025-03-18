import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState } from '../../types';
import { updateLastKnownBalance, updateLastKnownEarnings } from '../../utils/gameState';

const initialState: PlayerState = {
  currency: 100,
  revenuePerSecond: 0,
  totalEarned: 0,
  lastSaved: Date.now(),
  unlocks: [],
  businessLevel: 1,
  nextLevelThreshold: 50,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    earnRevenue: (state, action: PayloadAction<number>) => {
      const amount = action.payload;
      
      // Update both values properly
      state.currency += amount;
      state.totalEarned += amount;
      
      // Debugging logs
      console.log(`Player earned ${amount}. New balance: ${state.currency}, Total earned: ${state.totalEarned}`);
      
      // Update shared state for consistency
      updateLastKnownBalance(state.currency);
      updateLastKnownEarnings(state.totalEarned);
    },
    spendCurrency: (state, action: PayloadAction<number>) => {
      const amount = action.payload;
      
      // Update currency
      state.currency -= amount;
      
      // Debugging logs
      console.log(`Player spent ${amount}. New balance: ${state.currency}`);
      
      // Update shared state for consistency
      updateLastKnownBalance(state.currency);
    },
    receiveSellProceeds: (state, action) => {
      // When selling equipment, add half the purchase price to currency
      // but don't count it as "earned" revenue
      const amount = action.payload;
      
      // Update currency
      state.currency += amount;
      
      // Debugging logs
      console.log(`Player received sell proceeds ${amount}. New balance: ${state.currency}`);
      
      // Update shared state for consistency
      updateLastKnownBalance(state.currency);
    },
    updateRevenueRate: (state, action: PayloadAction<number>) => {
      state.revenuePerSecond = action.payload;
    },
    unlockItem: (state, action: PayloadAction<string>) => {
      if (!state.unlocks.includes(action.payload)) {
        state.unlocks.push(action.payload);
      }
    },
    saveTimestamp: (state) => {
      state.lastSaved = Date.now();
    },
    increaseBusinessLevel: (state, action: PayloadAction<{level: number, threshold: number}>) => {
      state.businessLevel = action.payload.level;
      state.nextLevelThreshold = action.payload.threshold;
    },
    resetPlayerState: () => {
      // Reset shared state as well
      updateLastKnownBalance(initialState.currency);
      updateLastKnownEarnings(initialState.totalEarned);
      
      return { ...initialState };
    },
  },
});

export const {
  earnRevenue,
  spendCurrency,
  receiveSellProceeds,
  updateRevenueRate,
  unlockItem,
  saveTimestamp,
  increaseBusinessLevel,
  resetPlayerState,
} = playerSlice.actions;

export default playerSlice.reducer; 