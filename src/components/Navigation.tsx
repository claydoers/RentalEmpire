import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { setActiveTab } from '../features/ui/uiSlice';

const Navigation: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'store', label: 'Store', icon: '🛒' },
    { id: 'yard', label: 'Equipment', icon: '🚜' },
    { id: 'upgrades', label: 'Upgrades', icon: '⬆️' },
    { id: 'business', label: 'Business', icon: '🏢' },
    { id: 'stats', label: 'Stats', icon: '📈' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'map', label: 'Business Map', icon: '🗺️' },
  ];
  
  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };
  
  return (
    <nav className="bg-blue-800 fixed bottom-0 left-0 right-0 shadow-lg">
      <div className="container mx-auto">
        <ul className="flex justify-between overflow-x-auto">
          {navItems.map((item) => (
            <li key={item.id} className="flex-1 text-center">
              <button
                onClick={() => handleTabChange(item.id)}
                className={`w-full p-2 rounded transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-700'
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs">{item.label}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 