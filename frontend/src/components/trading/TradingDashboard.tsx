import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ErrorBoundary } from '../common/ErrorBoundary';
import type { TradingStrategy } from '../../types/trading-strategy';
import { SOLPerpetualStrategy } from '../../services/TradingStrategy';
import { DriftService } from '../../services/DriftService';

interface LoadingSpinnerProps {
  className?: string;
}

function LoadingSpinner(props: LoadingSpinnerProps): JSX.Element {
  const { className = '' } = props;
  return (
    <div className={`flex justify-center items-center h-64 ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

function ErrorDisplay(props: ErrorDisplayProps): JSX.Element {
  const { error, onRetry } = props;
  return (
    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
      <button onClick={onRetry} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Retry
      </button>
    </div>
  );
}

interface DashboardContentProps {
  className?: string;
}

function DashboardContent(props: DashboardContentProps): JSX.Element {
  const { className = '' } = props;
  const { connected, publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<SOLPerpetualStrategy | null>(null);
  const [strategyState, setStrategyState] = useState<TradingStrategy | null>(null);

  useEffect(() => {
    const initializeStrategy = async () => {
      if (!connected || !publicKey) {
        setError('Please connect your wallet first');
        setLoading(false);
        return;
      }

      try {
        const driftService = new DriftService();
        const newStrategy = new SOLPerpetualStrategy(driftService);
        await newStrategy.initialize();
        setStrategy(newStrategy);
        setStrategyState(newStrategy.getStrategyState());
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize trading strategy');
        setLoading(false);
      }
    };

    initializeStrategy();
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold">Connect Wallet</h1>
          <p className="text-gray-600">Please connect your wallet to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 max-w-7xl mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold">SOL-PERP Trading Dashboard</h1>
        {error && <ErrorDisplay error={error} onRetry={() => setLoading(true)} />}
        {loading ? <LoadingSpinner /> : <div>Strategy State: {JSON.stringify(strategyState)}</div>}
      </div>
    </div>
  );
}

interface TradingDashboardProps {
  className?: string;
}

export function TradingDashboard(props: TradingDashboardProps): JSX.Element {
  const { className = '' } = props;
  return (
    <ErrorBoundary>
      <DashboardContent className={className} />
   