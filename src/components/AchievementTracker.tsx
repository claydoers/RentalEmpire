import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { completeAchievement as completeAchievementAction } from '../features/achievements/achievementsSlice';
import { addNotification } from '../features/ui/uiSlice';
import { formatCurrency } from '../utils/gameCalculations';
import { OwnedEquipment, Achievement } from '../types';
import { earnRevenue } from '../features/player/playerSlice';

const AchievementTracker: React.FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const upgrades = useSelector((state: RootState) => state.upgrades);
  const achievements = useSelector((state: RootState) => state.achievements.items);
  const gameState = useSelector((state: RootState) => state.game);
  
  // Track achievements based on player state
  useEffect(() => {
    // Skip if game is not running
    if (!gameState.isRunning) return;
    
    // Check each achievement
    Object.values(achievements).forEach(achievement => {
      // Skip if already completed
      if (achievement.completed) return;
      
      let isCompleted = false;
      
      // Check based on requirement type
      switch (achievement.requirement.type) {
        case 'currency':
          isCompleted = player.totalEarned >= achievement.requirement.target;
          break;
          
        case 'revenue':
          isCompleted = player.revenuePerSecond >= achievement.requirement.target;
          break;
          
        case 'equipment':
          if (achievement.requirement.equipmentId) {
            // Specific equipment type
            const ownedCount = equipment.owned[achievement.requirement.equipmentId]?.count || 0;
            isCompleted = ownedCount >= achievement.requirement.target;
          } else {
            // Total equipment
            const totalEquipment: number = Object.values(equipment.owned).reduce(
              (total: number, item) => total + (item as OwnedEquipment).count,
              0
            );
            isCompleted = totalEquipment >= achievement.requirement.target;
          }
          break;
          
        case 'upgrades':
          const purchasedUpgrades = Object.values(upgrades.items).filter(
            upgrade => upgrade.purchased
          ).length;
          isCompleted = purchasedUpgrades >= achievement.requirement.target;
          break;
          
        case 'time':
          // Time is tracked separately with a timer
          break;
          
        case 'businessLevel':
          isCompleted = player.businessLevel >= achievement.requirement.target;
          break;
      }
      
      // Complete achievement if requirements met
      if (isCompleted) {
        completeAchievement(achievement);
      }
    });
  }, [
    player.totalEarned,
    player.revenuePerSecond,
    player.businessLevel,
    equipment.owned,
    upgrades.items,
    gameState.isRunning
  ]);
  
  // Track time-based achievements
  useEffect(() => {
    if (!gameState.isRunning) return;
    
    // Find time-based achievements
    const timeAchievements = Object.values(achievements).filter(
      achievement => achievement.requirement.type === 'time' && !achievement.completed
    );
    
    if (timeAchievements.length === 0) return;
    
    // Set up interval to check time
    const interval = setInterval(() => {
      const gameTime = (Date.now() - gameState.lastTick) / 1000 + 1; // in seconds
      
      timeAchievements.forEach(achievement => {
        if (gameTime >= achievement.requirement.target) {
          completeAchievement(achievement);
        }
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [achievements, gameState.isRunning, gameState.lastTick]);
  
  // Helper function to complete an achievement
  const completeAchievement = (achievement: Achievement) => {
    dispatch(completeAchievementAction(achievement.id));
    
    // Apply the achievement reward
    applyAchievementReward(achievement);
    
    // Show notification
    dispatch(addNotification({
      message: `Achievement Unlocked: ${achievement.name}`,
      type: 'success',
      achievementId: achievement.id
    }));
  };
  
  // Helper function to apply achievement rewards
  const applyAchievementReward = (achievement: Achievement) => {
    if (achievement.reward.type === 'currency') {
      // Add the currency reward to the player's balance
      dispatch(earnRevenue(achievement.reward.amount));
      console.log(`Applied achievement reward: ${formatCurrency(achievement.reward.amount)}`);
    } else if (achievement.reward.type === 'multiplier') {
      // Multiplier rewards are handled in the revenue calculation logic
      console.log(`Applied achievement multiplier: ${achievement.reward.amount * 100}%`);
      // Note: No need to dispatch an action here as the multiplier is applied
      // when calculating revenue in the game loop
    }
  };
  
  return null; // This component doesn't render anything
};

export default AchievementTracker; 