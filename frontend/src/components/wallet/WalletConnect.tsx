
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DEVNET_CONFIG } from '../../config/devnet';

export const WalletConnect: React.FC = () => {
  const { connected, connecting, disconnect, connect, publicKey } = useWallet();

  const handleConnect = async () => {
    try {
      if (window.solana?.networkVersion !== 'devnet') {
        alert('Please switch to Devnet network in your Phantom wallet');
        return;
      }
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm font-medium text-gray-700">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <button
          onClick={connected ? handleDisconnect : handleConnect}
          disabled={connecting}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            connecting
              ? 'bg-gray-400 cursor-not-allowed'
              : connected
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {connecting
            ? 'Connecting...'
            : connected
            ? 'Disconnect'
            : 'Connect Wallet'}
        </button>
      </div>

      {connected && publicKey && (
        <div className="text-sm text-gray-600">
          <p>Address: {publicKey.toString()}</p>
          <p className="mt-1">Network: {DEVNET_CONFIG.network}</p>
        </div>
      )}
    </div>
  );
};
