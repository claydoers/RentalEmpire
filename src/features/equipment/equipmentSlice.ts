import { createSlice } from '@reduxjs/toolkit';

// Initial equipment types
const initialEquipmentTypes = {
  excavator: {
    id: 'excavator',
    name: 'Compact Excavator',
    description: 'A small but reliable excavator for basic digging tasks.',
    basePrice: 100,
    baseRevenue: 2,
    image: '/assets/excavator.svg',
  },
  generator: {
    id: 'generator',
    name: 'Portable Generator',
    description: 'Provides power to job sites without electrical access.',
    basePrice: 150,
    baseRevenue: 3,
    image: '/assets/generator.svg',
  },
  pressurewasher: {
    id: 'pressurewasher',
    name: 'Pressure Washer',
    description: 'High-pressure water sprayer for cleaning surfaces.',
    basePrice: 200,
    baseRevenue: 4,
    image: '/assets/pressurewasher.svg',
  },
  jackhammer: {
    id: 'jackhammer',
    name: 'Jackhammer',
    description: 'Breaks up concrete, asphalt, and rock for demolition.',
    basePrice: 250,
    baseRevenue: 5,
    image: '/assets/jackhammer.svg',
  },
  skidsteer: {
    id: 'skidsteer',
    name: 'Skid Steer Loader',
    description: 'Versatile loader for moving materials around job sites.',
    basePrice: 250,
    baseRevenue: 5,
    unlockRequirement: {
      currency: 500,
    },
    image: '/assets/skidsteer.png',
  },
  scissorlift: {
    id: 'scissorlift',
    name: 'Scissor Lift',
    description: 'Elevating work platform for reaching high places safely.',
    basePrice: 500,
    baseRevenue: 10,
    unlockRequirement: {
      currency: 1500,
    },
    image: '/assets/scissorlift.png',
  },
  
  // Business Level 2 Unlock
  bulldozer: {
    id: 'bulldozer',
    name: 'Bulldozer',
    description: 'Heavy equipment used for pushing large quantities of soil or rubble.',
    basePrice: 800,
    baseRevenue: 16,
    unlockRequirement: {
      currency: 2000,
    },
    image: '/assets/bulldozer.svg',
  },
  
  // Business Level 3 Unlock
  crane: {
    id: 'crane',
    name: 'Mobile Crane',
    description: 'Lifting equipment for moving heavy materials on construction sites.',
    basePrice: 1500,
    baseRevenue: 30,
    unlockRequirement: {
      currency: 5000,
    },
    image: '/assets/crane.svg',
  },
  
  // Business Level 4 Unlock
  concreteMixer: {
    id: 'concreteMixer',
    name: 'Concrete Mixer',
    description: 'Mixes cement, aggregates, and water to form concrete for construction projects.',
    basePrice: 3000,
    baseRevenue: 60,
    unlockRequirement: {
      currency: 10000,
    },
    image: '/assets/concretemixer.svg',
  },
  
  // Business Level 5 Unlock
  roadPaver: {
    id: 'roadPaver',
    name: 'Asphalt Paver',
    description: 'Lays asphalt on roads, parking lots, and other surfaces smoothly and precisely.',
    basePrice: 8000,
    baseRevenue: 160,
    unlockRequirement: {
      currency: 25000,
    },
    image: '/assets/roadpaver.svg',
  },
  
  // Business Level 6 Unlock
  tunnelBorer: {
    id: 'tunnelBorer',
    name: 'Tunnel Boring Machine',
    description: 'Excavates tunnels with a circular cross section through various soil and rock types.',
    basePrice: 20000,
    baseRevenue: 400,
    unlockRequirement: {
      currency: 80000,
    },
    image: '/assets/tunnelborer.svg',
  },
  
  // Business Level 7 Unlock
  megaCrane: {
    id: 'megaCrane',
    name: 'Tower Crane',
    description: 'Fixed crane used in the construction of tall buildings, capable of lifting heavy loads to great heights.',
    basePrice: 50000,
    baseRevenue: 1000,
    unlockRequirement: {
      currency: 200000,
    },
    image: '/assets/megacrane.svg',
  },
  
  // Additional Equipment Types
  trencher: {
    id: 'trencher',
    name: 'Trencher',
    description: 'Creates trenches for laying pipes, cables, or drainage systems.',
    basePrice: 1200,
    baseRevenue: 24,
    unlockRequirement: {
      currency: 3000,
    },
    image: '/assets/trencher.svg',
  },
  
  telehandler: {
    id: 'telehandler',
    name: 'Telehandler',
    description: 'A versatile lifting machine with an extendable boom for reaching difficult areas.',
    basePrice: 2000,
    baseRevenue: 40,
    unlockRequirement: {
      currency: 7000,
    },
    image: '/assets/telehandler.svg',
  },
  
  dumptruck: {
    id: 'dumptruck',
    name: 'Dump Truck',
    description: 'Hauls loose material such as sand, gravel, or demolition waste for construction projects.',
    basePrice: 3500,
    baseRevenue: 70,
    unlockRequirement: {
      currency: 12000,
    },
    image: '/assets/dumptruck.svg',
  },
  
  loader: {
    id: 'loader',
    name: 'Wheel Loader',
    description: 'Heavy equipment used for loading materials into trucks, laying pipe, clearing land, and more.',
    basePrice: 4500,
    baseRevenue: 90,
    unlockRequirement: {
      currency: 15000,
    },
    image: '/assets/loader.svg',
  },
  
  grader: {
    id: 'grader',
    name: 'Motor Grader',
    description: 'Creates flat surfaces for roads and foundations with precision.',
    basePrice: 7000,
    baseRevenue: 140,
    unlockRequirement: {
      currency: 20000,
    },
    image: '/assets/grader.svg',
  },
  
  scraper: {
    id: 'scraper',
    name: 'Earth Scraper',
    description: 'Moves large volumes of earth over long distances to precise grades.',
    basePrice: 12000,
    baseRevenue: 240,
    unlockRequirement: {
      currency: 40000,
    },
    image: '/assets/scraper.svg',
  },
  
  drillrig: {
    id: 'drillrig',
    name: 'Drilling Rig',
    description: 'Creates holes in the earth for wells, foundations, or resource extraction.',
    basePrice: 15000,
    baseRevenue: 300,
    unlockRequirement: {
      currency: 50000,
    },
    image: '/assets/drillrig.svg',
  },
  
  dragline: {
    id: 'dragline',
    name: 'Dragline Excavator',
    description: 'Massive excavator used in large-scale civil engineering and surface mining projects.',
    basePrice: 30000,
    baseRevenue: 600,
    unlockRequirement: {
      currency: 100000,
    },
    image: '/assets/dragline.svg',
  },
  
  piledriver: {
    id: 'piledriver',
    name: 'Pile Driver',
    description: 'Drives piles into soil to provide foundation support for buildings or other structures.',
    basePrice: 25000,
    baseRevenue: 500,
    unlockRequirement: {
      currency: 90000,
    },
    image: '/assets/piledriver.svg',
  },
  
  concreteplacer: {
    id: 'concreteplacer',
    name: 'Concrete Boom Pump',
    description: 'Delivers concrete precisely to locations that are difficult to access.',
    basePrice: 18000,
    baseRevenue: 360,
    unlockRequirement: {
      currency: 70000,
    },
    image: '/assets/concreteplacer.svg',
  },
};

