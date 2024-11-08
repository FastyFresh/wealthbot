
import { TradingStrategy } from '../services/TradingStrategy';

interface TradingDecision {
  action: 'buy' | 'sell' | 'hold';
  amount?: number;
  price?: number;
  confidence: number;
}

interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class TradingAgent {
  private strategy: TradingStrategy;
  private lastDecision: TradingDecision | null = null;

  constructor(strategy: TradingStrategy) {
    this.strategy = strategy;
  }

  public async analyzeTrade(marketData: MarketData[]): Promise<TradingDecision> {
    try {
      // Calculate technical indicators
      const indicators = this.strategy.calculateIndicators(marketData);
      
      // Get prediction from the model
      await this.strategy.trainModel(marketData);
      const predictedPrice = await this.strategy.predict(marketData);
      
      // Basic decision-making logic based on indicators and prediction
      const decision: TradingDecision = {
        action: 'hold',
        confidence: 0
      };

      const currentPrice = marketData[marketData.length - 1].close;
      const rsi = indicators.rsi[indicators.rsi.length - 1];
      const macd = indicators.macd.MACD[indicators.macd.MACD.length - 1];
      const signal = indicators.macd.signal[indicators.macd.signal.length - 1];

      // RSI-based decisions
      if (rsi < 30) {
        decision.action = 'buy';
        decision.confidence = 0.7;
      } else if (rsi > 70) {
        decision.action = 'sell';
        decision.confidence = 0.7;
      }

      // MACD crossover
      if (macd > signal && decision.action === 'hold') {
        decision.action = 'buy';
        decision.confidence = 0.6;
      } else if (macd < signal && decision.action === 'hold') {
        decision.action = 'sell';
        decision.confidence = 0.6;
      }

      // Price prediction influence
      const priceChange = (predictedPrice - currentPrice) / currentPrice;
      if (Math.abs(priceChange) > 0.02) { // 2% threshold
        if (priceChange > 0 && decision.action !== 'sell') {
          decision.action = 'buy';
          decision.confidence = Math.max(decision.confidence, 0.8);
        } else if (priceChange < 0 && decision.action !== 'buy') {
          decision.action = 'sell';
          decision.confidence = Math.max(decision.confidence, 0.8);
        }
      }

      if (decision.action !== 'hold') {
        decision.price = currentPrice;
        decision.amount = this.calculateTradeAmount(marketData, decision.confidence);
      }

      this.lastDecision = decision;
      return decision;
    } catch (error) {
      console.error('Error in trade analysis:', error);
      return {
        action: 'hold',
        confidence: 0
      };
    }
  }

  private calculateTradeAmount(marketData: MarketData[], confidence: number): number {
    // Implement position sizing logic based on:
    // - Available capital (assumed to be 100000 for this example)
    // - Risk tolerance
    // - Market volatility
    // - Analysis confidence
    const availableCapital = 100000; // Example value
    const baseAmount = availableCapital * 0.1; // Use 10% of available capital
    const riskAdjustedAmount = baseAmount * confidence;
    
    return Math.min(riskAdjustedAmount, availableCapital);
  }

  public getLastDecision(): TradingDecision | null {
    return this.lastDecision;
  }
}
