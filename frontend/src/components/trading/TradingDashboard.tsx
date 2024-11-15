import React from "react";
import { ErrorBoundary } from "../common/ErrorBoundary";
import ConnectionTest from "../common/ConnectionTest";
import { useWallet } from "@solana/wallet-adapter-react";

interface TradingDashboardProps {
  className?: string;
}

export function TradingDashboard({ className = "" }: TradingDashboardProps) {
  const { publicKey } = useWallet();

  return (
    <ErrorBoundary>
      <div className={`p-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Trading Dashboard</h1>
            <div className="text-slate-300">
              {publicKey ? (
                <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-md">
                  Connected: {publicKey.toString().slice(0, 4)}...
                  {publicKey.toString().slice(-4)}
                </span>
              ) : (
                <span className="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-md">
                  Wallet Not Connected
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <ConnectionTest />
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Trading Interface
              </h2>
              <div className="text-slate-400">
                Trading interface will be available once connection is established
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Market Data
              </h2>
              <div className="text-slate-400">
                Market data will be displayed here once connection is established
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Getting Started
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Connect your Phantom wallet using the wallet button</li>
              <li>
                Ensure your wallet is set to Devnet (use the Connection Test panel
                above)
              </li>
              <li>
                Request devnet SOL from the faucet if needed (minimum 0.1 SOL
                required)
              </li>
              <li>
                Once all connections are verified, the trading interface will be
                enabled
              </li>
            </ol>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}