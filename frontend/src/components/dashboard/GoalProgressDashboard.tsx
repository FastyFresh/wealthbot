
import React, { useEffect, useState } from 'react';
import { TradingStrategy } from '../../services/TradingStrategy';

interface GoalProgressDashboardProps {
  currentValue: number;
  initialDeposit: number;
}

export const GoalProgressDashboard: React.FC<GoalProgressDashboardProps> = ({
  currentValue,
  initialDeposit
}) => {
  const [strategy] = useState(() => new TradingStrategy(initialDeposit));
  const [progressSummary, setProgressSummary] = useState<string>('');
  const [percentageComplete, setPercentageComplete] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const summary = strategy.getGoalProgress(currentValue);
      setProgressSummary(summary);
      setPercentageComplete((currentValue / 1000000) * 100);
    };

    updateProgress();
  }, [currentValue, strategy]);

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Goal Progress</h2>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-4 bg-slate-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-purple-600 transition-all duration-500"
            style={{ width: `${Math.min(percentageComplete, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-slate-300 text-sm">
          ${currentValue.toLocaleString()} / $1,000,000
        </div>
      </div>

      {/* Progress Details */}
      <div className="space-y-4">
        {progressSummary.split('\n').map((line, index) => (
          line.trim() && (
            <div 
              key={index}
              className={`text-sm ${
                line.includes('ahead of schedule') 
                  ? 'text-green-400' 
                  : line.includes('behind schedule') 
                    ? 'text-orange-400' 
                    : 'text-slate-300'
              }`}
            >
              {line}
            </div>
          )
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4">
        <button 
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          onClick={() => {
            // Open deposit modal (to be implemented)
          }}
        >
          Deposit More
        </button>
        <button 
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          onClick={() => {
            // Open detailed stats modal (to be implemented)
          }}
        >
          View Details
        </button>
      </div>

      {/* Milestone Markers */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-3">Milestones</h3>
        <div className="grid grid-cols-4 gap-2">
          {[1000, 10000, 100000, 1000000].map((milestone) => (
            <div 
              key={milestone}
              className={`p-2 rounded ${
                currentValue >= milestone 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              ${milestone.toLocaleString()}
            </div>
          ))}
        </div>
      </div>

      {/* Risk Level Indicator */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">Current Risk Level</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-slate-300 text-sm">
            Optimized for long-term growth
          </span>
        </div>
      </div>
    </div>
  );
};
