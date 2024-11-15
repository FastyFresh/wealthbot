import { Connection, PublicKey } from '@solana/web3.js';
import { SOLPerpetualStrategy, StrategyParameters } from '../services/TradingStrategy';
import { TradingAgent, AgentConfig } from './TradingAgent';

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
}

export class BacktestingAgent extends TradingAgent {
    private backtestResults: BacktestResult | null = null;

    constructor(
        connection: Connection,
        userPublicKey: PublicKey,
        strategyParams?: StrategyParameters,
        config: AgentConfig = {
            checkInterval: 60000,
            maxDrawdown: 8.50,
            riskLimit: 50,
            autoRebalance: true
        }
    ) {
        super(connection, userPublicKey, strategyParams, config);
    }

    async analyzeTrade(trade: Trade): Promise<boolean> {
        const { entryPrice, exitPrice, type } = trade;
        
        if (type === 'long') {
            return exitPrice > entryPrice;
        } else {
            return exitPrice < entryPrice;
        }
    }

    getBacktestResults(): BacktestResult | null {
        return this.backtestResults;
    }
}
