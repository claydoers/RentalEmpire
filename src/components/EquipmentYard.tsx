import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import EquipmentCard from './EquipmentCard';
import { formatCurrency } from '../utils/gameCalculations';
import { EquipmentType, OwnedEquipment } from '../types/index';

const EquipmentYard: React.FC = () => {
  const equipment = useSelector((state: RootState) => state.equipment);
  const player = useSelector((state: RootState) => state.player);
  
  // State for real-time balance
  const [realtimeBalance, setRealtimeBalance] = useState(player.currency);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Set up interval to update real-time balance
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - currentTime) / 1000; // Time passed in seconds
      
      // Calculate earnings since last update
      const newEarnings = player.revenuePerSecond * deltaTime;
      
      // Update real-time balance
      setRealtimeBalance(prev => prev + newEarnings);
      
      // Update current time
      setCurrentTime(now);
    }, 1000); // Update every second
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [currentTime, player.revenuePerSecond]);
  
  // Reset real-time values when player state changes
  useEffect(() => {
    setRealtimeBalance(player.currency);
  }, [player.currency]);
  
  // Get equipment that the player owns
  const ownedEquipment = Object.entries(equipment.owned)
    .filter(([_, owned]) => (owned as OwnedEquipment).count > 0)
    .map(([typeId, owned]) => ({
      type: equipment.types[typeId] as EquipmentType,
      owned: owned as OwnedEquipment
    }));
  
  // Calculate total revenue from all equipment
  const totalRevenue = ownedEquipment.reduce((total, { type, owned }) => {
    return total + (type.baseRevenue * owned.count);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Equipment Yard</h2>
        <div className="text-white">
          Balance: <span className="font-bold text-yellow-400">{formatCurrency(realtimeBalance)}</span>
        </div>
      </div>
      
      <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Your Fleet</h3>
            <p className="text-gray-300">Total Equipment: {ownedEquipment.reduce((sum, { owned }) => sum + owned.count, 0)}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-400">
              {formatCurrency(totalRevenue)}/s
            </div>
            <div className="text-sm text-gray-300">
              Total Revenue
            </div>
          </div>
        </div>
      </div>
      
      {ownedEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownedEquipment.map(({ type, owned }) => (
            <EquipmentCard
              key={type.id}
              equipmentType={type}
              owned={owned}
              showPurchase={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          You don't own any equipment yet. Visit the Rental Store to purchase equipment.
        </div>
      )}
    </div>
  );
};

export default EquipmentYard; 