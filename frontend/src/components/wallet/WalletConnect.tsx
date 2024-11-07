import React from 'react';
import { useWallet } from '../../providers/WalletProvider';

export const WalletConnect = () => {
  const { connected, error, connect, disconnect } = useWallet();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            connected ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
        <span className="text-sm text-gray-600">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        onClick={() => (connected ? disconnect() : connect())}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-white ${
          connected ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {connected ? 'Disconnect' : 'Connect Wallet'}
      </button>
    </div>
  );
};