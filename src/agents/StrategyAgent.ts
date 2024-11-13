import { TradingStrategy } from '../services/TradingStrategy';

interface StrategyConfig {
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  riskLevel: 'low' | 'medium' | 'high';
  indicators: string[];
}

interface StrategyPerformance {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class StrategyAgent {
  private activeStrategies: Map<string, TradingStrategy> = new Map();
  private performanceMetrics: Map<string, StrategyPerformance> = new Map();

  constructor() {
    // Initialize with default strategies
    this.initializeDefaultStrategies();
  }

  private initializeDefaultStrategies(): void {
    // Example strategy configurations
    const trendFollowing: StrategyConfig = {
      timeframe: '1h',
      riskLevel: 'medium',
      indicators: ['MA', 'RSI', 'MACD'],
    };

    const meanReversion: StrategyConfig = {
      timeframe: '15m',
      riskLevel: 'medium',
      indicators: ['Bollinger', 'RSI', 'ATR'],
    };

    // Create and register strategies
    this.createStrategy('trend_following', trendFollowing);
    this.createStrategy('mean_reversion', meanReversion);
  }

  public createStrategy(name: string, config: StrategyConfig): void {
    const strategy = new TradingStrategy();
    this.activeStrategies.set(name, strategy);

    // Initialize performance metrics
    this.performanceMetrics.set(name, {
      winRate: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
    });
  }

  public async evaluateStrategy(
    name: string,
    marketData: MarketData[]
  ): Promise<boolean> {
    const strategy = this.activeStrategies.get(name);
    if (!strategy) {
      throw new Error(`Strategy ${name} not found`);
    }

    try {
      // Calculate technical indicators
      const indicators = strategy.calculateIndicators(marketData);

      // Train the model with historical data
      await strategy.trainModel(marketData);

      // Make prediction
      const prediction = await strategy.predict(marketData);

      // Update performance metrics based on prediction and actual outcome
      const lastPrice = marketData[marketData.length - 1].close;
      const isValid = Math.abs(prediction - lastPrice) / lastPrice < 0.02; // 2% threshold

      this.updatePerformanceMetrics(name, {
        prediction,
        actual: lastPrice,
        indicators,
        isValid,
      });

      return isValid;
    } catch (error) {
      console.error(`Error evaluating strategy ${name}:`, error);
      return false;
    }
  }

  private updatePerformanceMetrics(name: string, analysis: any): void {
    const currentMetrics = this.performanceMetrics.get(name);
    if (!currentMetrics) return;

    // Update metrics based on strategy performance
    const updatedMetrics: StrategyPerformance = {
      winRate: this.calculateWinRate(analysis),
      profitFactor: this.calculateProfitFactor(analysis),
      sharpeRatio: this.calculateSharpeRatio(analysis),
      maxDrawdown: this.calculateMaxDrawdown(analysis),
    };

    this.performanceMetrics.set(name, updatedMetrics);
  }

  private calculateWinRate(analysis: any): number {
    // Implement win rate calculation
    return analysis.successfulTrades / analysis.totalTrades || 0;
  }

  private calculateProfitFactor(analysis: any): number {
    // Implement profit factor calculation
    return analysis.grossProfit / analysis.grossLoss || 0;
  }

  private calculateSharpeRatio(analysis: any): number {
    // Implement Sharpe ratio calculation
    return (
      (analysis.returns - analysis.riskFreeRate) / analysis.volatility || 0
    );
  }

  private calculateMaxDrawdown(analysis: any): number {
    // Implement maximum drawdown calculation
    return analysis.maxDrawdown || 0;
  }

  public getStrategyPerformance(name: string): StrategyPerformance | null {
    return this.performanceMetrics.get(name) || null;
  }

  public getAllStrategies(): string[] {
    return Array.from(this.activeStrategies.keys());
  }
}
