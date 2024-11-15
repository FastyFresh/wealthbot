import React from 'react';

interface StatusIndicatorProps {
  connected: boolean;
  isCorrectNetwork: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ connected, isCorrectNetwork }) => {
  const statusColor = connected 
    ? (isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500') 
    : 'bg-slate-500';

  const statusText = connected 
    ? (isCorrectNetwork ? 'Connected' : 'Wrong Network') 
    : 'Disconnected';

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
      <span className="text-sm font-medium text-slate-200">
        {statusText}
      </span>
    </div>
  );
};