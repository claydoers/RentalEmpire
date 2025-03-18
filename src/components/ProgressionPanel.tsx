import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { formatCurrency } from '../utils/gameCalculations';

const ProgressionPanel: React.FC = () => {
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const progression = useSelector((state: RootState) => state.progression);
  
  // Get current level data
  const currentLevelData = progression.levels[player.businessLevel];
  
  // Get next level data if available
  const nextLevelData = progression.levels[player.businessLevel + 1];
  
  // Calculate total equipment owned
  const totalEquipment = Object.values(equipment.owned).reduce(
    (total: number, item: any) => total + item.count,
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Business Progression</h2>
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
        </div>
      )}
      
      {/* Business levels overview */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Business Levels</h3>
        <div className="space-y-2">
          {Object.values(progression.levels).map((level) => (
            <div 
              key={level.level}
              className={`flex items-center p-2 rounded ${
                level.level === player.businessLevel 
                  ? 'bg-blue-900 border border-blue-500' 
                  : level.level < player.businessLevel 
                    ? 'bg-gray-700 opacity-75' 
                    : 'bg-gray-900 opacity-50'
              }`}
            >
              <div className="text-2xl mr-3">{level.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className={`font-semibold ${level.level <= player.businessLevel ? 'text-white' : 'text-gray-400'}`}>
                    Level {level.level}: {level.name}
                  </span>
                  {level.level < player.businessLevel && (
                    <span className="text-green-400 text-sm">Completed</span>
                  )}
                  {level.level === player.businessLevel && (
                    <span className="text-blue-400 text-sm">Current</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs">{level.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressionPanel; 