import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { 
  DriftClient, 
  DriftEnv,
  PerpMarketConfig,
  PositionDirection,
  OrderParams,
  BN,
  PerpMarket,
  MarketType,
  OrderType,
  OrderTriggerCondition,
  OrderStatus,
  IWallet
} from '@drift-labs/sdk';

export interface DriftConfig {
  marketId: 'SOL-PERP';
  network: 'devnet';
  leverage: {
    max: 20;
    default: 2;
  };
  riskParameters: {
    maxDrawdown: 8.50;
    targetReturn: 50.05;
  };
}

export interface MarketInfo {
  baseAssetSymbol: string;
  marketIndex: number;
  price: number;
  fundingRate: number;
}

class DriftWallet implements IWallet {
  constructor(public readonly publicKey: PublicKey) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    throw new Error('Signing not implemented in test environment');
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    throw new Error('Signing not implemented in test environment');
  }
}

export class DriftService {
  private client: DriftClient | null = null;
  private config: DriftConfig = {
    marketId: 'SOL-PERP',
    network: 'devnet',
    leverage: {
      max: 20,
      default: 2
    },
    riskParameters: {
      maxDrawdown: 8.50,
      targetReturn: 50.05
    }
  };

  constructor(private connection: Connection) {}

  async initialize(userPublicKey: PublicKey): Promise<void> {
    try {
      this.client = new DriftClient({
        connection: this.connection,
        wallet: new DriftWallet(userPublicKey),
        env: 'devnet'
      });

      await this.client.subscribe();
      console.log('DriftService initialized successfully');
    } catch (error) {
      console.error('Error initializing DriftService:', error);
      throw error;
    }
  }

  async getMarkets(): Promise<MarketInfo[]> {
    if (!this.client) throw new Error('DriftService not initialized');

    try {
      const markets = await this.client.getPerpMarkets();
      return markets.map(market => ({
        baseAssetSymbol: market.name,
        marketIndex: market.marketIndex,
        price: market.price.toNumber(),
        fundingRate: market.currentFundingRate.toNumber()
      }));
    } catch (error) {
      console.error('Error getting markets:', error);
      throw error;
    }
  }

  async getMarketPrice(): Promise<number> {
    if (!this.client) throw new Error('DriftService not initialized');

    try {
      const markets = await this.client.getPerpMarkets();
      const solMarket = markets.find(market => market.name === 'SOL-PERP');
      if (!solMarket) throw new Error('SOL market not found');

      return solMarket.price.toNumber();
    } catch (error) {
      console.error('Error getting market price:', error);
      throw error;
    }
  }

  async getFundingRate(): Promise<number> {
    if (!this.client) throw new Error('DriftService not initialized');

    try {
      const markets = await this.client.getPerpMarkets();
      const solMarket = markets.find(market => market.name === 'SOL-PERP');
      if (!solMarket) throw new Error('SOL market not found');

      return solMarket.currentFundingRate.toNumber();
    } catch (error) {
      console.error('Error getting funding rate:', error);
      throw error;
    }
  }

  async openPosition(
    size: number,
    leverage: number,
    direction: PositionDirection
  ): Promise<string> {
    if (!this.client) throw new Error('DriftService not initialized');

    try {
      const markets = await this.client.getPerpMarkets();
      const solMarket = markets.find(market => market.name === 'SOL-PERP');
      if (!solMarket) throw new Error('SOL market not found');

      const orderParams: OrderParams = {
        marketIndex: solMarket.marketIndex,
        marketType: MarketType.PERP,
        baseAssetAmount: new BN(size * 1e9), // Convert to base precision
        direction: direction === 'long' ? { long: {} } : { short: {} },
        orderType: OrderType.MARKET,
        userOrderId: 0,
        price: new BN(0),
        postOnly: false,
        reduceOnly: false,
        triggerPrice: new BN(0),
        triggerCondition: OrderTriggerCondition.ABOVE,
        oraclePriceOffset: 0,
        auctionDuration: 0,
        auctionStartPrice: 0,
        auctionEndPrice: 0
      };

      const tx = await this.client.placeOrder(orderParams);
      return tx;
    } catch (error) {
      console.error('Error opening position:', error);
      throw error;
    }
  }

