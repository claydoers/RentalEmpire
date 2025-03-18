import React from 'react';
import { useDispatch } from 'react-redux';
import { hideSplash } from '../features/ui/uiSlice';
import { resetPlayerState, updateRevenueRate } from '../features/player/playerSlice';
import { resetEquipmentState } from '../features/equipment/equipmentSlice';
import { resetUpgradesState } from '../features/upgrades/upgradesSlice';
import { resetGameState, updateLastTick, setGameRunning } from '../features/game/gameSlice';
import { resetAchievementsState } from '../features/achievements/achievementsSlice';
import { resetProgressionState } from '../features/progression/progressionSlice';
import { clearAllGameState, saveGameState } from '../utils/localStorage';
import { initializeGameStartTime } from '../utils/gameState';

const SplashScreen: React.FC = () => {
  const dispatch = useDispatch();

  const handleStart = () => {
    // Clear localStorage first
    clearAllGameState();
    
    // Reset all game state for a fresh start
    dispatch(resetPlayerState());
    dispatch(resetEquipmentState());
    dispatch(resetUpgradesState());
    dispatch(resetGameState());
    dispatch(resetAchievementsState());
    dispatch(resetProgressionState());
    
    // Force revenue rate to 0 and update last tick to current time
    dispatch(updateRevenueRate(0));
    dispatch(updateLastTick(Date.now()));
    
    // Initialize game start time for the play timer
    initializeGameStartTime();
    
    // Set the game to running
    dispatch(setGameRunning(true));
    
    // Hide splash screen and navigate to equipment yard
    dispatch(hideSplash());
    
    // Log that the game has started with fresh state
    console.log('Game started with fresh state');
  };

  return (
    <div className="fixed inset-0 bg-blue-900 flex flex-col items-center justify-center z-50">
      <div className="text-center max-w-2xl mx-auto p-8 bg-gray-800 rounded-lg shadow-2xl">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Rental Empire</h1>
        <p className="text-xl text-white mb-8">
          Build your construction equipment rental business empire!
        </p>
        <div className="mb-8">
          <p className="text-gray-300 mb-2">• Purchase equipment to generate revenue</p>
          <p className="text-gray-300 mb-2">• Upgrade your fleet to increase profits</p>
          <p className="text-gray-300 mb-2">• Unlock new equipment types as you grow</p>
          <p className="text-gray-300 mb-2">• Level up your business to unlock new opportunities</p>
          <p className="text-gray-300">• Become the ultimate rental tycoon!</p>
        </div>
        <button
          onClick={handleStart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
        >
          Click to Start
        </button>
      </div>
    </div>
  );
};

export default SplashScreen; 