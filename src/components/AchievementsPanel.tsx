import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { formatCurrency } from '../utils/gameCalculations';

const AchievementsPanel: React.FC = () => {
  const achievements = useSelector((state: RootState) => state.achievements.items);
  
  // Group achievements by completion status
  const completedAchievements = Object.values(achievements).filter(a => a.completed);
  const incompleteAchievements = Object.values(achievements).filter(a => !a.completed);

  // Format date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString() + ' ' + 
           new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format reward
  const formatReward = (type: string, amount: number) => {
    if (type === 'currency') {
      return `${formatCurrency(amount)} bonus`;
    } else if (type === 'multiplier') {
      return `${(amount * 100).toFixed(0)}% revenue boost`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Achievements</h2>
        <div className="text-white">
          <span className="font-bold">{completedAchievements.length}</span> / {Object.values(achievements).length} Unlocked
        </div>
      </div>

      {/* Completed achievements */}
      {completedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-3">Unlocked</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="bg-gray-800 border border-green-500 rounded-lg p-4 flex items-start"
              >
                <div className="text-3xl mr-3">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-green-400">{achievement.name}</h4>
                  <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-400">
                      {formatReward(achievement.reward.type, achievement.reward.amount)}
                    </span>
                    <span className="text-gray-400">
                      {formatDate(achievement.dateCompleted)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incomplete achievements */}
      {incompleteAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-400 mb-3">Locked</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incompleteAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-start opacity-75"
              >
                <div className="text-3xl mr-3 opacity-50">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-400">{achievement.name}</h4>
                  <p className="text-gray-500 text-sm mb-2">{achievement.description}</p>
                  <div className="text-xs text-yellow-500 opacity-75">
                    {formatReward(achievement.reward.type, achievement.reward.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPanel; 