import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EquipmentType, OwnedEquipment, MarketEvent } from '../types/index';
import { purchaseEquipment, sellEquipment } from '../features/equipment/equipmentSlice';
import { formatCurrency } from '../utils/gameCalculations';
import { addNotification } from '../features/ui/uiSlice';
import { RootState } from '../app/store';
import { spendCurrency, receiveSellProceeds } from '../features/player/playerSlice';

interface EquipmentCardProps {
  equipmentType: EquipmentType;
  owned: OwnedEquipment | null;
  showPurchase?: boolean; // If true, show purchase button; if false, show sell button
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ 
  equipmentType, 
  owned, 
  showPurchase = false 
}) => {
  const dispatch = useDispatch();
  const currency = useSelector((state: RootState) => state.player.currency);
  const market = useSelector((state: RootState) => state.market);
  const count = owned?.count || 0;
  
  // Calculate price with market effects
  const getAdjustedPrice = () => {
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
  
  const currentPrice = getAdjustedPrice();
  const sellValue = Math.floor(currentPrice * 0.5);
  
  // Fallback image handling
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Failed to load image for ${equipmentType.name}:`, equipmentType.image);
    e.currentTarget.src = 'https://via.placeholder.com/100?text=Equipment';
  };
  
  const handleBuy = () => {
    // Get the current currency from the component scope
    console.log('Attempting to buy equipment:', equipmentType.name);
    console.log('Player currency:', currency, 'Price:', currentPrice, 'Can afford:', currency >= currentPrice);
    
    if (currency >= currentPrice) {
      console.log('Purchase starting...');
      
      try {
        // First update the equipment
        dispatch(purchaseEquipment({ typeId: equipmentType.id }));
        console.log('Equipment updated, now spending currency');
        
        // Then deduct the currency
        dispatch(spendCurrency(currentPrice));
        
        // Purchase is complete
        console.log('Purchase completed. Equipment:', equipmentType.name, 'Price:', currentPrice);
        
        // Notify the user
        dispatch(
          addNotification({
            message: `Purchased ${equipmentType.name}!`,
            type: 'success',
          })
        );
      } catch (error) {
        console.error('Error during purchase:', error);
        
        dispatch(
          addNotification({
            message: `Error purchasing ${equipmentType.name}`,
            type: 'error',
          })
        );
      }
    } else {
      console.log('Purchase failed. Not enough currency.');
      dispatch(
        addNotification({
          message: 'Not enough money!',
          type: 'error',
        })
      );
    }
  };
  
  const handleSell = () => {
    if (count > 0) {
      // Dispatch actions to sell equipment and receive money
      dispatch(sellEquipment({ typeId: equipmentType.id }));
      dispatch(receiveSellProceeds(sellValue));
      
      dispatch(
        addNotification({
          message: `Sold ${equipmentType.name} for ${formatCurrency(sellValue)}!`,
          type: 'info',
        })
      );
    }
  };
  
  // Check if there are any price-affecting market events for this equipment
  const hasPriceEffect = market.activeEventIds.some(eventId => {
    const event = market.events[eventId];
    return event.active && (
      event.effects.globalPriceMultiplier !== undefined ||
      (event.effects.equipmentPriceMultiplier && 
       event.effects.equipmentPriceMultiplier[equipmentType.id] !== undefined)
    );
  });
  
  const canAfford = currency >= currentPrice;
  
  return (
    <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-16 h-16 mr-3 bg-gray-600 rounded overflow-hidden flex items-center justify-center">
            <img 
              src={equipmentType.image} 
              alt={equipmentType.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{equipmentType.name}</h3>
            <p className="text-gray-300 text-sm">{equipmentType.description}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-green-400 font-bold">
              +{formatCurrency(equipmentType.baseRevenue)}/s
            </div>
            <div className={`font-bold ${hasPriceEffect ? 'text-orange-400' : 'text-yellow-400'}`}>
              {showPurchase 
                ? `Cost: ${formatCurrency(currentPrice)}${hasPriceEffect ? ' *' : ''}`
                : `Sell value: ${formatCurrency(sellValue)}`
              }
            </div>
            {hasPriceEffect && showPurchase && (
              <div className="text-xs text-orange-300">
                * Price affected by market conditions
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded mr-2">
              Owned: {count}
            </span>
            
            {showPurchase ? (
              <button
                onClick={handleBuy}
                disabled={!canAfford}
                className={`px-3 py-1 rounded font-bold ${
                  canAfford
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Buy
              </button>
            ) : (
              <button
                onClick={handleSell}
                disabled={count === 0}
                className={`px-3 py-1 rounded font-bold ${
                  count > 0
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Sell
              </button>
            )}
          </div>
        </div>
        
        {count > 0 && (
          <div className="text-blue-300 text-sm">
            Total Revenue: {formatCurrency(equipmentType.baseRevenue * count)}/s
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentCard;