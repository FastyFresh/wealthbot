import React from 'react';

interface ConnectButtonProps {
  connected: boolean;
  connecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const ConnectButton: React.FC<ConnectButtonProps> = (props) => {
  const { connected, connecting, onConnect, onDisconnect } = props;

  const buttonText = connecting 
    ? 'Connecting...' 
    : connected 
    ? 'Disconnect' 
    : 'Connect Wallet';

  const baseClass = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200';
  const stateClass = connecting 
    ? 'bg-slate-700 cursor-not-allowed text-slate-400'
    : connected 
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-blue-500 hover:bg-blue-600 text-white';

  return React.createElement('button', {
    onClick: connected ? onDisconnect : onConnect,
    disabled: connecting,
    className: [baseClass, stateClass].join(' '),
    children: buttonText
  });
};