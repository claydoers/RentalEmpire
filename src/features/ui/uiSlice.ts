import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Notification } from '../../types/index';

// Extend the UIState interface to include showSplash
interface ExtendedUIState extends UIState {
  showSplash: boolean;
}

const initialState: ExtendedUIState = {
  activeTab: 'dashboard', // 'dashboard', 'yard', 'store', 'upgrades', 'stats', 'achievements', 'progression', 'map'
  notifications: [],
  showSplash: true, // Add this to show splash screen on initial load
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    
    showSplash: (state) => {
      state.showSplash = true;
    },
    
    hideSplash: (state) => {
      state.showSplash = false;
      state.activeTab = 'yard'; // Set active tab to Equipment Yard when splash is hidden
    },
    
    addNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'info' | 'warning' | 'error'; achievementId?: string }>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: Date.now(),
        achievementId: action.payload.achievementId,
      };
      state.notifications = [notification, ...state.notifications].slice(0, 5); // Keep only the 5 most recent notifications
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setActiveTab,
  showSplash,
  hideSplash,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer; 