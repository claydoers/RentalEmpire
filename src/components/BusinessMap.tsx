import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { formatCurrency } from '../utils/gameCalculations';

const BusinessMap: React.FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const progression = useSelector((state: RootState) => state.progression);
  
  // State for interactive features
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showRevenueVisualization, setShowRevenueVisualization] = useState(false);
  const [animateRevenue, setAnimateRevenue] = useState(false);
  
  // Trigger revenue animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (player.revenuePerSecond > 0) {
        setAnimateRevenue(true);
        setTimeout(() => setAnimateRevenue(false), 800);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [player.revenuePerSecond]);
  
  // Calculate total equipment owned
  const totalEquipment = Object.values(equipment.owned).reduce(
    (total: number, item: any) => total + item.count,
    0
  );
  
  // Get current level data
  const currentLevel = progression.levels[player.businessLevel];
  
  // Get HQ building size based on business level
  const getHQSize = () => {
    switch (player.businessLevel) {
      case 1: return 'w-16 h-12';
      case 2: return 'w-20 h-16';
      case 3: return 'w-24 h-20';
      case 4: return 'w-28 h-24';
      case 5: return 'w-32 h-28';
      case 6: return 'w-36 h-32';
      case 7: return 'w-40 h-36';
      default: return 'w-16 h-12';
    }
  };
  
  // Business locations based on business level
  const businessLocations = [
    { id: 'hq', name: 'Headquarters', level: 1, x: 50, y: 75 },
    { id: 'depot', name: 'Equipment Depot', level: 2, x: 30, y: 40 },
    { id: 'workshop', name: 'Repair Workshop', level: 3, x: 70, y: 40 },
    { id: 'training', name: 'Training Center', level: 4, x: 20, y: 65 },
    { id: 'research', name: 'R&D Center', level: 5, x: 80, y: 65 },
    { id: 'regional', name: 'Regional Office', level: 6, x: 40, y: 20 },
    { id: 'international', name: 'International HQ', level: 7, x: 60, y: 20 },
  ];
  
  // Get available locations based on business level
  const availableLocations = businessLocations.filter(
    location => location.level <= player.businessLevel
  );
  
  // Define map elements based on business level and equipment
  const getMapElements = () => {
    const elements: ReactElement[] = [];
    
    // Add business locations
    availableLocations.forEach(location => {
      const isHQ = location.id === 'hq';
      const isSelected = location.id === selectedLocation;
      
      elements.push(
        <div 
          key={location.id} 
          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300 ${isSelected ? 'scale-110' : ''}`}
          style={{ 
            left: `${location.x}%`, 
            top: `${location.y}%`,
            zIndex: isHQ ? 20 : 10
          }}
          onClick={() => setSelectedLocation(isSelected ? null : location.id)}
        >
          <div 
            className={`${isHQ ? getHQSize() : 'w-12 h-10'} ${isHQ ? 'bg-blue-800' : 'bg-gray-700'} ${isSelected ? 'ring-2 ring-yellow-400' : ''} rounded-t-lg border-2 ${isHQ ? 'border-blue-600' : 'border-gray-600'} flex items-center justify-center transition-all duration-300`}
          >
            <span className="text-white font-bold text-xs">{location.id.toUpperCase()}</span>
          </div>
          <div className={`w-full h-2 ${isHQ ? 'bg-blue-900 border-blue-600' : 'bg-gray-800 border-gray-600'} border-x-2`}></div>
          <div className={`text-xs ${isSelected ? 'text-yellow-400' : 'text-white'} mt-1 font-bold`}>{location.name}</div>
        </div>
      );
    });
    
    // Add equipment to the map based on what the player owns
    let equipmentPlaced = 0;
    
    Object.entries(equipment.owned).forEach(([typeId, ownedEquipment]: [string, any]) => {
      if (ownedEquipment.count === 0) return;
      
      const equipmentType = equipment.types[typeId];
      const contribution = (ownedEquipment.revenue * ownedEquipment.count) / player.revenuePerSecond;
      const equipmentSize = contribution > 0.2 ? 'text-3xl' : contribution > 0.1 ? 'text-2xl' : 'text-xl';
      
      // Place up to 3 of each equipment type (to avoid overcrowding)
      const countToPlace = Math.min(ownedEquipment.count, Math.max(1, Math.floor(ownedEquipment.count / 5)));
      
      for (let i = 0; i < countToPlace; i++) {
        // Calculate position - distribute equipment around the map
        // Create clusters around business locations based on equipment type
        let targetLocation;
        if (typeId === 'excavator' || typeId === 'bulldozer' || typeId === 'trencher' || typeId === 'skidsteer') {
          targetLocation = availableLocations.find(l => l.id === 'depot') || availableLocations[0];
        } else if (typeId === 'crane' || typeId === 'megaCrane' || typeId === 'scissorlift' || typeId === 'telehandler') {
          targetLocation = availableLocations.find(l => l.id === 'workshop') || availableLocations[0];
        } else if (typeId === 'concreteMixer' || typeId === 'concreteplacer' || typeId === 'roadPaver' || typeId === 'grader') {
          targetLocation = availableLocations.find(l => l.id === 'regional') || availableLocations[0];
        } else if (typeId === 'dumptruck' || typeId === 'loader' || typeId === 'scraper') {
          targetLocation = availableLocations.find(l => l.id === 'international') || availableLocations[0];
        } else if (typeId === 'tunnelBorer' || typeId === 'drillrig' || typeId === 'dragline' || typeId === 'piledriver') {
          targetLocation = availableLocations.find(l => l.id === 'research') || availableLocations[0];
        } else {
          targetLocation = availableLocations.find(l => l.id === 'training') || availableLocations[0];
        }
        
        const angle = (i * (360 / countToPlace)) * (Math.PI / 180);
        const distance = 15 + (Math.random() * 10); // Random distance from the location
        const x = targetLocation.x + Math.cos(angle) * distance;
        const y = targetLocation.y + Math.sin(angle) * distance;
        
        // Add equipment to map
        elements.push(
          <div 
            key={`${typeId}-${i}`} 
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all ${showRevenueVisualization ? 'opacity-100' : 'opacity-70'} hover:opacity-100 hover:scale-110 tooltip-trigger`}
            style={{ 
              left: `${x}%`, 
              top: `${y}%`,
              zIndex: Math.floor(y),
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <div className={equipmentSize} title={`${equipmentType.name}: ${formatCurrency(ownedEquipment.revenue * ownedEquipment.count)}/s`}>
              {getEquipmentEmoji(typeId)}
            </div>
            {showRevenueVisualization && (
              <div className="text-xs text-green-400 font-bold">
                {formatCurrency(ownedEquipment.revenue)}/s
              </div>
            )}
            <div className="text-xs text-white bg-gray-800 px-1 rounded opacity-80">
              {equipmentType.name}
            </div>
            <div className="tooltip">
              <div className="font-bold mb-1">{equipmentType.name}</div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <span className="text-gray-400">Revenue:</span>
                <span className="text-green-400">{formatCurrency(ownedEquipment.revenue)}/s</span>
                <span className="text-gray-400">Owned:</span>
                <span className="text-blue-400">{ownedEquipment.count}</span>
                <span className="text-gray-400">Total:</span>
                <span className="text-green-400">{formatCurrency(ownedEquipment.revenue * ownedEquipment.count)}/s</span>
              </div>
            </div>
          </div>
        );
        
        equipmentPlaced++;
      }
    });
    
    // Add revenue flow animations if enabled
    if (showRevenueVisualization && animateRevenue) {
      availableLocations.forEach(location => {
        elements.push(
          <div 
            key={`revenue-flow-${location.id}`}
            className="absolute w-4 h-4 bg-green-500 rounded-full animate-ping opacity-70"
            style={{ 
              left: `${location.x}%`, 
              top: `${location.y}%`,
              zIndex: 30
            }}
          />
        );
        
        // Add money flow lines to HQ
        if (location.id !== 'hq') {
          const hqLocation = businessLocations.find(l => l.id === 'hq')!;
          elements.push(
            <svg
              key={`money-flow-${location.id}`}
              className="absolute left-0 top-0 w-full h-full z-5 pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <line 
                x1={`${location.x}%`} 
                y1={`${location.y}%`} 
                x2={`${hqLocation.x}%`} 
                y2={`${hqLocation.y}%`} 
                stroke="#10B981" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                className="animate-dash"
              />
            </svg>
          );
        }
      });
    }
    
    // Add roads connecting locations
    elements.unshift(
      <div key="roads" className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {availableLocations.map((fromLocation, i) => (
              availableLocations.slice(i + 1).map(toLocation => (
                <line 
                  key={`road-${fromLocation.id}-${toLocation.id}`}
                  x1={`${fromLocation.x}`} 
                  y1={`${fromLocation.y}`} 
                  x2={`${toLocation.x}`} 
                  y2={`${toLocation.y}`} 
                  stroke="#888" 
                  strokeWidth="1"
                />
              ))
            ))}
          </svg>
        </div>
      </div>
    );
    
    return elements;
  };
  
  // Helper function to get emoji for equipment type
  const getEquipmentEmoji = (typeId: string) => {
    const emojiMap: Record<string, string> = {
      excavator: '🚜',
      bulldozer: '🏗️',
      crane: '🏗️',
      truck: '🚚',
      concreteMixer: '🧱',
      roadPaver: '🛣️',
      tunnelBorer: '⛏️',
      megaCrane: '🏙️',
      generator: '⚡',
      pressurewasher: '💦',
      jackhammer: '🔨',
      skidsteer: '🚜',
      scissorlift: '⬆️',
      trencher: '⛏️',
      telehandler: '🏗️',
      dumptruck: '🚚',
      loader: '🚧',
      grader: '🚧',
      scraper: '🏗️',
      drillrig: '🔄',
      dragline: '⚓',
      piledriver: '⬇️',
      concreteplacer: '🧱',
    };
    
    return emojiMap[typeId] || '🚜';
  };
  
  // Get details for selected location
  const getLocationDetails = () => {
    if (!selectedLocation) return null;
    
    const location = businessLocations.find(l => l.id === selectedLocation);
    if (!location) return null;
    
    // Different content based on location type
    switch (location.id) {
      case 'hq':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-blue-300">Company Headquarters</h3>
            <p className="text-sm text-gray-300">Your main office where all operations are coordinated.</p>
            <div className="flex justify-between">
              <span className="text-gray-400">Business Level:</span>
              <span className="text-yellow-400">{player.businessLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Revenue:</span>
              <span className="text-green-400">{formatCurrency(player.revenuePerSecond)}/s</span>
            </div>
          </div>
        );
      case 'depot':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-blue-300">Equipment Depot</h3>
            <p className="text-sm text-gray-300">Where your construction equipment is stored and maintained.</p>
            <div className="flex justify-between">
              <span className="text-gray-400">Equipment Count:</span>
              <span className="text-blue-400">{totalEquipment}</span>
            </div>
          </div>
        );
      case 'workshop':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-blue-300">Repair Workshop</h3>
            <p className="text-sm text-gray-300">Equipment is serviced here to maintain optimal performance.</p>
            <div className="flex justify-between">
              <span className="text-gray-400">Efficiency Bonus:</span>
              <span className="text-purple-400">+5%</span>
            </div>
          </div>
        );
      case 'training':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-blue-300">Training Center</h3>
            <p className="text-sm text-gray-300">Staff are trained here to improve operational efficiency.</p>
            <div className="flex justify-between">
              <span className="text-gray-400">Staff Skill:</span>
              <span className="text-yellow-400">Level {Math.min(player.businessLevel, 5)}</span>
            </div>
          </div>
        );
      case 'research':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-blue-300">R&D Center</h3>
            <p className="text-sm text-gray-300">Research facility where new equipment improvements are developed.</p>
            <div className="flex justify-between">
              <span className="text-gray-400">Technology Level:</span>
              <span className="text-blue-400">Tier {Math.min(player.businessLevel, 5)}</span>
            </div>
          </div>
        );
      case 'regional':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-blue-300">Regional Office</h3>
            <p className="text-sm text-gray-300">Oversees operations in your expanded territory.</p>
            <div className="flex justify-between">
              <span className="text-gray-400">Market Reach:</span>
              <span className="text-green-400">National</span>
            </div>
          </div>
        );
      case 'international':
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-blue-300">International HQ</h3>
            <p className="text-sm text-gray-300">Coordinates your global rental empire operations.</p>
            <div className="flex justify-between">
              <span className="text-gray-400">Global Presence:</span>
              <span className="text-purple-400">Established</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Business Map</h2>
        <div className="flex space-x-4">
          <button 
            className={`px-3 py-1 rounded text-sm ${showRevenueVisualization ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setShowRevenueVisualization(!showRevenueVisualization)}
          >
            {showRevenueVisualization ? 'Hide Revenue Flow' : 'Show Revenue Flow'}
          </button>
          <div className="text-white">
            <span className="font-bold">{totalEquipment}</span> Equipment Deployed
          </div>
        </div>
      </div>
      
      <div className="bg-green-900 border border-green-700 rounded-lg p-4 h-96 relative overflow-hidden">
        {/* Map background with grid */}
        <div className="absolute inset-0 bg-green-800 opacity-50">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }}></div>
        </div>
        
        {/* Map elements */}
        {getMapElements()}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedLocation ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            {getLocationDetails()}
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Business Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue Rate:</span>
                <span className="text-green-400">{formatCurrency(player.revenuePerSecond)}/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Equipment:</span>
                <span className="text-blue-400">{totalEquipment} pieces</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Business Level:</span>
                <span className="text-yellow-400">{currentLevel.name} (Level {player.businessLevel})</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Equipment Breakdown</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Object.entries(equipment.owned)
              .filter(([_, ownedEquipment]: [string, any]) => ownedEquipment.count > 0)
              .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.count - a.count)
              .map(([typeId, ownedEquipment]: [string, any]) => {
                const equipmentRevenue = ownedEquipment.revenue || 0;
                const totalRevenue = equipmentRevenue * ownedEquipment.count;
                
                return (
                  <div key={typeId} className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <span className="mr-1">{getEquipmentEmoji(typeId)}</span>
                      {equipment.types[typeId].name}:
                    </span>
                    <span className="text-blue-400">
                      {ownedEquipment.count} 
                      {showRevenueVisualization && (
                        <span className="text-green-400 ml-2">
                          ({formatCurrency(totalRevenue)}/s)
                        </span>
                      )}
                    </span>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessMap; 