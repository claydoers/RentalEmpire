import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { formatCurrency } from '../utils/gameCalculations';
import { clearGameState } from '../utils/localStorage';
import { addNotification } from '../features/ui/uiSlice';
import { OwnedEquipment, Upgrade } from '../types';
import { lastKnownBalance, lastKnownEarnings, updateLastKnownBalance, updateLastKnownEarnings } from '../utils/gameState';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const upgrades = useSelector((state: RootState) => state.upgrades);
  const gameState = useSelector((state: RootState) => state.game);
  
  // Initialize state with the last known values or player values
  const [realtimeBalance, setRealtimeBalance] = useState(lastKnownBalance || player.currency);
  const [realtimeEarnings, setRealtimeEarnings] = useState(lastKnownEarnings || player.totalEarned);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Set up interval to update time-based values and real-time financial stats
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
      console.log('Currency changed in Redux state, resetting real-time balance in Dashboard');
      setRealtimeBalance(player.currency);
      updateLastKnownBalance(player.currency);
    }
    
    if (player.totalEarned !== lastKnownEarnings) {
      console.log('Total earned changed in Redux state, resetting real-time earnings in Dashboard');
      setRealtimeEarnings(player.totalEarned);
      updateLastKnownEarnings(player.totalEarned);
    }
  }, [player.currency, player.totalEarned]);
  
  // Calculate total equipment owned
  const totalEquipment = Object.values(equipment.owned).reduce(
    (total: number, item) => total + (item as OwnedEquipment).count,
    0
  );
  
  // Calculate total upgrades purchased
  const totalUpgrades = Object.values(upgrades.items).filter(
    (upgrade) => (upgrade as Upgrade).purchased
  ).length;
  
  // Calculate revenue values
  const hourlyRevenue = player.revenuePerSecond * 3600;
  const dailyRevenue = player.revenuePerSecond * 86400;
  
  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset your game? All progress will be lost!')) {
      clearGameState();
      dispatch(
        addNotification({
          message: 'Game reset! Refresh the page to start over.',
          type: 'info',
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-2">Current Balance</h3>
          <div className="text-3xl font-bold text-yellow-400">
            {formatCurrency(realtimeBalance)}
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-2">Revenue Rate</h3>
          <div className="text-3xl font-bold text-green-400">
            {formatCurrency(player.revenuePerSecond)}/s
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-2">Total Equipment</h3>
          <div className="text-3xl font-bold text-blue-400">
            {totalEquipment as React.ReactNode}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-white mb-3">Quick Stats</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Earned:</span>
              <span className="text-white font-bold">{formatCurrency(realtimeEarnings)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Equipment Types:</span>
              <span className="text-white font-bold">{Object.keys(equipment.owned).length}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Upgrades Purchased:</span>
              <span className="text-white font-bold">{totalUpgrades}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Hourly Revenue:</span>
              <span className="text-white font-bold">{formatCurrency(hourlyRevenue)}/hr</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Daily Revenue:</span>
              <span className="text-white font-bold">{formatCurrency(dailyRevenue)}/day</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Unlocks:</span>
              <span className="text-white font-bold">{player.unlocks.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleResetGame}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 