import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketEvent, MarketState } from '../../types';

// Define market events
const marketEvents: Record<string, MarketEvent> = {
  constructionBoom: {
    id: 'constructionBoom',
    name: 'Construction Boom',
    description: 'A surge in construction projects has increased demand for equipment rentals.',
    icon: '🏗️',
    duration: 120, // 2 minutes
    active: false,
    effects: {
      globalRevenueBonusMultiplier: 0.25, // 25% more revenue
    }
  },
  economicDownturn: {
    id: 'economicDownturn',
    name: 'Economic Downturn',
    description: 'A slowdown in the economy has reduced demand for equipment rentals.',
    icon: '📉',
    duration: 90, // 1.5 minutes
    active: false,
    effects: {
      globalRevenueBonusMultiplier: -0.15, // 15% less revenue
      globalPriceMultiplier: 0.8, // 20% discount on equipment
    }
  },
  fuelShortage: {
    id: 'fuelShortage',
    name: 'Fuel Shortage',
    description: 'Rising fuel costs are affecting heavy equipment operations.',
    icon: '⛽',
    duration: 60, // 1 minute
    active: false,
    effects: {
      revenueBonusMultiplier: {
        excavator: -0.2,
        bulldozer: -0.3,
        truck: -0.4,
      }
    }
  },
  governmentInfrastructureProject: {
    id: 'governmentInfrastructureProject',
    name: 'Government Infrastructure Project',
    description: 'A major government project has increased demand for specific equipment.',
    icon: '🏛️',
    duration: 180, // 3 minutes
    active: false,
    effects: {
      revenueBonusMultiplier: {
        crane: 0.5,
        excavator: 0.3,
        concreteMixer: 0.4,
      }
    }
  },
  equipmentShortage: {
    id: 'equipmentShortage',
    name: 'Equipment Shortage',
    description: 'A shortage of new equipment has increased the value of your fleet.',
    icon: '📦',
    duration: 150, // 2.5 minutes
    active: false,
    effects: {
      globalRevenueBonusMultiplier: 0.2, // 20% more revenue
      globalPriceMultiplier: 1.3, // 30% more expensive to buy
    }
  },
  seasonalDemand: {
    id: 'seasonalDemand',
    name: 'Seasonal Demand',
    description: 'Seasonal construction projects have created fluctuations in equipment demand.',
    icon: '🌤️',
    duration: 120, // 2 minutes
    active: false,
    effects: {
      revenueBonusMultiplier: {
        bulldozer: 0.4,
        roadPaver: 0.3,
        truck: 0.2,
      },
      equipmentPriceMultiplier: {
        excavator: 0.8,
        crane: 1.2,
      }
    }
  },
  technologicalBreakthrough: {
    id: 'technologicalBreakthrough',
    name: 'Technological Breakthrough',
    description: 'New technology has temporarily improved equipment efficiency.',
    icon: '💡',
    duration: 90, // 1.5 minutes
    active: false,
    effects: {
      globalRevenueBonusMultiplier: 0.15, // 15% more revenue
    }
  }
};

const initialState: MarketState = {
  events: marketEvents,
  activeEventIds: [],
  lastEventTime: Date.now(),
  eventCooldown: 60, // 1 minute between events
};

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    triggerMarketEvent: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      const event = state.events[eventId];
      
      if (event && !event.active) {
        // Set event as active
        state.events[eventId].active = true;
        state.events[eventId].startTime = Date.now();
        state.events[eventId].endTime = Date.now() + (event.duration * 1000);
        
        // Add to active events
        if (!state.activeEventIds.includes(eventId)) {
          state.activeEventIds.push(eventId);
        }
        
        // Update last event time
        state.lastEventTime = Date.now();
      }
    },
    
    endMarketEvent: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      
      if (state.events[eventId]) {
        // Set event as inactive
        state.events[eventId].active = false;
        state.events[eventId].startTime = undefined;
        state.events[eventId].endTime = undefined;
        
        // Remove from active events
        state.activeEventIds = state.activeEventIds.filter(id => id !== eventId);
      }
    },
    
    checkMarketEvents: (state) => {
      const now = Date.now();
      
      // Check if any active events have ended
      state.activeEventIds.forEach(eventId => {
        const event = state.events[eventId];
        if (event.active && event.endTime && now >= event.endTime) {
          // End the event
          state.events[eventId].active = false;
          state.events[eventId].startTime = undefined;
          state.events[eventId].endTime = undefined;
        }
      });
      
      // Update active event IDs
      state.activeEventIds = Object.keys(state.events).filter(
        eventId => state.events[eventId].active
      );
    },
    
    resetMarketState: () => {
      return { ...initialState, lastEventTime: Date.now() };
    },
  },
});

export const { 
  triggerMarketEvent,
  endMarketEvent,
  checkMarketEvents,
  resetMarketState
} = marketSlice.actions;

export default marketSlice.reducer; 