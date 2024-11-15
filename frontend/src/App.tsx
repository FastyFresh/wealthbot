import React from 'react';
import './App.css';
import { TradingDashboard } from './components/trading/TradingDashboard';
import { WalletConnect } from './components/wallet/WalletConnect';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            WealthBot Trading Platform
          </h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="space-y-6">
              <WalletConnect />
              <TradingDashboard />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-800 shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-sm">
            Powered by AI Trading Algorithms - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
