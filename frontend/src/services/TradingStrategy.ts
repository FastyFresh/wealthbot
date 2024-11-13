import { BN } from '@drift-labs/sdk';
import { DriftService } from './DriftService';

export type PositionDirection = 'long' | 'short';

export interface TradingStrategy {
  asset: 'SOL-PERP';
  indicators: {
    funding: boolean;    // Monitor funding rates
    momentum: boolean;   // Price momentum
    volatility: boolean; // Risk management
  };
  position: {
    size: number;       // Based on account size
    leverage: number;   // Dynamic 1x-20x
    direction: PositionDirection;
  };
}

export interface StrategyParameters {
  minPositionSize: number;
  maxPositionSize: number;
  defaultLeverage: number;
  maxLeverage: number;
  fundingRateThreshold: number;
  volatilityThreshold: number;
  momentumPeriod: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
}

export class SOLPerpetualStrategy implements TradingStrategy {
  public asset: 'SOL-PERP' = 'SOL-PERP';
  public indicators = {
    funding: true,
    momentum: true,
    volatility: true
  };
  public position = {
    size: 0,
    leverage: 2,
    direction: 'long' as PositionDirection
  };

  private priceHistory: number[] = [];
  private fundingRateHistory: number[] = [];
  private lastUpdate: number = 0;
  private readonly updateInterval = 60000; // 1 minute

  constructor(
    private driftService: DriftService,
    private params: StrategyParameters = {
      minPositionSize: 0.1,
      maxPositionSize: 10,
      defaultLeverage: 2,
      maxLeverage: 20,
      fundingRateThreshold: 0.01, // 1% funding rate threshold
      volatilityThreshold: 0.02,  // 2% volatility threshold
      momentumPeriod: 12,         // 12 data points for momentum
      stopLossPercentage: 5,      // 5% stop loss
      takeProfitPercentage: 15    // 15% take profit
    }
  ) {}

  async initialize(): Promise<void> {
    await this.updateMarketData();
  }

  private async updateMarketData(): Promise<void> {
    const currentTime = Date.now();
    if (currentTime - this.lastUpdate < this.updateInterval) {
      return;
    }

    try {
      const [price, fundingRate] = await Promise.all([
        this.driftService.getMarketPrice(),
        this.driftService.getFundingRate()
      ]);

      this.priceHistory.push(price);
      this.fundingRateHistory.push(fundingRate);

      // Keep last 24 hours of data (assuming 1-minute intervals)
      if (this.priceHistory.length > 1440) {
        this.priceHistory.shift();
        this.fundingRateHistory.shift();
      }

      this.lastUpdate = currentTime;
    } catch (error) {
      console.error('Error updating market data:', error);
      throw error;
    }
  }

  private calculateVolatility(): number {
    if (this.priceHistory.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < this.priceHistory.length; i++) {
      const returnValue = (this.priceHistory[i] - this.priceHistory[i - 1]) / this.priceHistory[i - 1];
      returns.push(returnValue);
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private calculateMomentum(): number {
    if (this.priceHistory.length < this.params.momentumPeriod) return 0;

    const recentPrices = this.priceHistory.slice(-this.params.momentumPeriod);
    const oldPrice = recentPrices[0];
    const currentPrice = recentPrices[recentPrices.length - 1];
    return (currentPrice - oldPrice) / oldPrice;
  }

  private getAverageFundingRate(): number {
    if (this.fundingRateHistory.length === 0) return 0;
    return this.fundingRateHistory.reduce((a, b) => a + b, 0) / this.fundingRateHistory.length;
  }

  async evaluatePosition(): Promise<void> {
    await this.updateMarketData();

    const volatility = this.calculateVolatility();
    const momentum = this.calculateMomentum();
    const avgFundingRate = this.getAverageFundingRate();

    // Determine position direction
    const newDirection: PositionDirection = 
      momentum > 0 && avgFundingRate < this.params.fundingRateThreshold
        ? 'long'
        : 'short';
    this.position.direction = newDirection;

    // Adjust position size based on volatility
    const volatilityAdjustment = Math.max(0, 1 - volatility / this.params.volatilityThreshold);
    const baseSize = (this.params.maxPositionSize - this.params.minPositionSize) / 2;
    this.position.size = this.params.minPositionSize + (baseSize * volatilityAdjustment);

    // Adjust leverage based on volatility and momentum
    const momentumStrength = Math.abs(momentum);
    const leverageAdjustment = Math.min(
      this.params.maxLeverage,
      this.params.defaultLeverage + (momentumStrength * 10)
    );
    this.position.leverage = Math.max(1, Math.min(leverageAdjustment, this.params.maxLeverage));
  }

  async executeStrategy(): Promise<string> {
    await this.evaluatePosition();

    try {
      // Close existing position if direction changes
      const currentPosition = await this.driftService.getPositionMetrics(0);
      if (currentPosition && currentPosition.direction !== this.position.direction) {
        await this.driftService.closePosition(0);
      }

      // Open new position
      return await this.driftService.openPosition(
        this.position.size,
        this.position.leverage,
        this.position.direction
      );
    } catch (error) {
      console.error('Error executing strategy:', error);
      throw error;
    }
  }

  getStrategyState(): TradingStrategy {
    return {
      asset: this.asset,
      indicators: { ...this.indicators },
      position: { ...this.position }
    };
  }

  getParameters(): StrategyParameters {
    return { ...this.params };
  }
}