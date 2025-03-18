import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessLevel, ProgressionState } from '../../types';

// Define business levels
const businessLevels: Record<number, BusinessLevel> = {
  1: {
    level: 1,
    name: 'Startup',
    description: 'A small rental operation just getting started.',
    icon: '🏠',
    revenueRequirement: 0, // Starting level
    rewards: {
      // No rewards for starting level
    }
  },
  2: {
    level: 2,
    name: 'Small Business',
    description: 'Your rental business is gaining traction.',
    icon: '🏢',
    revenueRequirement: 50, // $50/s revenue rate
    equipmentRequirement: 5,
    rewards: {
      currencyBonus: 500,
      revenueMultiplier: 0.05, // 5% revenue boost
      unlockEquipment: ['bulldozer', 'trencher']
    }
  },
  3: {
    level: 3,
    name: 'Growing Enterprise',
    description: 'Your business is expanding rapidly.',
    icon: '🏗️',
    revenueRequirement: 200, // $200/s revenue rate
    equipmentRequirement: 15,
    rewards: {
      currencyBonus: 2000,
      revenueMultiplier: 0.1, // 10% revenue boost
      unlockEquipment: ['crane', 'telehandler'],
      unlockUpgrades: ['operatorTraining']
    }
  },
  4: {
    level: 4,
    name: 'Regional Player',
    description: 'Your company is known throughout the region.',
    icon: '🏙️',
    revenueRequirement: 1000, // $1,000/s revenue rate
    equipmentRequirement: 30,
    rewards: {
      currencyBonus: 10000,
      revenueMultiplier: 0.15, // 15% revenue boost
      unlockEquipment: ['concreteMixer', 'dumptruck'],
      unlockUpgrades: ['fleetManagement']
    }
  },
  5: {
    level: 5,
    name: 'National Corporation',
    description: 'Your corporation has locations across the country.',
    icon: '🌇',
    revenueRequirement: 5000, // $5,000/s revenue rate
    equipmentRequirement: 50,
    rewards: {
      currencyBonus: 50000,
      revenueMultiplier: 0.2, // 20% revenue boost
      unlockEquipment: ['roadPaver', 'grader', 'loader'],
      unlockUpgrades: ['corporateContracts']
    }
  },
  6: {
    level: 6,
    name: 'Industry Leader',
    description: 'You are the leading rental company in the industry.',
    icon: '🌆',
    revenueRequirement: 20000, // $20,000/s revenue rate
    equipmentRequirement: 100,
    rewards: {
      currencyBonus: 200000,
      revenueMultiplier: 0.25, // 25% revenue boost
      unlockEquipment: ['tunnelBorer', 'drillrig', 'scraper'],
      unlockUpgrades: ['industryInnovation']
    }
  },
  7: {
    level: 7,
    name: 'Global Empire',
    description: 'Your rental empire spans the globe.',
    icon: '🌎',
    revenueRequirement: 100000, // $100,000/s revenue rate
    equipmentRequirement: 200,
    rewards: {
      currencyBonus: 1000000,
      revenueMultiplier: 0.5, // 50% revenue boost
      unlockEquipment: ['megaCrane', 'dragline', 'piledriver', 'concreteplacer'],
      unlockUpgrades: ['globalLogistics']
    }
  }
};

const initialState: ProgressionState = {
  levels: businessLevels,
  currentMilestones: [],
  completedMilestones: []
};

export const progressionSlice = createSlice({
  name: 'progression',
  initialState,
  reducers: {
    addMilestone: (state, action: PayloadAction<string>) => {
      if (!state.currentMilestones.includes(action.payload) && 
          !state.completedMilestones.includes(action.payload)) {
        state.currentMilestones.push(action.payload);
      }
    },
    
    completeMilestone: (state, action: PayloadAction<string>) => {
      const milestone = action.payload;
      
      // Remove from current milestones
      state.currentMilestones = state.currentMilestones.filter(m => m !== milestone);
      
      // Add to completed milestones if not already there
      if (!state.completedMilestones.includes(milestone)) {
        state.completedMilestones.push(milestone);
      }
    },
    
    resetProgressionState: () => {
      return { ...initialState };
    }
  }
});

export const { 
  addMilestone,
  completeMilestone,
  resetProgressionState
} = progressionSlice.actions;

export default progressionSlice.reducer; 