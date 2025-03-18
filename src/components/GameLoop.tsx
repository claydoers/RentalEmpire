import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { earnRevenue, updateRevenueRate, saveTimestamp } from '../features/player/playerSlice';
import { updateLastTick } from '../features/game/gameSlice';
import { calculateTotalRevenue, calculateOfflineEarnings } from '../utils/gameCalculations';
import { saveGameState, loadGameState } from '../utils/localStorage';
import { addNotification } from '../features/ui/uiSlice';
import { updateLastKnownBalance, updateLastKnownEarnings } from '../utils/gameState';

const GameLoop: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const player = useSelector((state: RootState) => state.player);
  const equipment = useSelector((state: RootState) => state.equipment);
  const upgrades = useSelector((state: RootState) => state.upgrades);
  const progression = useSelector((state: RootState) => state.progression);
  const market = useSelector((state: RootState) => state.market);
  const state = useSelector((state: RootState) => state);
  
  const lastTickRef = useRef(gameState.lastTick);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitializedRef = useRef(false);
  const prevEquipmentRef = useRef(equipment);
  const prevUpgradesRef = useRef(upgrades);

  // Calculate and update revenue rate
  const updateRevenue = () => {
    // Calculate revenue for this tick
    const baseRevenue = calculateTotalRevenue(
      equipment,
      Object.values(upgrades.items)
    );
    
    // Apply business level multiplier if available
    const currentLevel = progression.levels[player.businessLevel];
    const levelMultiplier = currentLevel?.rewards?.revenueMultiplier || 0;
    
    // Apply market event effects
    let marketMultiplier = 1;
    
    // Apply global market multipliers
    market.activeEventIds.forEach(eventId => {
      const event = market.events[eventId];
      if (event.active && event.effects.globalRevenueBonusMultiplier) {
        marketMultiplier += event.effects.globalRevenueBonusMultiplier;
      }
    });
    
    // Calculate final revenue with all multipliers
    const revenueWithMultipliers = baseRevenue * (1 + levelMultiplier) * marketMultiplier;
    
    // Update revenue rate with whole numbers
    dispatch(updateRevenueRate(Math.floor(revenueWithMultipliers)));
    
    console.log('Revenue updated:', Math.floor(revenueWithMultipliers));
  };

  // Handle offline progress and initial setup when the game loads
  useEffect(() => {
    if (gameState.isRunning && !isInitializedRef.current) {
      isInitializedRef.current = true;
      console.log('Initializing game state...');
      
      const savedState = loadGameState();
      
      if (savedState && savedState.player) {
        const offlineEarnings = calculateOfflineEarnings(
          savedState.player.lastSaved,
          savedState.player.revenuePerSecond
        );
        
        if (offlineEarnings > 0) {
          dispatch(earnRevenue(offlineEarnings));
          dispatch(
            addNotification({
              message: `You earned ${offlineEarnings.toFixed(2)} while away!`,
              type: 'success',
            })
          );
        }
        
        // Synchronize shared state variables with current player state
        updateLastKnownBalance(savedState.player.currency);
        updateLastKnownEarnings(savedState.player.totalEarned);
      }
      
      // Calculate initial revenue
      updateRevenue();
      
      // Save initial state
      saveGameState(state);
    }
  }, [dispatch, gameState.isRunning]);

  // Update revenue when equipment or upgrades change
  useEffect(() => {
    if (gameState.isRunning) {
      // Check if equipment or upgrades have changed
      const equipmentChanged = JSON.stringify(equipment.owned) !== JSON.stringify(prevEquipmentRef.current.owned);
      const upgradesChanged = JSON.stringify(upgrades.items) !== JSON.stringify(prevUpgradesRef.current.items);
      
      if (equipmentChanged || upgradesChanged) {
        console.log('Equipment or upgrades changed, updating revenue...');
        updateRevenue();
        
        // Update refs
        prevEquipmentRef.current = equipment;
        prevUpgradesRef.current = upgrades;
      }
    }
  }, [equipment, upgrades, gameState.isRunning]);

  // Set up the game loop
  useEffect(() => {
    if (gameState.isRunning) {
      console.log('Starting game loop with revenue rate:', player.revenuePerSecond);
      
      // Clear any existing interval
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
      
      // Start a new interval
      tickIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const deltaTime = (now - lastTickRef.current) / 1000; // Convert to seconds
        
        // Update revenue rate periodically
        updateRevenue();
        
        // Earn revenue based on time passed
        const revenueEarned = player.revenuePerSecond * deltaTime;
        
        // Only dispatch if we have revenue to earn
        if (revenueEarned > 0) {
          const amountToEarn = Math.floor(revenueEarned);
          if (amountToEarn > 0) {
            // Dispatch the earn revenue action
            console.log('GameLoop: Earning revenue:', amountToEarn, 'Current balance:', player.currency);
            dispatch(earnRevenue(amountToEarn));
          }
        }
        
        // Update last tick
        dispatch(updateLastTick(now));
        lastTickRef.current = now;
        
        // Save timestamp periodically (every 10 seconds)
        if (now % 10000 < gameState.tickRate) {
          dispatch(saveTimestamp());
          saveGameState(state);
        }
      }, gameState.tickRate);
      
      // Clean up on unmount
      return () => {
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
          console.log('Cleaning up game loop');
        }
      };
    }
  }, [
    gameState.isRunning, 
    gameState.tickRate,
    player.revenuePerSecond,
    dispatch
  ]);
  
  // Effect to sync shared state variables with Redux state
  useEffect(() => {
    // Only update if the game is running
    if (gameState.isRunning) {
      // Update the shared state variables with the current Redux state
      updateLastKnownBalance(player.currency);
      updateLastKnownEarnings(player.totalEarned);
    }
  }, [player.currency, player.totalEarned, gameState.isRunning]);

  return null; // This component doesn't render anything
};

export default GameLoop; 