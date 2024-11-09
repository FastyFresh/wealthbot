import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import {
  DEV_ENVIRONMENT,
  getConnectionConfig,
  getTransactionConfig,
  getSecurityConfig,
  validateTransactionAmount,
  validateDailyLimit,
  validateMonthlyLimit,
  ERROR_MESSAGES
} from '../config/development';
import {
  SegregatedWallet,
  WalletTransaction,
  WalletBalance,
  TransactionBatch,
  WalletSecurityConfig,
  WalletPurpose,
  RiskLevel,
  TransactionStatus,
  BatchStatus,
  WalletError,
  TransactionQueue,
  MasterWalletConfig,
  RateLimitConfig,
  TransactionType,
  TokenBalance
} from '../types/wallet-types';

export class WalletService {
  private connection: Connection;
  private masterWallet: Keypair;
  private segregatedWallets: Map<string, SegregatedWallet>;
  private transactionQueue: TransactionQueue;
  private securityConfig: WalletSecurityConfig;
  private rateLimitConfig: RateLimitConfig;
  private processorInterval: ReturnType<typeof setInterval> | null = null;
  private dailyTransactionTotal: number = 0;
  private monthlyTransactionTotal: number = 0;
  private lastDailyReset: Date = new Date();
  private lastMonthlyReset: Date = new Date();

  constructor() {
    const { endpoint, config } = getConnectionConfig();
    this.connection = new Connection(endpoint, config);

    this.segregatedWallets = new Map();
    const txConfig = getTransactionConfig();
    this.transactionQueue = {
      pending: [],
      processing: [],
      maxBatchSize: txConfig.batchSize,
      processingInterval: txConfig.processingInterval
    };

    // Initialize master wallet
    try {
      const privateKeyBytes = bs58.decode(DEV_ENVIRONMENT.privateKey);
      this.masterWallet = Keypair.fromSecretKey(privateKeyBytes);
      
      if (this.masterWallet.publicKey.toBase58() !== DEV_ENVIRONMENT.wallet) {
        throw new Error(ERROR_MESSAGES.INVALID_WALLET);
      }

      const secConfig = getSecurityConfig();
      this.securityConfig = {
        multiSigRequired: true,
        requiredSignatures: secConfig.multiSigThreshold,
        allowedSigners: [this.masterWallet.publicKey],
        tradingLimits: {
          maxTransactionAmount: secConfig.maxTransactionAmount,
          dailyLimit: secConfig.dailyLimit,
          monthlyLimit: secConfig.monthlyLimit,
          allowedTokens: []
        },
        emergencyLock: false
      };

      this.rateLimitConfig = secConfig.rateLimiting;

      this.startTransactionProcessor();
      this.startLimitResetScheduler();
    } catch (error) {
      console.error('Error initializing wallet service:', error);
      throw new Error('Failed to initialize wallet service');
    }
  }

  private startLimitResetScheduler(): void {
    // Reset daily limits at midnight
    setInterval(() => {
      const now = new Date();
      if (now.getDate() !== this.lastDailyReset.getDate()) {
        this.dailyTransactionTotal = 0;
        this.lastDailyReset = now;
      }
      if (now.getMonth() !== this.lastMonthlyReset.getMonth()) {
        this.monthlyTransactionTotal = 0;
        this.lastMonthlyReset = now;
      }
    }, 60000); // Check every minute
  }

  private startTransactionProcessor(): void {
    if (this.processorInterval) {
      clearInterval(this.processorInterval);
    }
    
    this.processorInterval = setInterval(async () => {
      try {
        await this.processTransactionQueue();
      } catch (error) {
        console.error('Error in transaction processor:', error);
      }
    }, this.transactionQueue.processingInterval);
  }

  private async processTransactionQueue(): Promise<void> {
    if (this.transactionQueue.pending.length === 0 || this.securityConfig.emergencyLock) {
      return;
    }

    const batch = this.transactionQueue.pending.splice(0, this.transactionQueue.maxBatchSize);
    this.transactionQueue.processing.push(...batch);

    try {
      const { blockhash } = await this.connection.getLatestBlockhash();
      const blockHeight = await this.connection.getBlockHeight();
      
      for (const transaction of batch) {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = this.masterWallet.publicKey;
      }

      const signedTransactions = batch.map(tx => {
        tx.sign(this.masterWallet);
        return tx;
      });

      const signatures = await Promise.all(
        signedTransactions.map(tx =>
          this.connection.sendRawTransaction(tx.serialize())
        )
      );

      await Promise.all(
        signatures.map(signature =>
          this.connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight: blockHeight
          })
        )
      );

