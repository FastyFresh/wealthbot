import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { testConnections, ConnectionStatus, formatConnectionStatus } from '../../utils/connectionTest';

const ConnectionTest: React.FC = () => {
  const { publicKey } = useWallet();
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const connectionStatus = await testConnections(publicKey || undefined);
      setStatus(connectionStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while testing connections');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Connection Test</h2>
      
      <button
        onClick={handleTest}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md ${
          isLoading 
            ? 'bg-slate-600 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-medium transition-colors`}
      >
        {isLoading ? 'Testing...' : 'Test Connections'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {status && (
        <div className="mt-4 space-y-4">
          {/* Solana Connection Status */}
          <div className="p-3 bg-slate-700 rounded-md">
            <h3 className="text-lg font-semibold text-white mb-2">
              📡 Solana RPC Connection
            </h3>
            <div className="space-y-1">
              <p className="text-white">
                Status:{' '}
                <span
                  className={`font-medium ${
                    status.solana.connected ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {status.solana.connected ? '✅ Connected' : '❌ Disconnected'}
                </span>
              </p>
              {status.solana.latency && (
                <p className="text-slate-300">
                  Latency: {status.solana.latency}ms
                </p>
              )}
              {status.solana.error && (
                <p className="text-red-400">Error: {status.solana.error}</p>
              )}
            </div>
          </div>

          {/* Drift Protocol Status */}
          <div className="p-3 bg-slate-700 rounded-md">
            <h3 className="text-lg font-semibold text-white mb-2">
              🔄 Drift Protocol
            </h3>
            <div className="space-y-1">
              <p className="text-white">
                Status:{' '}
                <span
                  className={`font-medium ${
                    status.drift.connected ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {status.drift.connected ? '✅ Connected' : '❌ Disconnected'}
                </span>
              </p>
              {status.drift.markets !== undefined && (
                <p className="text-slate-300">
                  Available Markets: {status.drift.markets}
                </p>
              )}
              {status.drift.error && (
                <p className="text-red-400">Error: {status.drift.error}</p>
              )}
            </div>
          </div>

          {/* Connection Requirements */}
          <div className="p-3 bg-slate-700/50 rounded-md">
            <h3 className="text-lg font-semibold text-white mb-2">
              Requirements
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                Phantom Wallet:{' '}
                <span
                  className={`font-medium ${
                    publicKey ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {publicKey ? '✅ Connected' : '⚠️ Not Connected'}
                </span>
              </li>
              <li>
                Devnet Network:{' '}
                <span
                  className={`font-medium ${
                    status.solana.connected ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {status.solana.connected
                    ? '✅ Available'
                    : '⚠️ Not Available'}
                </span>
              </li>
              <li>
                Drift Protocol:{' '}
                <span
                  className={`font-medium ${
                    status.drift.connected ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {status.drift.connected ? '✅ Ready' : '⚠️ Not Ready'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;