import { EquipmentState, EquipmentType, OwnedEquipment, Upgrade } from '../types';

/**
 * Calculate the revenue per second for a specific equipment
 */
export const calculateEquipmentRevenue = (
  equipment: OwnedEquipment,
  equipmentType: EquipmentType,
  upgrades: Upgrade[]
): number => {
  // Base revenue calculation
  let revenue = equipmentType.baseRevenue * equipment.count;
  
  // Apply level multiplier (10% increase per level)
  revenue *= 1 + (equipment.level - 1) * 0.1;
  
  // Apply upgrades
  const applicableUpgrades = upgrades.filter(
    (upgrade) => upgrade.purchased && upgrade.appliesTo.includes(equipment.typeId)
  );
  
  // Apply each upgrade multiplier
  applicableUpgrades.forEach((upgrade) => {
    revenue *= upgrade.multiplier;
  });
  
  return revenue;
};

/**
 * Calculate the total revenue per second from all equipment
 */
export const calculateTotalRevenue = (
  equipmentState: EquipmentState,
  upgrades: Upgrade[]
): number => {
  const { types, owned } = equipmentState;
  
  return Object.values(owned).reduce((total, ownedEquipment) => {
    const equipmentType = types[ownedEquipment.typeId];
    const revenue = calculateEquipmentRevenue(
      ownedEquipment,
      equipmentType,
      upgrades
    );
    
    return total + revenue;
  }, 0);
};

/**
 * Calculate the upgrade cost for an equipment
 */
export const calculateUpgradeCost = (
  equipment: OwnedEquipment,
  equipmentType: EquipmentType
): number => {
  // Base price * level * 2
  return equipmentType.basePrice * equipment.level * 2;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  // Round to whole numbers
  const roundedAmount = Math.floor(amount);
  
  if (roundedAmount >= 1_000_000) {
    // Still use M abbreviation for millions to keep UI clean
    return `$${Math.floor(roundedAmount / 1_000_000)}M`;
  } else {
    // Use exact values with comma separators for thousands
    return `$${roundedAmount.toLocaleString()}`;
  }
};

/**
 * Calculate offline earnings
 */
export const calculateOfflineEarnings = (
  lastSaved: number,
  revenuePerSecond: number,
  maxOfflineTimeInSeconds: number = 3600 // 1 hour default
): number => {
  const now = Date.now();
  const timeDiffInSeconds = (now - lastSaved) / 1000;
  
  // Cap offline time
  const cappedTimeDiff = Math.min(timeDiffInSeconds, maxOfflineTimeInSeconds);
  
  // Calculate earnings (80% efficiency when offline)
  return cappedTimeDiff * revenuePerSecond * 0.8;
}; 