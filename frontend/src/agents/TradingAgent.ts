import { Connection, PublicKey } from '@solana/web3.js';
import { DriftService } from '../services/DriftService';
import { SOLPerpetualStrategy, StrategyParameters, TradingStrategy } from '../services/TradingStrategy';

export interface AgentConfig {
  checkInterval: number;  // Milliseconds between strategy checks
  maxDrawdown: number;    // Maximum allowed drawdown percentage
  riskLimit: number;      // Maximum position size as percentage of portfolio
  autoRebalance: boolean; // Whether to automatically rebalance positions
}

export class TradingAgent {
  private strategy: SOLPerpetualStrategy;
  private driftService: DriftService;
  private isRunning: boolean = false;
  private checkIntervalId: NodeJS.Timeout | null = null;
  private lastExecutionTime: number = 0;

  constructor(
    connection: Connection,
    private userPublicKey: PublicKey,
    private strategyParams?: StrategyParameters,
    private config: AgentConfig = {
      checkInterval: 60000, // 1 minute
      maxDrawdown: 8.50,   // 8.50% max drawdown
      riskLimit: 50,       // 50% max portfolio allocation
      autoRebalance: true
    }
  ) {
    this.driftService = new DriftService(connection);
    this.strategy = new SOLPerpetualStrategy(this.driftService, strategyParams);
  }

  async initialize(): Promise<void> {
    try {
      await this.driftService.initialize(this.userPublicKey);
      await this.strategy.initialize();
      console.log('Trading agent initialized successfully');
    } catch (error) {
      console.error('Error initializing trading agent:', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Trading agent is already running');
      return;
    }

    try {
      await this.initialize();
      this.isRunning = true;
      this.checkIntervalId = setInterval(
        () => this.executeTradeLoop(),
        this.config.checkInterval
      );
      console.log('Trading agent started successfully');
    } catch (error) {
      console.error('Error starting trading agent:', error);
      this.stop();
      throw error;
    }
  }

  stop(): void {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
    this.isRunning = false;
    console.log('Trading agent stopped');
  }

  private async executeTradeLoop(): Promise<void> {
    const currentTime = Date.now();
    if (currentTime - this.lastExecutionTime < this.config.checkInterval) {
      return;
    }

    try {
      // Check if we need to rebalance based on drawdown
      if (this.config.autoRebalance) {
        await this.checkAndRebalance();
      }

      // Execute strategy
      const tx = await this.strategy.executeStrategy();
      console.log('Strategy execution completed:', tx);

      this.lastExecutionTime = currentTime;
    } catch (error) {
      console.error('Error in trade execution loop:', error);
      // Don't stop the agent on execution error, just log it
    }
  }

  private async checkAndRebalance(): Promise<void> {
    try {
      const position = await this.driftService.getPositionMetrics(0);
      if (!position) return;

      // Check drawdown
      const drawdown = this.calculateDrawdown(position.pnl, position.size * position.leverage);
      if (drawdown > this.config.maxDrawdown) {
        console.log(`Drawdown limit exceeded (${drawdown.toFixed(2)}%). Reducing position...`);
        await this.reducePosition(position);
      }

      // Check risk limit
      const riskExposure = await this.calculateRiskExposure(position.size, position.leverage);
      if (riskExposure > this.config.riskLimit) {
        console.log(`Risk limit exceeded (${riskExposure.toFixed(2)}%). Adjusting position...`);
        await this.adjustRisk(position);
      }
    } catch (error) {
      console.error('Error in rebalancing check:', error);
    }
  }

  private calculateDrawdown(pnl: number, positionValue: number): number {
    if (positionValue === 0) return 0;
    return Math.abs((pnl / positionValue) * 100);
  }

  private async calculateRiskExposure(size: number, leverage: number): Promise<number> {
    const portfolioValue = await this.getTotalPortfolioValue();
    if (portfolioValue === 0) return 0;
    return (size * leverage * 100) / portfolioValue;
  }

  private async getTotalPortfolioValue(): Promise<number> {
    try {
      const position = await this.driftService.getPositionMetrics(0);
      if (!position) return 0;
      const price = await this.driftService.getMarketPrice();
      return position.size * price;
    } catch (error) {
      console.error('Error getting portfolio value:', error);
      return 0;
    }
  }

  private async reducePosition(position: {
    size: number;
    leverage: number;
    direction: 'long' | 'short';
  }): Promise<void> {
    try {
      // Reduce position size by 50%
      const newSize = position.size * 0.5;
      await this.driftService.openPosition(
        newSize,
        position.leverage,
        position.direction
      );
      console.log('Position size reduced successfully');
    } catch (error) {
      console.error('Error reducing position:', error);
      throw error;
    }
  }

  private async adjustRisk(position: {
    size: number;
    leverage: number;
    direction: 'long' | 'short';
  }): Promise<void> {
    try {
      // Reduce leverage to meet risk limit
      const newLeverage = Math.max(1, position.leverage * 0.75);
      await this.driftService.adjustLeverage(0, newLeverage);
      console.log('Position risk adjusted successfully');
    } catch (error) {
      console.error('Error adjusting risk:', error);
      throw error;
    }
  }

  getStrategyState(): TradingStrategy {
    return this.strategy.getStrategyState();
  }

  getStrategyParameters(): StrategyParameters {
    return this.strategy.getParameters();
  }

  getAgentConfig(): AgentConfig {
    return { ...this.config };
  }

  isActive(): boolean {
    return this.isRunning;
  }
}