import { createSlice } from '@reduxjs/toolkit';

// Initial upgrades
const initialUpgrades = {
  betterBuckets: {
    id: 'betterBuckets',
    name: 'Better Excavator Buckets',
    description: 'Increases excavator revenue by 25%',
    cost: 200,
    multiplier: 1.25,
    appliesTo: ['excavator'],
    purchased: false,
    unlockRequirement: null, // Available from the start
  },
  highPressureNozzles: {
    id: 'highPressureNozzles',
    name: 'High-Pressure Nozzles',
    description: 'Increases pressure washer revenue by 25%',
    cost: 300,
    multiplier: 1.25,
    appliesTo: ['pressurewasher'],
    purchased: false,
    unlockRequirement: null, // Available from the start
  },
  efficientGenerators: {
    id: 'efficientGenerators',
    name: 'Efficient Generator Motors',
    description: 'Increases generator revenue by 30%',
    cost: 350,
    multiplier: 1.3,
    appliesTo: ['generator'],
    purchased: false,
    unlockRequirement: null, // Available from the start
  },
  fuelEfficiency: {
    id: 'fuelEfficiency',
    name: 'Fuel Efficiency Program',
    description: 'Increases all equipment revenue by 10%',
    cost: 500,
    multiplier: 1.1,
    appliesTo: ['excavator', 'skidsteer', 'scissorlift', 'generator', 'pressurewasher', 'jackhammer'],
    purchased: false,
    unlockRequirement: {
      totalRevenue: 50, // Unlocks when you reach 50/second revenue
      description: 'Reaches 50/second total revenue'
    },
  },
  improvedHydraulics: {
    id: 'improvedHydraulics',
    name: 'Improved Hydraulics',
    description: 'Increases skid steer loader revenue by 30%',
    cost: 750,
    multiplier: 1.3,
    appliesTo: ['skidsteer'],
    purchased: false,
    unlockRequirement: {
      equipmentTypes: ['skidsteer'],
      description: 'Own at least one skid steer loader'
    },
  },
  diamondTips: {
    id: 'diamondTips',
    name: 'Diamond-Tipped Bits',
    description: 'Increases jackhammer revenue by 35%',
    cost: 400,
    multiplier: 1.35,
    appliesTo: ['jackhammer'],
    purchased: false,
    unlockRequirement: {
      equipmentCount: { jackhammer: 3 },
      description: 'Own at least 3 jackhammers'
    },
  },
  elevationExtension: {
    id: 'elevationExtension',
    name: 'Elevation Extension Kit',
    description: 'Increases scissor lift revenue by 40%',
    cost: 900,
    multiplier: 1.4,
    appliesTo: ['scissorlift'],
    purchased: false,
    unlockRequirement: {
      equipmentTypes: ['scissorlift'],
      description: 'Own at least one scissor lift'
    },
  },
  maintenanceContract: {
    id: 'maintenanceContract',
    name: 'Preventative Maintenance',
    description: 'Increases all equipment revenue by 15%',
    cost: 1500,
    multiplier: 1.15,
    appliesTo: ['excavator', 'skidsteer', 'scissorlift', 'generator', 'pressurewasher', 'jackhammer'],
    purchased: false,
    unlockRequirement: {
      totalEquipment: 10,
      description: 'Own at least 10 pieces of equipment'
    },
  },
  advancedTraining: {
    id: 'advancedTraining',
    name: 'Advanced Operator Training',
    description: 'Increases all equipment revenue by 20%',
    cost: 3000,
    multiplier: 1.2,
    appliesTo: ['excavator', 'skidsteer', 'scissorlift', 'generator', 'pressurewasher', 'jackhammer'],
    purchased: false,
    unlockRequirement: {
      currency: 5000,
      totalRevenue: 150,
      description: 'Has 5,000 in cash and 150/second revenue'
    },
  },
};

const initialState = {
  items: initialUpgrades,
};

export const upgradesSlice = createSlice({
  name: 'upgrades',
  initialState,
  reducers: {
    purchaseUpgrade: (state, action) => {
      const upgradeId = action.payload;
      
      if (state.items[upgradeId]) {
        state.items[upgradeId].purchased = true;
      }
    },
    
    unlockUpgrade: (state, action) => {
      const { upgradeId } = action.payload;
      
      if (state.items[upgradeId] && state.items[upgradeId].unlockRequirement) {
        // Remove the unlock requirement to make it available
        state.items[upgradeId].unlockRequirement = null;
        console.log(`Upgrade unlocked: ${state.items[upgradeId].name}`);
      }
    },
    
    addUpgrade: (state, action) => {
      const upgrade = action.payload;
      state.items[upgrade.id] = upgrade;
    },
    
    resetUpgradesState: () => {
      // Return a fresh copy of the initial state
      return { ...initialState };
    },
  },
});

export const { 
  purchaseUpgrade, 
  addUpgrade,
  unlockUpgrade,
  resetUpgradesState
} = upgradesSlice.actions;

export default upgradesSlice.reducer; 