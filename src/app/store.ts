import { configureStore, Middleware } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import equipmentReducer from '../features/equipment/equipmentSlice';
import upgradesReducer from '../features/upgrades/upgradesSlice';
import uiReducer from '../features/ui/uiSlice';
import gameReducer from '../features/game/gameSlice';
import achievementsReducer from '../features/achievements/achievementsSlice';
import progressionReducer from '../features/progression/progressionSlice';
import marketReducer from '../features/market/marketSlice';

// Create a middleware to log actions for debugging
const loggingMiddleware: Middleware = store => next => action => {
  // Let the action go through
  const result = next(action);
  
  // Log actions related to currency changes
  if (
    typeof action === 'object' && action !== null && 'type' in action &&
    String(action.type).startsWith('player/')
  ) {
    console.log('Action:', String(action.type), 'dispatched');
    console.log('Current state after action:', {
      currency: store.getState().player.currency,
      revenuePerSecond: store.getState().player.revenuePerSecond
    });
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    player: playerReducer,
    equipment: equipmentReducer,
    upgrades: upgradesReducer,
    ui: uiReducer,
    game: gameReducer,
    achievements: achievementsReducer,
    progression: progressionReducer,
    market: marketReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 