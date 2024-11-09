import React, { useState, useEffect } from 'react';
import { useWallet } from '../../providers/WalletProvider';
import { WalletPurpose, RiskLevel } from '../../types/wallet-types';

interface TradingStats {
  dailyVolume: number;
  openPositions: number;
  profitLoss: number;
  successRate: number;
}

const FinancialDashboard: React.FC = () => {
  const {
    connected,
    balance,
    transactions,
    publicKey,
    isLoading,
    segregatedWallets,
    createSegregatedWallet,
    fundWallet,
    withdrawFunds,
    requestAirdrop
  } = useWallet();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'trading' | 'wallets' | 'history'>('overview');
  const [tradingStats, setTradingStats] = useState<TradingStats>({
    dailyVolume: 0,
    openPositions: 0,
    profitLoss: 0,
    successRate: 0
  });

  useEffect(() => {
    if (connected && publicKey) {
      // Simulate trading stats update
      const interval = setInterval(() => {
        setTradingStats({
          dailyVolume: Math.random() * 1000,
          openPositions: Math.floor(Math.random() * 10),
          profitLoss: (Math.random() - 0.5) * 100,
          successRate: Math.random() * 100
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [connected, publicKey]);

  const handleCreateWallet = async () => {
    try {
      await createSegregatedWallet(
        'Trading Wallet',
        WalletPurpose.TRADING,
        RiskLevel.MEDIUM
      );
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const handleFundWallet = async (amount: number) => {
    try {
      await fundWallet(amount);
    } catch (error) {
      console.error('Error funding wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'trading', 'wallets', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as any)}
                className={`
                  ${selectedTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Overview Section */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Balance</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {isLoading ? '...' : `${balance?.total.toFixed(4) || 0} SOL`}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Available</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {isLoading ? '...' : `${balance?.available.toFixed(4) || 0} SOL`}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Locked in Trades</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {isLoading ? '...' : `${balance?.locked.toFixed(4) || 0} SOL`}
                  </p>
                </div>
              </div>

              {/* Trading Stats */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Daily Volume</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tradingStats.dailyVolume.toFixed(2)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Open Positions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tradingStats.openPositions}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profit/Loss</p>
                    <p className={`text-2xl font-bold ${
                      tradingStats.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tradingStats.profitLoss.toFixed(2)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tradingStats.successRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleFundWallet(1)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Fund Wallet
                  </button>
                  <button
                    onClick={handleCreateWallet}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Trading Wallet
                  </button>
                  <button
                    onClick={() => requestAirdrop()}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Request Airdrop
                  </button>
                  <button
                    onClick={() => withdrawFunds(0.1)}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Withdraw Funds
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Trading Section */}
          {selectedTab === 'trading' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Trading Interface</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Trading Chart Placeholder */}
                <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center">
                  <p className="text-gray-500">Trading Chart Coming Soon</p>
                </div>
                {/* Order Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order Type</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option>Market</option>
                      <option>Limit</option>
                      <option>Stop</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount (SOL)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      Buy
                    </button>
                    <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wallets Section */}
          {selectedTab === 'wallets' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Segregated Wallets</h2>
              <div className="space-y-4">
                {segregatedWallets.map((wallet, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                        <p className="text-sm text-gray-500">{wallet.publicKey.toString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Purpose</p>
                        <p className="font-medium text-gray-900">{wallet.purpose}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {segregatedWallets.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No segregated wallets created yet</p>
                )}
              </div>
            </div>
          )}

          {/* History Section */}
          {selectedTab === 'history' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Transaction History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-800' :
                            tx.type === 'WITHDRAW' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tx.amount.toFixed(4)} SOL
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tx.timestamp * 1000).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No transactions yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;