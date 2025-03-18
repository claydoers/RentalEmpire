import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { formatCurrency } from '../utils/gameCalculations';
import { increaseBusinessLevel, spendCurrency } from '../features/player/playerSlice';
import { addNotification } from '../features/ui/uiSlice';
import { OwnedEquipment } from '../types';
import { lastKnownBalance, lastKnownEarnings, updateLastKnownBalance, updateLastKnownEarnings } from '../utils/gameState';

const BusinessPanel: React.FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const progression = useSelector((state: RootState) => state.progression);
  const gameState = useSelector((state: RootState) => state.game);
  
  // Initialize state with the last known values or player values
  const [realtimeBalance, setRealtimeBalance] = useState(lastKnownBalance || player.currency);
  const [realtimeEarnings, setRealtimeEarnings] = useState(lastKnownEarnings || player.totalEarned);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Set up interval to update real-time financial stats
  useEffect(() => {
    if (gameState.isRunning) {
      const intervalId = setInterval(() => {
        const now = Date.now();
        const deltaTime = (now - currentTime) / 1000; // Time passed in seconds
        
        // Calculate earnings since last update
        const newEarnings = player.revenuePerSecond * deltaTime;
        
        // Update real-time balance and lifetime earnings with whole numbers
        const updatedBalance = Math.floor(realtimeBalance + newEarnings);
        const updatedEarnings = Math.floor(realtimeEarnings + newEarnings);
        
        setRealtimeBalance(updatedBalance);
        setRealtimeEarnings(updatedEarnings);
        
        // Update the shared state variables
        updateLastKnownBalance(updatedBalance);
        updateLastKnownEarnings(updatedEarnings);
        
        // Update current time
        setCurrentTime(now);
      }, 1000); // Update every second
      
      return () => clearInterval(intervalId); // Clean up on unmount
    }
  }, [currentTime, player.revenuePerSecond, gameState.isRunning, realtimeBalance, realtimeEarnings]);
  
  // Reset real-time values when player state changes
  useEffect(() => {
    if (player.currency !== lastKnownBalance) {
      console.log('Currency changed in Redux state, resetting real-time balance in BusinessPanel');
      setRealtimeBalance(player.currency);
      updateLastKnownBalance(player.currency);
    }
    
    if (player.totalEarned !== lastKnownEarnings) {
      console.log('Total earned changed in Redux state, resetting real-time earnings in BusinessPanel');
      setRealtimeEarnings(player.totalEarned);
      updateLastKnownEarnings(player.totalEarned);
    }
  }, [player.currency, player.totalEarned]);
  
  // Get current level data
  const currentLevelData = progression.levels[player.businessLevel] || {
    name: 'Unknown',
    description: 'Level data not found',
    icon: '🏢',
    rewards: {}
  };
  
  // Get next level data if available
  const nextLevelData = progression.levels[player.businessLevel + 1];
  
  // Calculate total equipment owned
  const totalEquipment = Object.values(equipment.owned).reduce(
    (total: number, item) => total + (item as OwnedEquipment).count,
    0
  );
  
  // Calculate progress towards next level
  const calculateProgress = () => {
    if (!nextLevelData) return 100; // Max level
    
    const revenueProgress = Math.min(
      100,
      (player.revenuePerSecond / nextLevelData.revenueRequirement) * 100
    );
    
    if (!nextLevelData.equipmentRequirement) return revenueProgress;
    
    const equipmentProgress = Math.min(
      100,
      (totalEquipment / nextLevelData.equipmentRequirement) * 100
    );
    
    // Return the lower of the two progress values
    return Math.min(revenueProgress, equipmentProgress);
  };
  
  const progress = calculateProgress();
  
  // Handle level up
  const handleLevelUp = () => {
    if (!nextLevelData) return; // No next level
    
    // Check if player meets requirements
    const meetsRevenueRequirement = player.revenuePerSecond >= nextLevelData.revenueRequirement;
    const meetsEquipmentRequirement = !nextLevelData.equipmentRequirement || 
      totalEquipment >= nextLevelData.equipmentRequirement;
    
    if (meetsRevenueRequirement && meetsEquipmentRequirement) {
      // Apply level up rewards
      if (nextLevelData.rewards.currencyBonus) {
        // Add currency bonus
        dispatch(spendCurrency(-nextLevelData.rewards.currencyBonus)); // Negative spend = add currency
      }
      
      // Increase business level
      dispatch(increaseBusinessLevel({
        level: player.businessLevel + 1,
        threshold: nextLevelData.revenueRequirement * 2 // Set next threshold
      }));
      
      // Show notification
      dispatch(addNotification({
        message: `Business upgraded to ${nextLevelData.name}!`,
        type: 'success'
      }));
    } else {
      // Show error notification
      dispatch(addNotification({
        message: 'You do not meet the requirements for the next level!',
        type: 'error'
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Business Status</h2>
        <div className="text-white">
          Level <span className="font-bold">{player.businessLevel}</span>
        </div>
      </div>
      
      {/* Current level card */}
      <div className="bg-gray-800 border border-blue-500 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <div className="text-3xl mr-3">{currentLevelData.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-blue-400">{currentLevelData.name}</h3>
            <p className="text-gray-300 text-sm">{currentLevelData.description}</p>
          </div>
        </div>
        
        {nextLevelData && (
          <>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress to {nextLevelData.name}</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">Requirements for next level:</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Revenue Rate:</span>
                <span className={player.revenuePerSecond >= nextLevelData.revenueRequirement ? 'text-green-400' : 'text-yellow-400'}>
                  {formatCurrency(player.revenuePerSecond)}/s of {formatCurrency(nextLevelData.revenueRequirement)}/s
                </span>
              </div>
              
              {nextLevelData.equipmentRequirement && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Equipment:</span>
                  <span className={totalEquipment >= nextLevelData.equipmentRequirement ? 'text-green-400' : 'text-yellow-400'}>
                    {totalEquipment} of {nextLevelData.equipmentRequirement} pieces
                  </span>
                </div>
              )}
            </div>
          </>
        )}
        
        {!nextLevelData && (
          <div className="mt-4 text-center text-green-400 font-semibold">
            Maximum Level Reached!
          </div>
        )}
      </div>
      
      {/* Next level rewards */}
      {nextLevelData && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">Next Level Rewards</h3>
          <div className="space-y-2">
            {nextLevelData.rewards.currencyBonus && (
              <div className="flex items-center">
                <span className="text-xl mr-2">💰</span>
                <span className="text-gray-300">{formatCurrency(nextLevelData.rewards.currencyBonus)} bonus</span>
              </div>
            )}
            
            {nextLevelData.rewards.revenueMultiplier && (
              <div className="flex items-center">
                <span className="text-xl mr-2">📈</span>
                <span className="text-gray-300">{(nextLevelData.rewards.revenueMultiplier * 100).toFixed(0)}% revenue boost</span>
              </div>
            )}
            
            {nextLevelData.rewards.unlockEquipment && nextLevelData.rewards.unlockEquipment.length > 0 && (
              <div className="flex items-center">
                <span className="text-xl mr-2">🚜</span>
                <span className="text-gray-300">New equipment types</span>
              </div>
            )}
            
            {nextLevelData.rewards.unlockUpgrades && nextLevelData.rewards.unlockUpgrades.length > 0 && (
              <div className="flex items-center">
                <span className="text-xl mr-2">⬆️</span>
                <span className="text-gray-300">New upgrades</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleLevelUp}
              className={`w-full py-2 px-4 rounded-lg font-bold ${
                progress >= 100
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={progress < 100}
            >
              Level Up
            </button>
          </div>
        </div>
      )}
      
      {/* Business stats */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Business Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Revenue:</span>
              <span className="text-green-400">{formatCurrency(realtimeEarnings)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revenue Rate:</span>
              <span className="text-green-400">{formatCurrency(player.revenuePerSecond)}/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Balance:</span>
              <span className="text-yellow-400">{formatCurrency(realtimeBalance)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Equipment:</span>
              <span className="text-blue-400">{totalEquipment} pieces</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Equipment Types:</span>
              <span className="text-blue-400">{Object.keys(equipment.owned).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Business Level:</span>
              <span className="text-purple-400">{currentLevelData.name} (Level {player.businessLevel})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPanel; 