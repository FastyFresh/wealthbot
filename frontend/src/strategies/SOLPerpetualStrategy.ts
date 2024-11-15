import { Connection, PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export interface StrategyParameters {
    maxPositionSize: number;
    stopLossPercentage: number;
    takeProfitPercentage: number;
    indicatorPeriod?: number;
}

export interface MarketData {
    price: number;
    volume: number;
    indicators?: {
        rsi: number[];
        macd: {
            line: number[];
            signal: number[];
            histogram: number[];
        };
        ema: number[];
    };
}

export class SOLPerpetualStrategy {
    private wallet = useWallet();
    private { connection } = useConnection();
    
    constructor(private readonly params: StrategyParameters) {
        this.validateParameters(params);
    }

    private validateParameters(params: StrategyParameters): void {
        if (params.maxPositionSize <= 0) {
            throw new Error('maxPositionSize must be greater than 0');
        }
        if (params.stopLossPercentage <= 0 || params.stopLossPercentage >= 100) {
            throw new Error('stopLossPercentage must be between 0 and 100');
        }
        if (params.takeProfitPercentage <= 0 || params.takeProfitPercentage >= 100) {
            throw new Error('takeProfitPercentage must be between 0 and 100');
        }
    }

    public async predict(data: MarketData): Promise<'long' | 'short' | 'hold'> {
        try {
            if (!this.wallet.connected) {
                console.warn('Wallet not connected');
                return 'hold';
            }

            const { price, volume, indicators } = data;
            if (!indicators) return 'hold';

            const { rsi, macd, ema } = indicators;
            
            const lastRSI = rsi[rsi.length - 1];
            const lastMACD = macd.histogram[macd.histogram.length - 1];
            const lastEMA = ema[ema.length - 1];

            // Strategy logic
            if (lastRSI < 30 && lastMACD > 0 && price < lastEMA) {
                return 'long';
            }
            if (lastRSI > 70 && lastMACD < 0 && price > lastEMA) {
                return 'short';
            }

            return 'hold';
        } catch (error) {
            console.error('Error in strategy prediction:', error);
            return 'hold';
        }
    }

    public async train(historicalData: number[][]): Promise<void> {
        // Implementation for training if needed
        console.log('Training strategy with historical data...');
    }
}
