import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { increaseBusinessLevel, earnRevenue, unlockItem } from '../features/player/playerSlice';
import { addNotification } from '../features/ui/uiSlice';
import { formatCurrency } from '../utils/gameCalculations';
import { BusinessLevel, OwnedEquipment } from '../types';
import { completeAchievement } from '../features/achievements/achievementsSlice';

const ProgressionTracker: React.FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const progression = useSelector((state: RootState) => state.progression);
  
  // Check for business level progression
  useEffect(() => {
    // Get current level and next level
    const currentLevel = player.businessLevel;
    const nextLevel = currentLevel + 1;
    
    // Check if next level exists
    if (progression.levels[nextLevel]) {
      const nextLevelData = progression.levels[nextLevel];
      
      // Calculate total equipment owned
      const totalEquipment: number = Object.values(equipment.owned).reduce(
        (total: number, item) => total + (item as OwnedEquipment).count,
        0
      );
      
      // Check if player meets requirements for next level
      const meetsRevenueRequirement = player.revenuePerSecond >= nextLevelData.revenueRequirement;
      const meetsEquipmentRequirement = !nextLevelData.equipmentRequirement || 
                                        totalEquipment >= nextLevelData.equipmentRequirement;
      
      if (meetsRevenueRequirement && meetsEquipmentRequirement) {
        // Level up!
        handleLevelUp(nextLevelData);
      }
    }
  }, [player.revenuePerSecond, equipment.owned]);
  
  // Handle level up
  const handleLevelUp = (levelData: BusinessLevel) => {
    // Get next level threshold
    const nextLevelThreshold = progression.levels[levelData.level + 1]?.revenueRequirement || 0;
    
    // Update player's business level
    dispatch(increaseBusinessLevel({
      level: levelData.level,
      threshold: nextLevelThreshold
    }));
    
    // Apply rewards
    if (levelData.rewards.currencyBonus) {
      dispatch(earnRevenue(levelData.rewards.currencyBonus));
    }
    
    // Unlock equipment
    if (levelData.rewards.unlockEquipment) {
      levelData.rewards.unlockEquipment.forEach(equipmentId => {
        dispatch(unlockItem(equipmentId));
      });
    }
    
    // Unlock upgrades
    if (levelData.rewards.unlockUpgrades) {
      levelData.rewards.unlockUpgrades.forEach(upgradeId => {
        dispatch(unlockItem(upgradeId));
      });
    }
    
    // Complete corresponding business level achievement
    const achievementId = `businessLevel${levelData.level}`;
    dispatch(completeAchievement(achievementId));
    
    // Show level up notification
    dispatch(addNotification({
      message: `Business Level Up! You are now a ${levelData.name}`,
      type: 'success'
    }));
  };
  
  return null; // This component doesn't render anything
};

export default ProgressionTracker; 