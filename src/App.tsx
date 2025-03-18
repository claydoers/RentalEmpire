import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import RentalStore from './components/RentalStore';
import EquipmentYard from './components/EquipmentYard';
import UpgradesPanel from './components/UpgradesPanel';
import Navigation from './components/Navigation';
import GameLoop from './components/GameLoop';
import AchievementTracker from './components/AchievementTracker';
import UpgradeTracker from './components/UpgradeTracker';
import NotificationCenter from './components/NotificationCenter';
import AchievementsPanel from './components/AchievementsPanel';
import BusinessMap from './components/BusinessMap';
import BusinessPanel from './components/BusinessPanel';
import StatsPanel from './components/StatsPanel';
import MarketTracker from './components/MarketTracker';
import { formatCurrency } from './utils/gameCalculations';
import { lastKnownBalance, updateLastKnownBalance } from './utils/gameState';

function App() {
  const gameState = useSelector((state: RootState) => state.game);
  const ui = useSelector((state: RootState) => state.ui);
  const player = useSelector((state: RootState) => state.player);
  
  // IMPORTANT: Instead of maintaining our own state, use the Redux state directly
  // This ensures consistency across the application
  
  // We'll still update the shared state via the middleware we added
  useEffect(() => {
    if (gameState.isRunning) {
      console.log("App component rendered with currency:", player.currency);
    }
  }, [gameState.isRunning, player.currency]);
  
  if (!gameState.isRunning) {
    return <SplashScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameLoop />
      <AchievementTracker />
      <UpgradeTracker />
      <MarketTracker />
      
      <div className="container mx-auto p-4 pb-24">
        <header className="bg-blue-800 p-4 mb-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Rental Empire</h1>
            <div className="flex flex-col items-end">
              <div className="text-xl font-bold text-yellow-400">{formatCurrency(player.currency)}</div>
              <div className="text-sm text-green-400">+{formatCurrency(player.revenuePerSecond)}/s</div>
            </div>
          </div>
        </header>
        
        <main className="p-4">
          {ui.activeTab === 'dashboard' && <Dashboard />}
          {ui.activeTab === 'store' && <RentalStore />}
          {ui.activeTab === 'yard' && <EquipmentYard />}
          {ui.activeTab === 'upgrades' && <UpgradesPanel />}
          {ui.activeTab === 'business' && <BusinessPanel />}
          {ui.activeTab === 'stats' && <StatsPanel />}
          {ui.activeTab === 'achievements' && <AchievementsPanel />}
          {ui.activeTab === 'map' && <BusinessMap />}
        </main>
      </div>
      
      <Navigation />
      <NotificationCenter />
    </div>
  );
}

export default App; 