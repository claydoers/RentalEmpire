export interface PlayerState {
  currency: number;
  revenuePerSecond: number;
  totalEarned: number;
  lastSaved: number;
  unlocks: string[];
  businessLevel: number;
  nextLevelThreshold: number;
}

export interface EquipmentType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  baseRevenue: number;
  unlockRequirement?: {
    currency: number;
    equipmentOwned?: Record<string, number>;
  };
  image: string;
}

export interface OwnedEquipment {
  typeId: string;
  count: number;
  level: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  appliesTo: string[];
  purchased: boolean;
  unlockRequirement?: {
    currency?: number;
    totalRevenue?: number;
    equipmentTypes?: string[];
    equipmentCount?: Record<string, number>;
    totalEquipment?: number;
    description: string;
  } | null;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
  achievementId?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  darkMode: boolean;
}

export interface UIState {
  activeTab: string;
  notifications: Notification[];
}

export interface GameState {
  isRunning: boolean;
  tickRate: number;
  lastTick: number;
}

export interface EquipmentState {
  types: Record<string, EquipmentType>;
  owned: Record<string, OwnedEquipment>;
}

export interface UpgradesState {
  items: Record<string, Upgrade>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'currency' | 'revenue' | 'equipment' | 'upgrades' | 'time' | 'businessLevel';
    target: number;
    equipmentId?: string;
  };
  reward: {
    type: 'currency' | 'multiplier';
    amount: number;
  };
  completed: boolean;
  dateCompleted?: number;
}

export interface AchievementsState {
  items: Record<string, Achievement>;
}

export interface BusinessLevel {
  level: number;
  name: string;
  description: string;
  icon: string;
  revenueRequirement: number;
  equipmentRequirement?: number;
  rewards: {
    currencyBonus?: number;
    revenueMultiplier?: number;
    unlockEquipment?: string[];
    unlockUpgrades?: string[];
  };
}

export interface ProgressionState {
  levels: Record<number, BusinessLevel>;
  currentMilestones: string[];
  completedMilestones: string[];
}

export interface MarketEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number; // in seconds
  startTime?: number;
  endTime?: number;
  active: boolean;
  effects: {
    equipmentPriceMultiplier?: Record<string, number>; // by equipment type
    revenueBonusMultiplier?: Record<string, number>; // by equipment type
    globalRevenueBonusMultiplier?: number; // applies to all equipment
    globalPriceMultiplier?: number; // applies to all equipment
  };
}

export interface MarketState {
  events: Record<string, MarketEvent>;
  activeEventIds: string[];
  lastEventTime: number;
  eventCooldown: number; // in seconds
} 