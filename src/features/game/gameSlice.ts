import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRunning: false,
  tickRate: 1000, // milliseconds
  lastTick: Date.now(),
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameRunning: (state, action) => {
      state.isRunning = action.payload;
    },
    
    setTickRate: (state, action) => {
      state.tickRate = action.payload;
    },
    
    updateLastTick: (state, action) => {
      state.lastTick = action.payload;
    },
    
    resetGameState: () => {
      // Return a fresh copy of the initial state with current timestamp
      return {
        ...initialState,
        lastTick: Date.now(),
      };
    },
  },
});

export const {
  setGameRunning,
  setTickRate,
  updateLastTick,
  resetGameState,
} = gameSlice.actions;

export default gameSlice.reducer; 