  async closePosition(marketIndex: number): Promise<string> {
    if (!this.client) throw new Error('DriftService not initialized');

    try {
      const position = await this.getPositionMetrics(marketIndex);
      if (!position) throw new Error('No position found');

      const orderParams: OrderParams = {
        marketIndex,
        marketType: MarketType.PERP,
        baseAssetAmount: new BN(position.size * 1e9),
        direction: position.direction === 'long' ? { short: {} } : { long: {} },
        orderType: OrderType.MARKET,
        userOrderId: 0,
        price: new BN(0),
        postOnly: false,
        reduceOnly: true,
        triggerPrice: new BN(0),
        triggerCondition: OrderTriggerCondition.ABOVE,
        oraclePriceOffset: 0,
        auctionDuration: 0,
        auctionStartPrice: 0,
        auctionEndPrice: 0
      };

      const tx = await this.client.placeOrder(orderParams);
      return tx;
    } catch (error) {
      console.error('Error closing position:', error);
      throw error;
    }
  }

  async getPositionMetrics(marketIndex: number): Promise<{
    size: number;
    leverage: number;
    direction: PositionDirection;
    pnl: number;
    liquidationPrice: number;
  } | null> {
    if (!this.client) throw new Error('DriftService not initialized');

    try {
      const positions = await this.client.getPositions();
      const position = positions.find(p => p.marketIndex === marketIndex);
      if (!position || position.baseAssetAmount.isZero()) return null;

      const markets = await this.client.getPerpMarkets();
      const market = markets.find(m => m.marketIndex === marketIndex);
      if (!market) throw new Error('Market not found');

      const currentPrice = market.price.toNumber();
      const collateral = await this.client.getUser().getCollateralValue();

      return {
        size: position.baseAssetAmount.toNumber() / 1e9,
        leverage: position.leverage.toNumber(),
        direction: position.baseAssetAmount.gt(new BN(0)) ? 'long' : 'short',
        pnl: position.unrealizedPnl.toNumber() / 1e6,
        liquidationPrice: position.liquidationPrice.toNumber()
      };
    } catch (error) {
      console.error('Error getting position metrics:', error);
      throw error;
    }
  }

  async adjustLeverage(marketIndex: number, newLeverage: number): Promise<string> {
    if (!this.client) throw new Error('DriftService not initialized');

    try {
      const position = await this.getPositionMetrics(marketIndex);
      if (!position) throw new Error('No position found');

      const markets = await this.client.getPerpMarkets();
      const market = markets.find(m => m.marketIndex === marketIndex);
      if (!market) throw new Error('Market not found');

      // Calculate new position size based on new leverage
      const currentPrice = market.price.toNumber();
      const collateral = await this.client.getUser().getCollateralValue();
      const newSize = (collateral.toNumber() * newLeverage) / currentPrice;

      const orderParams: OrderParams = {
        marketIndex,
        marketType: MarketType.PERP,
        baseAssetAmount: new BN(newSize * 1e9),
        direction: position.direction === 'long' ? { long: {} } : { short: {} },
        orderType: OrderType.MARKET,
        userOrderId: 0,
        price: new BN(0),
        postOnly: false,
        reduceOnly: false,
        triggerPrice: new BN(0),
        triggerCondition: OrderTriggerCondition.ABOVE,
        oraclePriceOffset: 0,
        auctionDuration: 0,
        auctionStartPrice: 0,
        auctionEndPrice: 0
      };

      const tx = await this.client.placeOrder(orderParams);
      return tx;
    } catch (error) {
      console.error('Error adjusting leverage:', error);
      throw error;
    }
  }

  getConfig(): DriftConfig {
    return this.config;
  }
}