      this.transactionQueue.processing = this.transactionQueue.processing.filter(
        tx => !batch.includes(tx)
      );
    } catch (error) {
      console.error('Error processing transaction batch:', error);
      this.transactionQueue.pending.unshift(...batch);
      this.transactionQueue.processing = this.transactionQueue.processing.filter(
        tx => !batch.includes(tx)
      );
    }
  }

  async createSegregatedWallet(
    name: string,
    purpose: WalletPurpose,
    riskLevel: RiskLevel
  ): Promise<SegregatedWallet> {
    if (this.securityConfig.emergencyLock) {
      throw new Error(ERROR_MESSAGES.EMERGENCY_LOCK_ACTIVE);
    }

    const newWallet = Keypair.generate();
    const segregatedWallet: SegregatedWallet = {
      publicKey: newWallet.publicKey,
      name,
      purpose,
      riskLevel,
      tradingEnabled: true
    };

    this.segregatedWallets.set(newWallet.publicKey.toBase58(), segregatedWallet);
    return segregatedWallet;
  }

  async getBalance(publicKey: string): Promise<WalletBalance> {
    try {
      const rawBalance = await this.connection.getBalance(new PublicKey(publicKey));
      const tokens: TokenBalance[] = [];
      
      return {
        total: rawBalance / 1e9,
        available: rawBalance / 1e9,
        locked: 0,
        tokens
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
    }
  }

  async fundWallet(destinationPublicKey: string, amount: number): Promise<string> {
    if (this.securityConfig.emergencyLock) {
      throw new Error(ERROR_MESSAGES.EMERGENCY_LOCK_ACTIVE);
    }

    if (!validateTransactionAmount(amount)) {
      throw new Error(ERROR_MESSAGES.AMOUNT_EXCEEDS_LIMIT);
    }

    if (!validateDailyLimit(this.dailyTransactionTotal, amount)) {
      throw new Error(ERROR_MESSAGES.DAILY_LIMIT_EXCEEDED);
    }

    if (!validateMonthlyLimit(this.monthlyTransactionTotal, amount)) {
      throw new Error(ERROR_MESSAGES.MONTHLY_LIMIT_EXCEEDED);
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.masterWallet.publicKey,
          toPubkey: new PublicKey(destinationPublicKey),
          lamports: Math.floor(amount * 1e9),
        })
      );

      this.transactionQueue.pending.push(transaction);
      this.dailyTransactionTotal += amount;
      this.monthlyTransactionTotal += amount;
      
      return 'Transaction queued';
    } catch (error) {
      console.error('Error funding wallet:', error);
      throw new Error(ERROR_MESSAGES.TRANSACTION_FAILED);
    }
  }

  async withdrawFromWallet(
    fromPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
    amount: number
  ): Promise<string> {
    if (this.securityConfig.emergencyLock) {
      throw new Error(ERROR_MESSAGES.EMERGENCY_LOCK_ACTIVE);
    }

    if (!validateTransactionAmount(amount)) {
      throw new Error(ERROR_MESSAGES.AMOUNT_EXCEEDS_LIMIT);
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: this.masterWallet.publicKey,
          lamports: Math.floor(amount * 1e9),
        })
      );

      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPublicKey;

      const signedTransaction = await signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight: await this.connection.getBlockHeight()
      });

      return signature;
    } catch (error) {
      console.error('Error withdrawing from wallet:', error);
      throw new Error(ERROR_MESSAGES.TRANSACTION_FAILED);
    }
  }

  async getTransactionHistory(publicKey: string): Promise<WalletTransaction[]> {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey(publicKey),
        { limit: 10 }
      );

      return Promise.all(
        signatures.map(async (sig) => {
          const tx = await this.connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          });

          let amount = 0;
          if (tx?.meta?.postBalances && tx?.meta?.preBalances) {
            const accountKeys = tx.transaction.message.staticAccountKeys;
            const index = accountKeys.findIndex(
              (key: PublicKey) => key.equals(new PublicKey(publicKey))
            );
            
            if (index !== -1) {
              amount = Math.abs(
                (tx.meta.postBalances[index] - tx.meta.preBalances[index]) / 1e9
              );
            }
          }

          return {
            signature: sig.signature,
            timestamp: sig.blockTime || 0,
            type: TransactionType.TRANSFER,
            amount,
            status: sig.confirmationStatus as TransactionStatus || TransactionStatus.PENDING,
            walletId: publicKey
          };
        })
      );
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  async requestAirdrop(publicKey: string, amount: number = 1): Promise<string> {
    try {
      const signature = await this.connection.requestAirdrop(
        new PublicKey(publicKey),
        Math.floor(amount * 1e9)
      );

      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
      
      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      return signature;
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      throw new Error(ERROR_MESSAGES.TRANSACTION_FAILED);
    }
  }

  getDevnetWalletPublicKey(): string {
    return this.masterWallet.publicKey.toBase58();
  }

  setEmergencyLock(locked: boolean): void {
    this.securityConfig.emergencyLock = locked;
  }

  getSegregatedWallets(): SegregatedWallet[] {
    return Array.from(this.segregatedWallets.values());
  }

  getSecurityConfig(): WalletSecurityConfig {
    return { ...this.securityConfig };
  }
}