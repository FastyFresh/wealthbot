import React from 'react';
import { useWallet } from '../../providers/WalletProvider';

export const WalletConnect: React.FC = () => {
  const { 
    connected, 
    connect, 
    disconnect, 
    isLoading, 
    error, 
    balance,
    publicKey,
    requestAirdrop
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  };

  const handleAirdrop = async () => {
    try {
      await requestAirdrop();
    } catch (error) {
      console.error('Airdrop error:', error);
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 cursor-not-allowed"
      >
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          <div className="font-medium">
            {balance ? `${balance.total.toFixed(4)} SOL` : '0 SOL'}
          </div>
          <div className="text-xs truncate w-32">
            {`${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleAirdrop}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Devnet SOL
          </button>
          <button
            onClick={handleDisconnect}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="text-red-600 text-sm mb-2">
          {error}
        </div>
      )}
      <button
        onClick={handleConnect}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Connect Wallet
      </button>
    </div>
  );
};