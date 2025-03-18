import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { unlockUpgrade } from '../features/upgrades/upgradesSlice';
import { addNotification } from '../features/ui/uiSlice';
import { OwnedEquipment, Upgrade } from '../types';

const UpgradeTracker: React.FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const upgrades = useSelector((state: RootState) => state.upgrades);
  
  // Check for unlockable upgrades based on game state
  useEffect(() => {
    // Loop through all upgrades
    Object.entries(upgrades.items).forEach(([id, upgrade]) => {
      const typedUpgrade = upgrade as Upgrade;
      const requirementMet = checkRequirement(id, typedUpgrade);
      
      // If requirement is met, unlock it and notify player
      if (requirementMet) {
        dispatch(unlockUpgrade({ upgradeId: id }));
        dispatch(addNotification({
          message: `New upgrade available: ${typedUpgrade.name}!`,
          type: 'success',
        }));
      }
    });
  }, [
    player.currency, 
    player.revenuePerSecond, 
    player.totalEarned,
    equipment.owned,
    dispatch,
    upgrades.items
  ]);
  
  // Helper function to check if upgrade requirements are met
  const checkRequirement = (id: string, upgrade: Upgrade): boolean => {
    // If no requirement or already unlocked, return false
    if (!upgrade.unlockRequirement) {
      return false;
    }
    
    const req = upgrade.unlockRequirement;
    
    // Check currency requirement
    if (req.currency && player.currency < req.currency) {
      return false;
    }
    
    // Check total revenue requirement
    if (req.totalRevenue && player.revenuePerSecond < req.totalRevenue) {
      return false;
    }
    
    // Check equipment types requirement
    if (req.equipmentTypes) {
      const hasAllTypes = req.equipmentTypes.every(typeId => {
        return equipment.owned[typeId] && equipment.owned[typeId].count > 0;
      });
      
      if (!hasAllTypes) {
        return false;
      }
    }
    
    // Check equipment count requirement
    if (req.equipmentCount) {
      for (const [typeId, minCount] of Object.entries(req.equipmentCount)) {
        const ownedCount = equipment.owned[typeId] ? (equipment.owned[typeId] as OwnedEquipment).count : 0;
        if (ownedCount < (minCount as number)) {
          return false;
        }
      }
    }
    
    // Check total equipment requirement
    if (req.totalEquipment) {
      const totalEquipment = Object.values(equipment.owned).reduce(
        (sum: number, item) => sum + (item as OwnedEquipment).count, 
        0
      );
      if (totalEquipment < req.totalEquipment) {
        return false;
      }
    }
    
    // All requirements met
    return true;
  };
  
  return null; // This component doesn't render anything
};

export default UpgradeTracker; 