import React, { useState, useEffect } from 'react';
import { useWallet } from '../../providers/WalletProvider';

const DEVNET_WALLET = 'EMVgeBTMS6zyghXyPZcWWGNT64iCTakBjkpoq7zRhw2x';

interface BalanceInfo {
  total: number;
  available: number;
  locked: number;
}

export const FinancialDashboard: React.FC = () => {
  const { connected } = useWallet();
  const [balance, setBalance] = useState<BalanceInfo>({
    total: 0,
    available: 0,
    locked: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement balance fetching
    setIsLoading(false);
  }, [connected]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Balance</h3>
              <p className="text-3xl font-bold text-blue-600">
                {isLoading ? '...' : `${balance.total} SOL`}
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Available</h3>
              <p className="text-3xl font-bold text-green-600">
                {isLoading ? '...' : `${balance.available} SOL`}
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Locked in Trades</h3>
              <p className="text-3xl font-bold text-purple-600">
                {isLoading ? '...' : `${balance.locked} SOL`}
              </p>
            </div>
          </div>
        </div>

        {/* Trading Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trading Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Trading Actions</h2>
            <div className="space-y-4">
              <button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {/* TODO: Implement deposit */}}
              >
                Deposit Funds
              </button>
              <button
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => {/* TODO: Implement withdraw */}}
              >
                Withdraw Funds
              </button>
              <button
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {/* TODO: Implement new trade */}}
              >
                New Trade
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500">Loading activity...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">Connected Wallet</p>
                      <p className="text-sm text-gray-500">{DEVNET_WALLET.slice(0, 8)}...{DEVNET_WALLET.slice(-8)}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                  </div>
                  {/* Add more activity items here */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Analytics</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Charts coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;