import React from 'react';
import './App.css';
import { FinancialDashboard } from './components/dashboard/FinancialDashboard';
import { WalletConnect } from './components/wallet/WalletConnect';
import { useWallet } from './providers/WalletProvider';

const App: React.FC = () => {
  const { connected, isLoading } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            WealthBot Trading Platform
          </h1>
          <div className="flex items-center space-x-4">
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : connected ? (
          <FinancialDashboard />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to WealthBot Trading Platform
            </h2>
            <p className="text-gray-600 mb-8">
              Connect your Phantom wallet to start trading with AI-powered algorithms
            </p>
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Getting Started
              </h3>
              <ul className="text-left space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                    1.
                  </span>
                  Install Phantom Wallet from the Chrome Web Store if you haven't already
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                    2.
                  </span>
                  Click the "Connect Wallet" button in the top right corner
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                    3.
                  </span>
                  Fund your wallet with devnet SOL to start trading
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 text-blue-600 mr-2">
                    4.
                  </span>
                  Access advanced trading features powered by AI algorithms
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-sm text-gray-500">
              Powered by AI Trading Algorithms - {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;