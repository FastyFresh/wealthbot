
import { TradingStrategy } from '../services/TradingStrategy';
import { TradingAgent } from './TradingAgent';

interface BacktestResult {
  totalReturns: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  trades: Trade[];
  equity: number[];
  drawdown: number[];
}

interface Trade {
  entryDate: Date;
  exitDate: Date;
  entryPrice: number;
  exitPrice: number;
  type: 'long' | 'short';
  profit: number;
  profitPercent: number;
}

interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class BacktestingAgent {
  private tradingAgent: TradingAgent;
  private initialCapital: number;
  private commission: number;
  private slippage: number;

  constructor(
    strategy: TradingStrategy,
    initialCapital: number = 100000,
    commission: number = 0.001, // 0.1%
    slippage: number = 0.001 // 0.1%
  ) {
    this.tradingAgent = new TradingAgent(strategy);
    this.initialCapital = initialCapital;
    this.commission = commission;
    this.slippage = slippage;
  }

  public async runBacktest(historicalData: MarketData[]): Promise<BacktestResult> {
    let equity = [this.initialCapital];
    let currentCapital = this.initialCapital;
    let position: { type: 'long' | 'short' | null; entryPrice: number; size: number } = {
      type: null,
      entryPrice: 0,
      size: 0
    };
    let trades: Trade[] = [];
    let maxEquity = this.initialCapital;
    let drawdown: number[] = [0];

    // Process each historical data point
    for (let i = 30; i < historicalData.length; i++) { // Start from 30 to have enough data for indicators
      const windowData = historicalData.slice(i - 30, i + 1);
      const decision = await this.tradingAgent.analyzeTrade(windowData);
      const currentPrice = windowData[windowData.length - 1].close;

      // Handle position exit
      if (position.type !== null && 
         ((position.type === 'long' && decision.action === 'sell') ||
          (position.type === 'short' && decision.action === 'buy'))) {
        
        const exitPrice = this.adjustPrice(currentPrice, position.type === 'long' ? 'sell' : 'buy');
        const profit = position.type === 'long' 
          ? (exitPrice - position.entryPrice) * position.size
          : (position.entryPrice - exitPrice) * position.size;
        
        currentCapital += profit;
        trades.push({
          entryDate: new Date(windowData[windowData.length - 2].timestamp),
          exitDate: new Date(windowData[windowData.length - 1].timestamp),
          entryPrice: position.entryPrice,
          exitPrice: exitPrice,
          type: position.type,
          profit: profit,
          profitPercent: (profit / (position.entryPrice * position.size)) * 100
        });

        position = { type: null, entryPrice: 0, size: 0 };
      }

      // Handle new position entry
      if (position.type === null && (decision.action === 'buy' || decision.action === 'sell')) {
        const entryPrice = this.adjustPrice(currentPrice, decision.action);
        const positionSize = this.calculatePositionSize(currentCapital, entryPrice, decision.confidence);
        
        position = {
          type: decision.action === 'buy' ? 'long' : 'short',
          entryPrice: entryPrice,
          size: positionSize
        };
      }

      // Update equity and drawdown
      equity.push(currentCapital);
      maxEquity = Math.max(maxEquity, currentCapital);
      drawdown.push((maxEquity - currentCapital) / maxEquity * 100);
    }

    return {
      totalReturns: ((currentCapital - this.initialCapital) / this.initialCapital) * 100,
      sharpeRatio: this.calculateSharpeRatio(equity),
      maxDrawdown: Math.max(...drawdown),
      winRate: this.calculateWinRate(trades),
      profitFactor: this.calculateProfitFactor(trades),
      trades,
      equity,
      drawdown
    };
  }

  private adjustPrice(price: number, action: 'buy' | 'sell'): number {
    const slippageAdjustment = price * this.slippage * (action === 'buy' ? 1 : -1);
    const commissionAdjustment = price * this.commission;
    return price + slippageAdjustment + commissionAdjustment;
  }

  private calculatePositionSize(capital: number, price: number, confidence: number): number {
    // Risk-based position sizing
    const riskPerTrade = capital * 0.02; // 2% risk per trade
    const positionSize = (riskPerTrade * confidence) / price;
    return Math.floor(positionSize);
  }

  private calculateSharpeRatio(equity: number[]): number {
    const returns = equity.map((eq, i) => 
      i === 0 ? 0 : (eq - equity[i - 1]) / equity[i - 1]
    );
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length
    );
    const riskFreeRate = 0.02 / 252; // Assuming 2% annual risk-free rate
    return (avgReturn - riskFreeRate) / stdDev * Math.sqrt(252);
  }

  private calculateWinRate(trades: Trade[]): number {
    if (trades.length === 0) return 0;
    const winningTrades = trades.filter(t => t.profit > 0).length;
    return (winningTrades / trades.length) * 100;
  }

  private calculateProfitFactor(trades: Trade[]): number {
    const grossProfit = trades
      .filter(t => t.profit > 0)
      .reduce((sum, t) => sum + t.profit, 0);
    const grossLoss = Math.abs(
      trades
        .filter(t => t.profit < 0)
        .reduce((sum, t) => sum + t.profit, 0)
    );
    return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  }
}
