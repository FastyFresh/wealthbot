
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from './WalletProvider';
import { DriftService, DriftPosition, DriftOrder } from '../services/DriftService';

interface DriftContextType {
  driftService: DriftService | null;
  positions: DriftPosition[];
  accountValue: number;
  marginRatio: number;
  unrealizedPnl: number;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  placeOrder: (order: DriftOrder) => Promise<void>;
  closePosition: (market: string) => Promise<void>;
  emergencyClose: () => Promise<void>;
  refresh: () => Promise<void>;
}

const DriftContext = createContext<DriftContextType>({
  driftService: null,
  positions: [],
  accountValue: 0,
  marginRatio: 0,
  unrealizedPnl: 0,
  isInitialized: false,
  isLoading: false,
  error: null,
  placeOrder: async () => {},
  closePosition: async () => {},
  emergencyClose: async () => {},
  refresh: async () => {},
});

export const useDrift = () => useContext(DriftContext);

interface DriftProviderProps {
  children: React.ReactNode;
}

export const DriftProvider: React.FC<DriftProviderProps> = ({ children }) => {
  const { connected, publicKey } = useWallet();
  const [driftService, setDriftService] = useState<DriftService | null>(null);
  const [positions, setPositions] = useState<DriftPosition[]>([]);
  const [accountValue, setAccountValue] = useState(0);
  const [marginRatio, setMarginRatio] = useState(0);
  const [unrealizedPnl, setUnrealizedPnl] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Drift service when wallet is connected
  useEffect(() => {
    if (!connected || !publicKey) {
      setDriftService(null);
      setIsInitialized(false);
      return;
    }

    const initializeDrift = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const service = new DriftService(publicKey.toString());
        await service.initialize();
        
        setDriftService(service);
        setIsInitialized(true);
        await refreshData(service);
      } catch (err) {
        console.error('Failed to initialize Drift service:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Drift service');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDrift();

    // Cleanup
    return () => {
      if (driftService) {
        driftService.cleanup().catch(console.error);
      }
    };
  }, [connected, publicKey]);

  // Refresh data periodically
  useEffect(() => {
    if (!isInitialized || !driftService) return;

    const interval = setInterval(() => {
      refreshData(driftService).catch(console.error);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [isInitialized, driftService]);

  const refreshData = async (service: DriftService) => {
    try {
      const [
        newPositions,
        newAccountValue,
        newMarginRatio,
        newUnrealizedPnl
      ] = await Promise.all([
        service.getPositions(),
        service.getAccountValue(),
        service.getMarginRatio(),
        service.getUnrealizedPnl()
      ]);

      setPositions(newPositions);
      setAccountValue(newAccountValue);
      setMarginRatio(newMarginRatio);
      setUnrealizedPnl(newUnrealizedPnl);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    }
  };

  const placeOrder = async (order: DriftOrder) => {
    if (!driftService) throw new Error('Drift service not initialized');

    try {
      setIsLoading(true);
      setError(null);
      await driftService.placeOrder(order);
      await refreshData(driftService);
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const closePosition = async (market: string) => {
    if (!driftService) throw new Error('Drift service not initialized');

    try {
      setIsLoading(true);
      setError(null);
      await driftService.closePosition(market);
      await refreshData(driftService);
    } catch (err) {
      console.error('Failed to close position:', err);
      setError(err instanceof Error ? err.message : 'Failed to close position');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const emergencyClose = async () => {
    if (!driftService) throw new Error('Drift service not initialized');

    try {
      setIsLoading(true);
      setError(null);
      await driftService.emergencyClose();
      await refreshData(driftService);
    } catch (err) {
      console.error('Failed emergency close:', err);
      setError(err instanceof Error ? err.message : 'Failed emergency close');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    if (!driftService) throw new Error('Drift service not initialized');
    await refreshData(driftService);
  };

  return (
    <DriftContext.Provider
      value={{
        driftService,
        positions,
        accountValue,
        marginRatio,
        unrealizedPnl,
        isInitialized,
        isLoading,
        error,
        placeOrder,
        closePosition,
        emergencyClose,
        refresh,
      }}
    >
      {children}
    </DriftContext.Provider>
  );
};
