import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TradingService, TradeOrder, TradeResult } from '../services/TradingService';
import { useWallet } from './WalletProvider';
import { WalletService } from '../services/WalletService';

interface TradingContextState {
  isLoading: boolean;
  error: string | null;
  marketData: {
    price: number;
    change24h: number;
    volume24h: number;
    high24h: number;
    low24h: number;
  };
  tradeStats: {
    totalTrades: number;
    successfulTrades: number;
    failedTrades: number;
    totalVolume: number;
    profitLoss: number;
  };
  openOrders: TradeResult[];
  orderHistory: TradeResult[];
  submitOrder: (order: Omit<TradeOrder, 'walletId'>) => Promise<TradeResult>;
  cancelOrder: (orderId: string) => Promise<boolean>;
}

const TradingContext = createContext<TradingContextState | null>(null);

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within TradingProvider');
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function TradingProvider({ children }: Props) {
  const { publicKey, isLoading: walletLoading } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tradingService] = useState(() => new TradingService(new WalletService()));
  
  const [marketData, setMarketData] = useState({
    price: 0,
    change24h: 0,
    volume24h: 0,
    high24h: 0,
    low24h: 0
  });

  const [tradeStats, setTradeStats] = useState({
    totalTrades: 0,
    successfulTrades: 0,
    failedTrades: 0,
    totalVolume: 0,
    profitLoss: 0
  });

  const [openOrders, setOpenOrders] = useState<TradeResult[]>([]);
  const [orderHistory, setOrderHistory] = useState<TradeResult[]>([]);

  const updateMarketData = useCallback(async () => {
    try {
      const data = await tradingService.getMarketData();
      setMarketData(data);
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  }, [tradingService]);

  const updateTradeStats = useCallback(async () => {
    if (!publicKey) return;

    try {
      const stats = await tradingService.getTradeStats(publicKey);
      setTradeStats(stats);
    } catch (error) {
      console.error('Error updating trade stats:', error);
    }
  }, [tradingService, publicKey]);

  const updateOrders = useCallback(async () => {
    if (!publicKey) return;

    try {
      const [open, history] = await Promise.all([
        tradingService.getOpenOrders(publicKey),
        tradingService.getOrderHistory(publicKey)
      ]);
      setOpenOrders(open);
      setOrderHistory(history);
    } catch (error) {
      console.error('Error updating orders:', error);
    }
  }, [tradingService, publicKey]);

  useEffect(() => {
    if (!publicKey) return;

    // Initial update
    updateMarketData();
    updateTradeStats();
    updateOrders();

    // Set up intervals for updates
    const marketInterval = setInterval(updateMarketData, 5000);
    const statsInterval = setInterval(updateTradeStats, 30000);
    const ordersInterval = setInterval(updateOrders, 15000);

    return () => {
      clearInterval(marketInterval);
      clearInterval(statsInterval);
      clearInterval(ordersInterval);
    };
  }, [publicKey, updateMarketData, updateTradeStats, updateOrders]);

  const submitOrder = async (order: Omit<TradeOrder, 'walletId'>): Promise<TradeResult> => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await tradingService.submitOrder({
        ...order,
        walletId: publicKey
      });

      // Update orders and stats after successful submission
      await Promise.all([
        updateOrders(),
        updateTradeStats()
      ]);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit order';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await tradingService.cancelOrder(orderId);
      if (result) {
        await updateOrders();
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: TradingContextState = {
    isLoading: isLoading || walletLoading,
    error,
    marketData,
    tradeStats,
    openOrders,
    orderHistory,
    submitOrder,
    cancelOrder
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}