import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { checkMarketEvents, triggerMarketEvent } from '../features/market/marketSlice';
import { addNotification } from '../features/ui/uiSlice';

const MarketTracker: React.FC = () => {
  const dispatch = useDispatch();
  const market = useSelector((state: RootState) => state.market);
  const gameState = useSelector((state: RootState) => state.game);
  
  // Reference to track if we should trigger a new event
  const shouldTriggerEventRef = useRef(false);
  
  // Check for ended events every second
  useEffect(() => {
    const checkInterval = setInterval(() => {
      dispatch(checkMarketEvents());
    }, 1000);
    
    return () => clearInterval(checkInterval);
  }, [dispatch]);
  
  // Randomly trigger new events
  useEffect(() => {
    // Only run if the game is running
    if (!gameState.isRunning) return;
    
    // Check if enough time has passed since the last event
    const now = Date.now();
    const timeSinceLastEvent = now - market.lastEventTime;
    const cooldownMs = market.eventCooldown * 1000;
    
    if (timeSinceLastEvent >= cooldownMs) {
      // Set flag to trigger event on next tick
      shouldTriggerEventRef.current = true;
    }
    
    // Trigger a new event with a random chance
    if (shouldTriggerEventRef.current) {
      // 5% chance per tick to trigger an event
      const randomChance = Math.random();
      if (randomChance < 0.05) {
        // Reset flag
        shouldTriggerEventRef.current = false;
        
        // Get available events (not currently active)
        const availableEvents = Object.keys(market.events).filter(
          eventId => !market.events[eventId].active
        );
        
        if (availableEvents.length > 0) {
          // Select a random event
          const randomIndex = Math.floor(Math.random() * availableEvents.length);
          const selectedEventId = availableEvents[randomIndex];
          const selectedEvent = market.events[selectedEventId];
          
          // Trigger the event
          dispatch(triggerMarketEvent(selectedEventId));
          
          // Show notification
          dispatch(addNotification({
            message: `Market Event: ${selectedEvent.name}`,
            type: 'info'
          }));
          
          // Show description notification
          dispatch(addNotification({
            message: selectedEvent.description,
            type: 'info'
          }));
        }
      }
    }
  }, [dispatch, gameState.lastTick, market.events, market.lastEventTime, market.eventCooldown, gameState.isRunning]);
  
  // Notify when events end
  useEffect(() => {
    const activeEventIds = Object.keys(market.events).filter(
      eventId => market.events[eventId].active
    );
    
    // Check if any events have just ended
    const endedEvents = market.events;
    Object.keys(endedEvents).forEach(eventId => {
      const event = endedEvents[eventId];
      if (event.endTime && Date.now() >= event.endTime && event.active) {
        // Show notification that event has ended
        dispatch(addNotification({
          message: `Market Event Ended: ${event.name}`,
          type: 'warning'
        }));
      }
    });
  }, [dispatch, market.events, gameState.lastTick]);
  
  return null; // This component doesn't render anything
};

export default MarketTracker; 