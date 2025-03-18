import { createSlice } from '@reduxjs/toolkit';
import { Achievement } from '../../types';

// Initial achievements
const initialAchievements: Record<string, Achievement> = {
  firstPurchase: {
    id: 'firstPurchase',
    name: 'First Steps',
    description: 'Purchase your first piece of equipment',
    icon: '🏆',
    requirement: {
      type: 'equipment',
      target: 1,
    },
    reward: {
      type: 'currency',
      amount: 50,
    },
    completed: false,
  },
  moneyMaker: {
    id: 'moneyMaker',
    name: 'Money Maker',
    description: 'Earn a total of $1,000',
    icon: '💰',
    requirement: {
      type: 'currency',
      target: 1000,
    },
    reward: {
      type: 'currency',
      amount: 200,
    },
    completed: false,
  },
  fleetManager: {
    id: 'fleetManager',
    name: 'Fleet Manager',
    description: 'Own 5 pieces of equipment',
    icon: '🚜',
    requirement: {
      type: 'equipment',
      target: 5,
    },
    reward: {
      type: 'multiplier',
      amount: 0.05, // 5% revenue boost
    },
    completed: false,
  },
  excavatorExpert: {
    id: 'excavatorExpert',
    name: 'Excavator Expert',
    description: 'Own 10 excavators',
    icon: '🏗️',
    requirement: {
      type: 'equipment',
      target: 10,
      equipmentId: 'excavator',
    },
    reward: {
      type: 'multiplier',
      amount: 0.1, // 10% revenue boost
    },
    completed: false,
  },
  upgradeEnthusiast: {
    id: 'upgradeEnthusiast',
    name: 'Upgrade Enthusiast',
    description: 'Purchase your first upgrade',
    icon: '⬆️',
    requirement: {
      type: 'upgrades',
      target: 1,
    },
    reward: {
      type: 'currency',
      amount: 100,
    },
    completed: false,
  },
  revenueStream: {
    id: 'revenueStream',
    name: 'Revenue Stream',
    description: 'Reach $10/s revenue rate',
    icon: '💸',
    requirement: {
      type: 'revenue',
      target: 10,
    },
    reward: {
      type: 'currency',
      amount: 500,
    },
    completed: false,
  },
  timeCommitment: {
    id: 'timeCommitment',
    name: 'Time Commitment',
    description: 'Play for 5 minutes',
    icon: '⏱️',
    requirement: {
      type: 'time',
      target: 300, // 5 minutes in seconds
    },
    reward: {
      type: 'currency',
      amount: 150,
    },
    completed: false,
  },
  // Business level achievements
  businessLevel2: {
    id: 'businessLevel2',
    name: 'Small Business',
    description: 'Reach a revenue rate of $50/s and own 5 pieces of equipment',
    icon: '🏢',
    requirement: {
      type: 'businessLevel',
      target: 2,
    },
    reward: {
      type: 'currency',
      amount: 500,
    },
    completed: false,
  },
  businessLevel3: {
    id: 'businessLevel3',
    name: 'Growing Enterprise',
    description: 'Reach a revenue rate of $200/s and own 15 pieces of equipment',
    icon: '🏗️',
    requirement: {
      type: 'businessLevel',
      target: 3,
    },
    reward: {
      type: 'multiplier',
      amount: 0.1, // 10% revenue boost
    },
    completed: false,
  },
  businessLevel4: {
    id: 'businessLevel4',
    name: 'Regional Player',
    description: 'Reach a revenue rate of $1,000/s and own 30 pieces of equipment',
    icon: '🏙️',
    requirement: {
      type: 'businessLevel',
      target: 4,
    },
    reward: {
      type: 'currency',
      amount: 10000,
    },
    completed: false,
  },
  businessLevel5: {
    id: 'businessLevel5',
    name: 'National Corporation',
    description: 'Reach a revenue rate of $5,000/s and own 50 pieces of equipment',
    icon: '🌇',
    requirement: {
      type: 'businessLevel',
      target: 5,
    },
    reward: {
      type: 'multiplier',
      amount: 0.2, // 20% revenue boost
    },
    completed: false,
  },
  businessLevel6: {
    id: 'businessLevel6',
    name: 'Industry Leader',
    description: 'Reach a revenue rate of $20,000/s and own 100 pieces of equipment',
    icon: '🌆',
    requirement: {
      type: 'businessLevel',
      target: 6,
    },
    reward: {
      type: 'currency',
      amount: 200000,
    },
    completed: false,
  },
  businessLevel7: {
    id: 'businessLevel7',
    name: 'Global Empire',
    description: 'Reach a revenue rate of $100,000/s and own 200 pieces of equipment',
    icon: '🌎',
    requirement: {
      type: 'businessLevel',
      target: 7,
    },
    reward: {
      type: 'multiplier',
      amount: 0.5, // 50% revenue boost
    },
    completed: false,
  },
};

const initialState = {
  items: initialAchievements,
};

export const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    completeAchievement: (state, action) => {
      const achievementId = action.payload;
      
      if (state.items[achievementId] && !state.items[achievementId].completed) {
        state.items[achievementId].completed = true;
        state.items[achievementId].dateCompleted = Date.now();
      }
    },
    
    resetAchievementsState: () => {
      // Return a fresh copy of the initial state
      return { ...initialState };
    },
  },
});

export const { 
  completeAchievement,
  resetAchievementsState,
} = achievementsSlice.actions;

export default achievementsSlice.reducer; 