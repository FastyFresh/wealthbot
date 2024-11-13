
import { PublicKey } from '@solana/web3.js';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      networkVersion?: string;
      connect: () => Promise<{ publicKey: string }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: any) => Promise<any>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    };
  }
}

export const DEVNET_CONFIG = {
  // Network Configuration
  network: 'devnet' as const,
  endpoint: process.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  
  // Drift Protocol Configuration
  driftProgramId: new PublicKey(
    process.env.VITE_DRIFT_PROGRAM_ID || 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'
  ),
  
  // Trading Configuration
  minDepositUsd: 100, // Minimum deposit in USD
  gasFeeSOL: 0.25, // Gas fee in SOL
  
  // Faucet Configuration
  faucetUrl: 'https://faucet.solana.com/devnet',
  defaultAirdropAmount: 2, // Amount of SOL to request from faucet
  
  // Error Messages
  errors: {
    insufficientBalance: 'Insufficient balance. Please ensure you have enough SOL for the minimum deposit and gas fees.',
    walletNotConnected: 'Please connect your Phantom wallet to continue.',
    networkMismatch: 'Please switch your Phantom wallet to Devnet network.',
    faucetError: 'Failed to request SOL from faucet. Please try again.',
    driftInitError: 'Failed to initialize Drift account. Please try again.',
  },
  
  // Trading Parameters
  tradingParams: {
    defaultLeverage: 2,
    maxLeverage: 5,
    minPositionSize: 0.1,
    maxPositionSize: 1.0,
    stopLossPercent: 5,
    takeProfitPercent: 15,
  },
  
  // Development Settings
  development: {
    logLevel: 'debug',
    enableMocks: false,
    mockPriceData: false,
  }
} as const;

// Helper functions
export const isDriftInitialized = async (publicKey: PublicKey): Promise<boolean> => {
  try {
    // Implementation will check if the user has an initialized Drift account
    return true;
  } catch (error) {
    console.error('Error checking Drift initialization:', error);
    return false;
  }
};

export const requestDevnetSol = async (publicKey: PublicKey): Promise<boolean> => {
  try {
    const response = await fetch(`${DEVNET_CONFIG.faucetUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: publicKey.toString(),
        amount: DEVNET_CONFIG.defaultAirdropAmount,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error requesting devnet SOL:', error);
    return false;
  }
};

export const validateDevnetSetup = async (publicKey: PublicKey): Promise<{
  isValid: boolean;
  errors: string[];
}> => {
  const errors: string[] = [];
  
  // Check network
  const phantomWallet = window.solana;
  if (!phantomWallet || phantomWallet.networkVersion !== 'devnet') {
    errors.push(DEVNET_CONFIG.errors.networkMismatch);
  }
  
  // Check wallet connection
  if (!publicKey) {
    errors.push(DEVNET_CONFIG.errors.walletNotConnected);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default DEVNET_CONFIG;
