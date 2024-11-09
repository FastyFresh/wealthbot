
import React from 'react';
import './App.css';
import { TradingDashboard } from './components/trading/TradingDashboard';
import { WalletConnect } from './components/wallet/WalletConnect';
import { useWallet } from './providers/WalletProvider';
import { theme } from './config/theme';

const App: React.FC = () => {
  const { connected, isLoading } = useWallet();

  return (
    <div className="min-h-screen" style={{ background: theme.colors.primary.background }}>
      <header className="border-b border-slate-700" style={{ background: theme.colors.primary.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
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
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : connected ? (
          <TradingDashboard />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
              Welcome to WealthBot Trading Platform
            </h2>
            <p className="mb-8" style={{ color: theme.colors.text.secondary }}>
              Connect your Phantom wallet to start trading with AI-powered algorithms
            </p>
            <div className="rounded-lg p-6 max-w-2xl mx-auto" style={{ background: theme.colors.primary.surface }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: theme.colors.text.primary }}>
                Getting Started
              </h3>
              <ul className="text-left space-y-4" style={{ color: theme.colors.text.secondary }}>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 mr-2" style={{ color: theme.colors.primary.accent }}>
                    1.
                  </span>
                  Install Phantom Wallet from the Chrome Web Store if you haven't already
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 mr-2" style={{ color: theme.colors.primary.accent }}>
                    2.
                  </span>
                  Click the "Connect Wallet" button in the top right corner
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 mr-2" style={{ color: theme.colors.primary.accent }}>
                    3.
                  </span>
                  Fund your wallet with devnet SOL (minimum 0.1 SOL)
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 mr-2" style={{ color: theme.colors.primary.accent }}>
                    4.
                  </span>
                  Start trading with AI-powered algorithms
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer style={{ background: theme.colors.primary.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="border-t border-slate-700 pt-4">
            <p className="text-center text-sm" style={{ color: theme.colors.text.muted }}>
              Powered by AI Trading Algorithms - {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
