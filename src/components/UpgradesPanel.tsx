import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { purchaseUpgrade } from '../features/upgrades/upgradesSlice';
import { spendCurrency } from '../features/player/playerSlice';
import { addNotification } from '../features/ui/uiSlice';
import { formatCurrency } from '../utils/gameCalculations';
import { Upgrade } from '../types/index';

const UpgradesPanel: React.FC = () => {
  const dispatch = useDispatch();
  const upgrades = useSelector((state: RootState) => state.upgrades.items);
  const currency = useSelector((state: RootState) => state.player.currency);
  const equipment = useSelector((state: RootState) => state.equipment);
  
  // Filter upgrades that are available
  const availableUpgrades = Object.values(upgrades).filter((upgrade) => {
    const typedUpgrade = upgrade as Upgrade;
    
    // Skip already purchased upgrades
    if (typedUpgrade.purchased) return false;
    
    // Skip upgrades that haven't been unlocked yet
    if (typedUpgrade.unlockRequirement) return false;
    
    // Check if player has the equipment this upgrade applies to
    return typedUpgrade.appliesTo.some(
      (equipmentId) => equipment.owned[equipmentId]?.count > 0
    );
  });
  
  // Count of locked upgrades (for UI messaging)
  const lockedUpgradesCount = Object.values(upgrades).filter(upgrade => 
    !(upgrade as Upgrade).purchased && (upgrade as Upgrade).unlockRequirement
  ).length;
  
  // Format percentage without decimals
  const formatPercentage = (multiplier: number): string => {
    const percentage = Math.round((multiplier - 1) * 100);
    return `+${percentage}%`;
  };
  
  const handlePurchase = (upgrade: Upgrade) => {
    console.log('Attempting to purchase upgrade:', upgrade.name);
    console.log('Current currency:', currency, 'Upgrade cost:', upgrade.cost);
    
    if (currency >= upgrade.cost) {
      dispatch(purchaseUpgrade(upgrade.id));
      dispatch(spendCurrency(upgrade.cost));
      console.log('Upgrade purchase successful. New currency:', currency - upgrade.cost);
      
      dispatch(
        addNotification({
          message: `Purchased upgrade: ${upgrade.name}!`,
          type: 'success',
        })
      );
    } else {
      console.log('Upgrade purchase failed. Not enough currency.');
      dispatch(
        addNotification({
          message: 'Not enough money for this upgrade!',
          type: 'error',
        })
      );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Upgrades</h2>
        {lockedUpgradesCount > 0 && (
          <div className="text-sm text-gray-300">
            {lockedUpgradesCount} more upgrade{lockedUpgradesCount !== 1 ? 's' : ''} to unlock!
          </div>
        )}
      </div>
      
      {availableUpgrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableUpgrades.map((upgrade) => {
            const typedUpgrade = upgrade as Upgrade;
            const canAfford = currency >= typedUpgrade.cost;
            
            return (
              <div
                key={typedUpgrade.id}
                className="bg-gray-700 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {typedUpgrade.name}
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {typedUpgrade.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-yellow-400 font-bold">
                    Cost: {formatCurrency(typedUpgrade.cost)}
                  </div>
                  <div className="text-green-400 font-bold">
                    {formatPercentage(typedUpgrade.multiplier)} Revenue
                  </div>
                </div>
                
                <div className="text-sm text-blue-300 mb-3">
                  Applies to:{' '}
                  {typedUpgrade.appliesTo
                    .map((id) => equipment.types[id]?.name || id)
                    .join(', ')}
                </div>
                
                <button
                  onClick={() => handlePurchase(typedUpgrade)}
                  disabled={!canAfford}
                  className={`w-full py-2 px-4 rounded font-bold ${
                    canAfford
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Purchase
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {lockedUpgradesCount > 0 
              ? "No upgrades available yet. Continue playing to unlock upgrades!" 
              : "No upgrades available. Purchase equipment to unlock upgrades!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UpgradesPanel; 