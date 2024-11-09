import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { WalletService } from '../services/WalletService';
import {
  WalletBalance,
  TransactionHistory,
  SegregatedWallet,
  WalletPurpose,
  RiskLevel,
  WalletSecurityConfig
} from '../types/wallet-types';

interface WalletContextState {
  connected: boolean;
  error: string | null;
  balance: WalletBalance | null;
  transactions: TransactionHistory[];
  publicKey: string | null;
  isLoading: boolean;
  segregatedWallets: SegregatedWallet[];
  securityConfig: WalletSecurityConfig | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  fundWallet: (amount: number) => Promise<void>;
  withdrawFunds: (amount: number) => Promise<void>;
  requestAirdrop: () => Promise<void>;
  createSegregatedWallet: (name: string, purpose: WalletPurpose, riskLevel: RiskLevel) => Promise<void>;
  setEmergencyLock: (locked: boolean) => void;
}

const WalletContext = createContext<WalletContextState | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function WalletProvider({ children }: Props) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [segregatedWallets, setSegregatedWallets] = useState<SegregatedWallet[]>([]);
  const [securityConfig, setSecurityConfig] = useState<WalletSecurityConfig | null>(null);
  const [walletService] = useState(() => new WalletService());

  const updateWalletInfo = useCallback(async (walletPublicKey: string) => {
    try {
      const [newBalance, txHistory, wallets, security] = await Promise.all([
        walletService.getBalance(walletPublicKey),
        walletService.getTransactionHistory(walletPublicKey),
        walletService.getSegregatedWallets(),
        walletService.getSecurityConfig()
      ]);

      setBalance(newBalance);
      setTransactions(txHistory);
      setSegregatedWallets(wallets);
      setSecurityConfig(security);
    } catch (error) {
      console.error('Error updating wallet info:', error);
      setError('Failed to update wallet information');
    }
  }, [walletService]);

  useEffect(() => {
    if (connected && publicKey) {
      updateWalletInfo(publicKey);
      // Set up polling for updates every 30 seconds
      const interval = setInterval(() => {
        updateWalletInfo(publicKey);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [connected, publicKey, updateWalletInfo]);

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { solana } = window as any;
      if (!solana?.isPhantom) {
        throw new Error('Phantom wallet not installed');
      }

      const response = await solana.connect();
      const walletPublicKey = response.publicKey.toString();
      
      setConnected(true);
      setPublicKey(walletPublicKey);
      
      await updateWalletInfo(walletPublicKey);
    } catch (error) {
      console.error('Connection error:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsLoading(true);
      const { solana } = window as any;
      if (solana) {
        await solana.disconnect();
        setConnected(false);
        setPublicKey(null);
        setBalance(null);
        setTransactions([]);
        setSegregatedWallets([]);
        setSecurityConfig(null);
      }
    } catch (error) {
      console.error('Disconnection error:', error);
      setError('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const fundWallet = async (amount: number) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await walletService.fundWallet(publicKey, amount);
      await updateWalletInfo(publicKey);
    } catch (error) {
      console.error('Funding error:', error);
      setError('Failed to fund wallet');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (amount: number) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const { solana } = window as any;
      if (!solana) {
        throw new Error('Phantom wallet not found');
      }

      await walletService.withdrawFromWallet(
        new PublicKey(publicKey),
        async (transaction) => {
          const signedTx = await solana.signTransaction(transaction);
          return signedTx;
        },
        amount
      );

      await updateWalletInfo(publicKey);
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError('Failed to withdraw funds');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestAirdrop = async () => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await walletService.requestAirdrop(publicKey);
      await updateWalletInfo(publicKey);
    } catch (error) {
      console.error('Airdrop error:', error);
      setError('Failed to request airdrop');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createSegregatedWallet = async (
    name: string,
    purpose: WalletPurpose,
    riskLevel: RiskLevel
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await walletService.createSegregatedWallet(name, purpose, riskLevel);
      if (publicKey) {
        await updateWalletInfo(publicKey);
      }
    } catch (error) {
      console.error('Error creating segregated wallet:', error);
      setError('Failed to create segregated wallet');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setEmergencyLock = (locked: boolean) => {
    try {
      walletService.setEmergencyLock(locked);
      if (publicKey) {
        updateWalletInfo(publicKey);
      }
    } catch (error) {
      console.error('Error setting emergency lock:', error);
      setError('Failed to set emergency lock');
    }
  };

  const value: WalletContextState = {
    connected,
    error,
    balance,
    transactions,
    publicKey,
    isLoading,
    segregatedWallets,
    securityConfig,
    connect,
    disconnect,
    fundWallet,
    withdrawFunds,
    requestAirdrop,
    createSegregatedWallet,
    setEmergencyLock
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}