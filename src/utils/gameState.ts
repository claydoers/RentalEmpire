// gameState.ts - Shared state variables for the game

// Helper function to safely parse numeric values from localStorage
const safelyParseNumber = (value: string | null): number => {
  if (!value) return 0;
  
  try {
    const parsed = Number(value);
    // Check if the parsed value is a valid number
    return isNaN(parsed) ? 0 : parsed;
  } catch (e) {
    console.error('Error parsing value from localStorage:', e);
    return 0;
  }
};

// Initialize the variables from localStorage or default to 0
export let lastKnownBalance = safelyParseNumber(localStorage.getItem('lastKnownBalance'));
export let lastKnownEarnings = safelyParseNumber(localStorage.getItem('lastKnownEarnings'));

// Track when the game was started for accurate play time calculation
export let gameStartTime = safelyParseNumber(localStorage.getItem('gameStartTime'));
// Don't automatically initialize gameStartTime on first load
// The SplashScreen will handle this when user clicks "Start"

console.log('Initial lastKnownBalance:', lastKnownBalance);
console.log('Initial lastKnownEarnings:', lastKnownEarnings);
console.log('Game start time:', gameStartTime > 0 ? new Date(gameStartTime).toLocaleString() : 'Not started yet');

// Function to initialize game start time
export const initializeGameStartTime = (): void => {
  gameStartTime = Date.now();
  localStorage.setItem('gameStartTime', gameStartTime.toString());
  console.log('Game start time initialized:', new Date(gameStartTime).toLocaleString());
};

// Function to update the last known balance
export const updateLastKnownBalance = (balance: number): void => {
  // Validate that balance is a valid number
  if (typeof balance !== 'number' || isNaN(balance)) {
    console.warn('Invalid balance value:', balance);
    return;
  }
  
  // Only update if the value has actually changed
  if (lastKnownBalance !== balance) {
    console.log('Updating lastKnownBalance:', lastKnownBalance, '->', balance);
    lastKnownBalance = balance;
    localStorage.setItem('lastKnownBalance', balance.toString());
  }
};

// Function to update the last known earnings
export const updateLastKnownEarnings = (earnings: number): void => {
  // Validate that earnings is a valid number
  if (typeof earnings !== 'number' || isNaN(earnings)) {
    console.warn('Invalid earnings value:', earnings);
    return;
  }
  
  // Only update if the value has actually changed
  if (lastKnownEarnings !== earnings) {
    console.log('Updating lastKnownEarnings:', lastKnownEarnings, '->', earnings);
    lastKnownEarnings = earnings;
    localStorage.setItem('lastKnownEarnings', earnings.toString());
  }
};

// Function to reset all shared state variables
export const resetSharedState = (): void => {
  console.log('Resetting shared state variables');
  lastKnownBalance = 0;
  lastKnownEarnings = 0;
  gameStartTime = 0; // Reset to 0 to indicate the game hasn't started yet
  localStorage.removeItem('lastKnownBalance');
  localStorage.removeItem('lastKnownEarnings');
  localStorage.removeItem('gameStartTime'); // Remove instead of setting to prevent accidental initialization
};

// Helper function to check if the game has been started
export const hasGameStarted = (): boolean => {
  return gameStartTime > 0;
};

// Helper function to get the total play time in milliseconds
export const getTotalPlayTime = (): number => {
  if (!hasGameStarted()) {
    return 0;
  }
  return Date.now() - gameStartTime;
}; 