import { RootState } from '../app/store';

const STORAGE_KEY = 'rental_empire_save';

/**
 * Save game state to local storage
 */
export const saveGameState = (state: RootState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
    console.log('Game state saved successfully');
  } catch (error) {
    console.error('Could not save game state:', error);
  }
};

/**
 * Load game state from local storage
 */
export const loadGameState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    
    if (!serializedState) {
      console.log('No saved game state found');
      return undefined;
    }
    
    return JSON.parse(serializedState) as RootState;
  } catch (error) {
    console.error('Could not load game state:', error);
    return undefined;
  }
};

/**
 * Clear saved game state
 */
export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Game state cleared successfully');
  } catch (error) {
    console.error('Could not clear game state:', error);
  }
};

/**
 * Completely clear the game state from localStorage
 */
export const clearAllGameState = (): void => {
  try {
    localStorage.clear();
    console.log('All game states cleared from localStorage');
  } catch (error) {
    console.error('Could not clear all game states:', error);
  }
}; 