import { PublicKey } from '@solana/web3.js';

export const DEV_ENVIRONMENT = {
  wallet: 'EMVgeBTMS6zyghXyPZcWWGNT64iCTakBjkpoq7zRhw2x',
  network: 'devnet',
  privateKey: '4myF6qQup27Ha3RF7ShUUbtuzxJaGRvUFHnGNraFhoyPkQ1Ck4uq8VyJNhqENinZZqFY4gWK89TUQQSAmJaEkjMJ',
  endpoints: {
    devnet: 'https://api.devnet.solana.com',
    websocket: 'wss://api.devnet.solana.com/'
  },
  connection: {
    commitment: 'confirmed' as const,
    confirmTransactionInitialTimeout: 60000
  },
  transaction: {
    maxRetries: 3,
    minContextSlot: 0,
    batchSize: 5,
    processingInterval: 1000
  },
  security: {
    multiSigThreshold: 2,
    maxTransactionAmount: 100,
    dailyLimit: 1000,
    monthlyLimit: 10000,
    rateLimiting: {
      maxRequests: 100,
      windowMs: 60000,
      blacklistThreshold: 150
    }
  },
  testing: {
    mockBalance: 1000000000, // 1 SOL in lamports
    mockSignature: 'mock-signature',
    mockBlockhash: 'mock-blockhash',
    mockBlockHeight: 1000
  }
} as const;

export const getDevnetWalletPublicKey = (): PublicKey => {
  return new PublicKey(DEV_ENVIRONMENT.wallet);
};

export const isDevnet = (endpoint: string): boolean => {
  return endpoint === DEV_ENVIRONMENT.endpoints.devnet;
};

export const getConnectionConfig = () => {
  return {
    endpoint: DEV_ENVIRONMENT.endpoints.devnet,
    config: DEV_ENVIRONMENT.connection
  };
};

export const getTransactionConfig = () => {
  return DEV_ENVIRONMENT.transaction;
};

export const getSecurityConfig = () => {
  return DEV_ENVIRONMENT.security;
};

export const getRateLimitConfig = () => {
  return DEV_ENVIRONMENT.security.rateLimiting;
};

export const getTestConfig = () => {
  return DEV_ENVIRONMENT.testing;
};

// Validation utilities
export const validateTransactionAmount = (amount: number): boolean => {
  return amount <= DEV_ENVIRONMENT.security.maxTransactionAmount;
};

export const validateDailyLimit = (currentTotal: number, newAmount: number): boolean => {
  return (currentTotal + newAmount) <= DEV_ENVIRONMENT.security.dailyLimit;
};

export const validateMonthlyLimit = (currentTotal: number, newAmount: number): boolean => {
  return (currentTotal + newAmount) <= DEV_ENVIRONMENT.security.monthlyLimit;
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_FOUND: 'Wallet not found or not initialized',
  TRANSACTION_FAILED: 'Transaction failed to complete',
  AMOUNT_EXCEEDS_LIMIT: 'Transaction amount exceeds allowed limit',
  DAILY_LIMIT_EXCEEDED: 'Daily transaction limit exceeded',
  MONTHLY_LIMIT_EXCEEDED: 'Monthly transaction limit exceeded',
  EMERGENCY_LOCK_ACTIVE: 'Emergency lock is active',
  INSUFFICIENT_SIGNATURES: 'Insufficient signatures for multi-sig transaction',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  INVALID_WALLET: 'Invalid wallet address',
  NETWORK_ERROR: 'Network connection error',
  UNAUTHORIZED: 'Unauthorized operation',
  INVALID_AMOUNT: 'Invalid transaction amount'
} as const;