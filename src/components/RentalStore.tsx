import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import EquipmentCard from './EquipmentCard';
import { formatCurrency } from '../utils/gameCalculations';
import { EquipmentType } from '../types/index';
import { updateLastKnownBalance } from '../utils/gameState';

const RentalStore: React.FC = () => {
  const equipment = useSelector((state: RootState) => state.equipment);
  const player = useSelector((state: RootState) => state.player);
  const market = useSelector((state: RootState) => state.market);
  const gameState = useSelector((state: RootState) => state.game);
  
  // IMPORTANT: Use the Redux state directly to ensure consistency with the header
  // and with purchase decisions
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Set up interval to update last known balance for other components
  useEffect(() => {
    if (gameState.isRunning) {
      const intervalId = setInterval(() => {
        // Update the shared state variable with the current Redux currency value
        // This ensures consistency across all components
        updateLastKnownBalance(player.currency);
        
        // Update current time
        setCurrentTime(Date.now());
      }, 1000); // Update every second
      
      return () => clearInterval(intervalId); // Clean up on unmount
    }
  }, [player.currency, gameState.isRunning]);
  
  // Get equipment price with market effects
  const getEquipmentPrice = (equipmentType: EquipmentType): number => {
    let price = equipmentType.basePrice;
    
    // Apply market event effects
    market.activeEventIds.forEach(eventId => {
      const event = market.events[eventId];
      if (event.active) {
        // Apply equipment-specific price multiplier
        if (event.effects.equipmentPriceMultiplier && 
            event.effects.equipmentPriceMultiplier[equipmentType.id]) {
          price *= event.effects.equipmentPriceMultiplier[equipmentType.id];
        }
        
        // Apply global price multiplier
        if (event.effects.globalPriceMultiplier) {
          price *= event.effects.globalPriceMultiplier;
        }
      }
    });
    
    return Math.round(price);
  };
  
  // Filter equipment that the player can see (unlocked or no unlock requirement)
  const availableEquipment = Object.values(equipment.types).filter((type) => {
    const equipmentType = type as EquipmentType;
    
    // If no unlock requirement, always show
    if (!equipmentType.unlockRequirement) {
      return true;
    }
    
    // Check currency requirement
    if (equipmentType.unlockRequirement.currency && 
        player.currency >= equipmentType.unlockRequirement.currency) {
      return true;
    }
    
    // Check if already unlocked
    return player.unlocks.includes(equipmentType.id);
  });
  
  // Get market events that affect prices
  const priceAffectingEvents = market.activeEventIds
    .map(id => market.events[id])
    .filter(event => 
      event.active && 
      (event.effects.globalPriceMultiplier !== undefined || 
       event.effects.equipmentPriceMultiplier !== undefined)
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Rental Store</h2>
        <div className="text-white">
          Balance: <span className="font-bold text-yellow-400">{formatCurrency(player.currency)}</span>
        </div>
      </div>
      
      {/* Market events affecting prices */}
      {priceAffectingEvents.length > 0 && (
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Market Conditions</h3>
          <div className="space-y-2">
            {priceAffectingEvents.map(event => (
              <div key={event.id} className="flex items-center">
                <span className="text-xl mr-2">{event.icon}</span>
                <div>
                  <div className="text-yellow-400 font-medium">{event.name}</div>
                  <div className="text-sm text-gray-300">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Equipment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableEquipment.map((type) => {
          const equipmentType = type as EquipmentType;
          return (
            <EquipmentCard
              key={equipmentType.id}
              equipmentType={equipmentType}
              owned={equipment.owned[equipmentType.id] || null}
              showPurchase={true}
            />
          );
        })}
      </div>
      
      {availableEquipment.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No equipment available. Check back after you've earned more currency or unlocked new equipment types.
        </div>
      )}
    </div>
  );
};

export default RentalStore; 