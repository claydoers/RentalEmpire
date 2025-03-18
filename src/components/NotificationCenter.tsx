import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { removeNotification, setActiveTab } from '../features/ui/uiSlice';

const NotificationCenter: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  const dispatch = useDispatch();

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notifications[0].id));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]);

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    // If it's an achievement notification, navigate to achievements tab
    if (notification.achievementId) {
      dispatch(setActiveTab('achievements'));
    }
    
    // Remove the notification
    dispatch(removeNotification(notification.id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`p-3 rounded shadow-lg max-w-xs animate-fade-in ${getNotificationClass(notification.type)} ${notification.achievementId ? 'cursor-pointer' : ''}`}
          onClick={() => notification.achievementId && handleNotificationClick(notification)}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {notification.message}
              {notification.achievementId && (
                <span className="block text-xs mt-1 opacity-80">Click to view achievements</span>
              )}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                dispatch(removeNotification(notification.id));
              }}
              className="ml-2 text-sm opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get the appropriate CSS class based on notification type
const getNotificationClass = (type: string): string => {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'info':
      return 'bg-blue-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-700 text-white';
  }
};

export default NotificationCenter; 