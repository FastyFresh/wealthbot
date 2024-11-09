
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
import {
  DriftClient,
  User,
  PerpMarketConfig,
  getMarketOrderParams,
  DRIFT_PROGRAM_ID,
  BN,
  PositionDirection,
  OrderType,
  MarketType,
  BulkAccountLoader,
  PerpPosition,
} from '@drift-labs/sdk';

export interface DriftPosition {
  market: string;
  size: number;
  direction: 'long' | 'short';
  leverage: number;
  entryPrice: number;
  liquidationPrice: number;
  unrealizedPnl: number;
}

export interface DriftOrder {
  market: string;
  size: number;
  price: number;
  type: 'market' | 'limit' | 'stop';
  direction: 'long' | 'short';
  leverage: number;
}

export class DriftService {
  private connection: Connection;
  private provider: AnchorProvider;
  private driftClient: DriftClient | null = null;
  private user: User | null = null;
  private accountLoader: BulkAccountLoader;

  constructor(
    walletPublicKey: string,
    endpoint: string = 'https://api.devnet.solana.com'
  ) {
    this.connection = new Connection(endpoint, 'confirmed');
    this.accountLoader = new BulkAccountLoader(this.connection, 'confirmed', 1000);
    this.provider = new AnchorProvider(
      this.connection,
      {
        publicKey: new PublicKey(walletPublicKey),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
      },
      { commitment: 'confirmed' }
    );
  }

  async initialize(): Promise<void> {
    try {
      this.driftClient = new DriftClient({
        connection: this.connection,
        wallet: this.provider.wallet,
        programID: DRIFT_PROGRAM_ID,
        accountSubscription: {
          type: 'polling',
          accountLoader: this.accountLoader,
        },
      });

      await this.driftClient.subscribe();
      
      this.user = new User({
        driftClient: this.driftClient,
        userAccountPublicKey: this.provider.wallet.publicKey,
        accountSubscription: {
          type: 'polling',
          accountLoader: this.accountLoader,
        },
      });

      const exists = await this.user.exists();
      if (!exists) {
        throw new Error('User account does not exist');
      }

      console.log('Drift Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Drift Service:', error);
      throw error;
    }
  }

  async getPositions(): Promise<DriftPosition[]> {
    if (!this.user) throw new Error('User not initialized');

    try {
      const positions = await this.user.getActivePerpPositions();
      return positions.map((position: PerpPosition) => ({
        market: position.marketIndex.toString(),
        size: position.baseAssetAmount.toNumber(),
        direction: position.baseAssetAmount.gt(new BN(0)) ? 'long' : 'short',
        leverage: position.leverage.toNumber(),
        entryPrice: position.entryPrice.toNumber(),
        liquidationPrice: position.liquidationPrice.toNumber(),
        unrealizedPnl: position.unrealizedPnl.toNumber()
      }));
    } catch (error) {
      console.error('Failed to get positions:', error);
      throw error;
    }
  }

  async placeOrder(order: DriftOrder): Promise<string> {
    if (!this.driftClient || !this.user) throw new Error('Client not initialized');

    try {
      const marketIndex = parseInt(order.market);
      const marketAccount = await this.driftClient.getPerpMarketAccount(marketIndex);
      if (!marketAccount) throw new Error('Invalid market');

      const params = getMarketOrderParams({
        marketIndex,
        direction: order.direction === 'long' ? PositionDirection.LONG : PositionDirection.SHORT,
        baseAssetAmount: new BN(order.size),
        price: new BN(order.price),
      });

      const tx = await this.driftClient.placePerpOrder(params);
      return tx;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  }

  async closePosition(market: string): Promise<string> {
    if (!this.driftClient || !this.user) throw new Error('Client not initialized');

    try {
      const marketIndex = parseInt(market);
      const marketAccount = await this.driftClient.getPerpMarketAccount(marketIndex);
      if (!marketAccount) throw new Error('Invalid market');

      const positions = await this.user.getActivePerpPositions();
      const position = positions.find(p => p.marketIndex === marketIndex);
      if (!position) throw new Error('Position not found');

      const params = getMarketOrderParams({
        marketIndex,
        direction: position.baseAssetAmount.gt(new BN(0)) ? PositionDirection.SHORT : PositionDirection.LONG,
        baseAssetAmount: position.baseAssetAmount.abs(),
        reduceOnly: true,
      });

      const tx = await this.driftClient.placePerpOrder(params);
      return tx;
    } catch (error) {
      console.error('Failed to close position:', error);
      throw error;
    }
  }

  async getAccountValue(): Promise<number> {
    if (!this.user) throw new Error('User not initialized');

    try {
      const account = await this.user.getUserAccount();
      return account.collateral.toNumber();
    } catch (error) {
      console.error('Failed to get account value:', error);
      throw error;
    }
  }

  async getMarginRatio(): Promise<number> {
    if (!this.user) throw new Error('User not initialized');

    try {
      const marginRatio = await this.user.getMarginRatio();
      return marginRatio.toNumber();
    } catch (error) {
      console.error('Failed to get margin ratio:', error);
      throw error;
    }
  }

  async getLeverage(): Promise<number> {
    if (!this.user) throw new Error('User not initialized');

    try {
      const positions = await this.getPositions();
      if (positions.length === 0) return 0;

      const totalLeverage = positions.reduce((sum, pos) => sum + pos.leverage, 0);
      return totalLeverage / positions.length;
    } catch (error) {
      console.error('Failed to get leverage:', error);
      throw error;
    }
  }

  async getUnrealizedPnl(): Promise<number> {
    if (!this.user) throw new Error('User not initialized');

    try {
      const positions = await this.getPositions();
      return positions.reduce((total, pos) => total + pos.unrealizedPnl, 0);
    } catch (error) {
      console.error('Failed to get unrealized PnL:', error);
      throw error;
    }
  }

  async emergencyClose(): Promise<void> {
    if (!this.driftClient || !this.user) throw new Error('Client not initialized');

    try {
      const positions = await this.getPositions();
      for (const position of positions) {
        await this.closePosition(position.market);
      }
    } catch (error) {
      console.error('Failed emergency close:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.driftClient) {
        await this.driftClient.unsubscribe();
      }
      this.driftClient = null;
      this.user = null;
    } catch (error) {
      console.error('Failed to cleanup Drift Service:', error);
      throw error;
    }
  }
}
