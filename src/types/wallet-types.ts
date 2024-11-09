import { PublicKey, Transaction, TransactionSignature } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface SegregatedWallet {
  publicKey: PublicKey;
  name: string;
  purpose: WalletPurpose;
  riskLevel: RiskLevel;
  tradingEnabled: boolean;
}

export interface WalletTransaction {
  signature: TransactionSignature;
  timestamp: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  walletId: string;
}

export interface WalletBalance {
  total: number;
  available: number;
  locked: number;
  tokens: TokenBalance[];
}

export interface TokenBalance {
  token: string;
  amount: number;
  usdValue: number;
}

export interface TransactionBatch {
  id: string;
  transactions: Transaction[];
  status: BatchStatus;
  timestamp: number;
  walletId: string;
}

export interface WalletSecurityConfig {
  multiSigRequired: boolean;
  requiredSignatures: number;
  allowedSigners: PublicKey[];
  tradingLimits: TradingLimits;
  emergencyLock: boolean;
}

export interface TradingLimits {
  maxTransactionAmount: number;
  dailyLimit: number;
  monthlyLimit: number;
  allowedTokens: PublicKey[];
}

export enum WalletPurpose {
  TRADING = 'TRADING',
  HOLDING = 'HOLDING',
  STAKING = 'STAKING',
  OPERATIONS = 'OPERATIONS'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRADE = 'TRADE',
  TRANSFER = 'TRANSFER',
  STAKE = 'STAKE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum BatchStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface WalletError {
  code: string;
  message: string;
  details?: any;
}

export interface WalletEvent {
  type: WalletEventType;
  timestamp: number;
  data: any;
  walletId: string;
}

export enum WalletEventType {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  TRANSACTION_STARTED = 'TRANSACTION_STARTED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  BALANCE_CHANGED = 'BALANCE_CHANGED',
  SECURITY_ALERT = 'SECURITY_ALERT'
}

export interface TransactionQueue {
  pending: Transaction[];
  processing: Transaction[];
  maxBatchSize: number;
  processingInterval: number;
}

export interface WalletStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageTransactionTime: number;
  lastActivity: number;
}

export interface MasterWalletConfig {
  publicKey: PublicKey;
  allowedOperations: WalletOperation[];
  securityConfig: WalletSecurityConfig;
  childWallets: SegregatedWallet[];
}

export enum WalletOperation {
  CREATE_WALLET = 'CREATE_WALLET',
  DELETE_WALLET = 'DELETE_WALLET',
  MODIFY_SECURITY = 'MODIFY_SECURITY',
  EMERGENCY_SHUTDOWN = 'EMERGENCY_SHUTDOWN',
  APPROVE_TRANSACTION = 'APPROVE_TRANSACTION'
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blacklistThreshold: number;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  total: number;
  windowMs: number;
  blacklisted: boolean;
}