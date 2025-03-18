import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { formatCurrency, calculateEquipmentRevenue } from '../utils/gameCalculations';
import { 
  lastKnownBalance, 
  lastKnownEarnings, 
  gameStartTime, 
  hasGameStarted,
  getTotalPlayTime
} from '../utils/gameState';
import { OwnedEquipment, Upgrade } from '../types';

const StatsPanel: React.FC = () => {
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const upgrades = useSelector((state: RootState) => state.upgrades);
  const gameState = useSelector((state: RootState) => state.game);
  const progression = useSelector((state: RootState) => state.progression);
  const market = useSelector((state: RootState) => state.market);
  
  // State for tracking play time
  const [currentPlayTime, setCurrentPlayTime] = useState(() => {
    // Handle case where game hasn't been started yet
    return gameStartTime > 0 ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
  });
  
  // Update play time every second
  useEffect(() => {
    // Only start the timer if gameStartTime is initialized
    if (gameStartTime > 0) {
      const intervalId = setInterval(() => {
        setCurrentPlayTime(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, []);
  
  // Calculate total equipment owned
  const totalEquipmentCount = Object.values(equipment.owned).reduce(
    (total: number, item) => total + (item as OwnedEquipment).count,
    0
  );
  
  // Calculate total upgrades purchased
  const totalUpgradesPurchased = Object.values(upgrades.items).filter(
    (upgrade) => (upgrade as Upgrade).purchased
  ).length;
  
  // Calculate equipment value
  const totalEquipmentValue = Object.entries(equipment.owned).reduce(
    (total, [id, item]) => {
      const equipmentData = equipment.types[id];
      return total + (equipmentData.basePrice * (item as OwnedEquipment).count);
    },
    0
  );
  
  // Calculate upgrade value
  const totalUpgradesValue = Object.values(upgrades.items)
    .filter((upgrade) => (upgrade as Upgrade).purchased)
    .reduce((total, upgrade) => total + (upgrade as Upgrade).cost, 0);
  
  // Calculate total investment
  const totalInvestment = totalEquipmentValue + totalUpgradesValue;
  
  // Calculate efficiency (revenue per second per dollar invested)
  const efficiency = totalInvestment > 0 
    ? (player.revenuePerSecond / totalInvestment) * 100 
    : 0;
  
  // Calculate ROI (return on investment)
  const roi = totalInvestment > 0 
    ? (player.totalEarned / totalInvestment) * 100 
    : 0;
  
  // Calculate time to break even (in hours)
  const breakEvenTime = player.revenuePerSecond > 0 
    ? (totalInvestment - player.totalEarned) / (player.revenuePerSecond * 3600)
    : Infinity;
  
  // Format time played
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  
  // Calculate revenue values
  const hourlyRevenue = player.revenuePerSecond * 3600;
  const dailyRevenue = player.revenuePerSecond * 86400;
  const weeklyRevenue = dailyRevenue * 7;
  const monthlyRevenue = dailyRevenue * 30;
  
  // Calculate equipment-specific revenue contributions
  const equipmentRevenues = Object.entries(equipment.owned).map(([typeId, ownedEquipment]) => {
    const equipmentType = equipment.types[typeId];
    const applicableUpgrades = Object.values(upgrades.items).filter(
      (upgrade) => (upgrade as any).purchased && (upgrade as any).appliesTo.includes(typeId)
    );
    
    // Calculate base revenue for this equipment
    const baseRevenue = calculateEquipmentRevenue(
      ownedEquipment as any,
      equipmentType,
      applicableUpgrades as any
    );
    
    // Apply business level multiplier if available
    const currentLevel = progression.levels[player.businessLevel];
    const levelMultiplier = currentLevel?.rewards?.revenueMultiplier || 0;
    
    // Apply market event effects
    let marketMultiplier = 1;
    
    // Apply global market multipliers
    market.activeEventIds.forEach(eventId => {
      const event = market.events[eventId];
      if (event.active && event.effects.globalRevenueBonusMultiplier) {
        marketMultiplier += event.effects.globalRevenueBonusMultiplier;
      }
    });
    
    // Calculate final revenue with all multipliers
    const revenueWithMultipliers = baseRevenue * (1 + levelMultiplier) * marketMultiplier;
    
    // Calculate ROI (Return on Investment)
    const totalInvestment = equipmentType.basePrice * (ownedEquipment as any).count;
    const hourlyReturn = revenueWithMultipliers * 3600;
    const roi = totalInvestment > 0 ? (hourlyReturn / totalInvestment) * 100 : 0;
    const paybackHours = totalInvestment > 0 ? totalInvestment / hourlyReturn : 0;
    
    return {
      typeId,
      name: equipmentType.name,
      count: (ownedEquipment as any).count,
      level: (ownedEquipment as any).level,
      revenuePerSecond: revenueWithMultipliers,
      hourlyRevenue: revenueWithMultipliers * 3600,
      dailyRevenue: revenueWithMultipliers * 86400,
      percentOfTotal: player.revenuePerSecond > 0 ? (revenueWithMultipliers / player.revenuePerSecond) * 100 : 0,
      roi,
      paybackHours
    };
  }).sort((a, b) => b.revenuePerSecond - a.revenuePerSecond);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Financial Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Financial Overview */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-white mb-3">Financial Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Balance:</span>
              <span className="text-yellow-400 font-bold">{formatCurrency(player.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Earned:</span>
              <span className="text-green-400 font-bold">{formatCurrency(player.totalEarned)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revenue Rate:</span>
              <span className="text-green-400 font-bold">{formatCurrency(player.revenuePerSecond)}/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Investment:</span>
              <span className="text-blue-400 font-bold">{formatCurrency(totalInvestment)}</span>
            </div>
          </div>
        </div>
        
        {/* Revenue Projections */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-white mb-3">Revenue Projections</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Hourly Revenue:</span>
              <span className="text-green-400 font-bold">{formatCurrency(hourlyRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Revenue:</span>
              <span className="text-green-400 font-bold">{formatCurrency(dailyRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weekly Revenue:</span>
              <span className="text-green-400 font-bold">{formatCurrency(weeklyRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Revenue:</span>
              <span className="text-green-400 font-bold">{formatCurrency(monthlyRevenue)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Equipment Stats */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-white mb-3">Equipment Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Equipment Types:</span>
              <span className="text-blue-400 font-bold">{Object.keys(equipment.owned).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Equipment:</span>
              <span className="text-blue-400 font-bold">{totalEquipmentCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Equipment Value:</span>
              <span className="text-blue-400 font-bold">{formatCurrency(totalEquipmentValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg. Value per Item:</span>
              <span className="text-blue-400 font-bold">
                {totalEquipmentCount > 0 
                  ? formatCurrency(totalEquipmentValue / totalEquipmentCount) 
                  : '$0'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Upgrade Stats */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-white mb-3">Upgrade Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Upgrades Purchased:</span>
              <span className="text-purple-400 font-bold">{totalUpgradesPurchased}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Upgrades Available:</span>
              <span className="text-purple-400 font-bold">
                {Object.keys(upgrades.items).length - totalUpgradesPurchased}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Upgrades Value:</span>
              <span className="text-purple-400 font-bold">{formatCurrency(totalUpgradesValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg. Upgrade Cost:</span>
              <span className="text-purple-400 font-bold">
                {totalUpgradesPurchased > 0 
                  ? formatCurrency(totalUpgradesValue / totalUpgradesPurchased) 
                  : '$0'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Equipment Revenue Breakdown */}
      {equipmentRevenues.length > 0 && (
        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-white mb-4">Equipment Revenue Breakdown</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-2">Equipment</th>
                  <th className="px-4 py-2">Owned</th>
                  <th className="px-4 py-2">Level</th>
                  <th className="px-4 py-2">Revenue/s</th>
                  <th className="px-4 py-2">% of Total</th>
                  <th className="px-4 py-2">ROI</th>
                  <th className="px-4 py-2">Payback</th>
                </tr>
              </thead>
              <tbody>
                {equipmentRevenues.map((item) => (
                  <tr key={item.typeId} className="border-b border-gray-600">
                    <td className="px-4 py-2 font-medium text-white">{item.name}</td>
                    <td className="px-4 py-2">{item.count}</td>
                    <td className="px-4 py-2">{item.level}</td>
                    <td className="px-4 py-2 text-blue-400">{formatCurrency(item.revenuePerSecond)}/s</td>
                    <td className="px-4 py-2">{item.percentOfTotal.toFixed(1)}%</td>
                    <td className="px-4 py-2 text-green-400">{item.roi.toFixed(1)}%/hr</td>
                    <td className="px-4 py-2">{item.paybackHours.toFixed(1)} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Financial Projections */}
      <div className="bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-white mb-4">Financial Projections</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-2">Next Hour</h4>
            <p className="text-2xl text-green-400 font-bold">{formatCurrency(hourlyRevenue)}</p>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-2">Next Day</h4>
            <p className="text-2xl text-green-400 font-bold">{formatCurrency(dailyRevenue)}</p>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-2">Next Week</h4>
            <p className="text-2xl text-green-400 font-bold">{formatCurrency(dailyRevenue * 7)}</p>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-white mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-center mb-1">
              <span className="text-gray-300 text-sm">Play Time</span>
            </div>
            <div className="text-center text-2xl font-bold text-blue-400">
              {formatTime(currentPlayTime)}
            </div>
            <div className="text-center text-xs text-gray-400">
              Total time since starting the game
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-center mb-1">
              <span className="text-gray-300 text-sm">Efficiency</span>
            </div>
            <div className="text-center text-2xl font-bold text-green-400">
              {efficiency.toFixed(2)}%
            </div>
            <div className="text-center text-xs text-gray-400">
              Revenue per second per dollar invested
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-center mb-1">
              <span className="text-gray-300 text-sm">Return on Investment</span>
            </div>
            <div className="text-center text-2xl font-bold text-green-400">
              {roi.toFixed(2)}%
            </div>
            <div className="text-center text-xs text-gray-400">
              Total earnings as % of investment
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-center mb-1">
              <span className="text-gray-300 text-sm">Break Even</span>
            </div>
            <div className="text-center text-2xl font-bold text-green-400">
              {breakEvenTime <= 0 
                ? 'Achieved!' 
                : breakEvenTime === Infinity 
                  ? 'N/A' 
                  : `${breakEvenTime.toFixed(1)} hrs`}
            </div>
            <div className="text-center text-xs text-gray-400">
              Time until investment is recovered
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Level */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-white mb-3">Business Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Business Level:</span>
              <span className="text-purple-400 font-bold">{player.businessLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Unlocks Available:</span>
              <span className="text-purple-400 font-bold">{player.unlocks.length}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Play Time:</span>
              <span className="text-white font-bold">
                {formatTime(currentPlayTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Earnings per Hour:</span>
              <span className="text-green-400 font-bold">
                {formatCurrency(calculateEarningsPerHour(player.totalEarned, gameState))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format play time
const formatPlayTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

// Helper function to calculate earnings per hour of play time
const calculateEarningsPerHour = (earnings: number, gameState: any): number => {
  // If game hasn't started yet, return 0
  if (!hasGameStarted()) {
    return 0;
  }
  
  // Calculate total play time in hours
  const totalPlayTimeHours = getTotalPlayTime() / 3600000;
  return totalPlayTimeHours > 0 ? earnings / totalPlayTimeHours : 0;
};

export default StatsPanel; 