const initialState = {
  types: initialEquipmentTypes,
  owned: {},
};

export const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    purchaseEquipment: (state, action) => {
      const { typeId } = action.payload;
      
      if (!state.owned[typeId]) {
        state.owned[typeId] = {
          typeId,
          count: 1,
          level: 1,
        };
      } else {
        state.owned[typeId].count += 1;
      }
    },
    
    sellEquipment: (state, action) => {
      const { typeId } = action.payload;
      
      if (state.owned[typeId] && state.owned[typeId].count > 0) {
        state.owned[typeId].count -= 1;
        
        // If count reaches 0, remove the equipment from owned
        if (state.owned[typeId].count === 0) {
          delete state.owned[typeId];
        }
      }
    },
    
    upgradeEquipment: (state, action) => {
      const { typeId } = action.payload;
      
      if (state.owned[typeId]) {
        state.owned[typeId].level += 1;
      }
    },
    
    addEquipmentType: (state, action) => {
      const equipmentType = action.payload;
      state.types[equipmentType.id] = equipmentType;
    },
    
    resetEquipmentState: () => {
      // Return a fresh copy of the initial state
      return { ...initialState };
    },
  },
});

export const {
  purchaseEquipment,
  sellEquipment,
  upgradeEquipment,
  addEquipmentType,
  resetEquipmentState,
} = equipmentSlice.actions;

export default equipmentSlice.reducer; 