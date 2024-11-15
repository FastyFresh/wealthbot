import { Connection, PublicKey } from '@solana/web3.js';
import { StrategyParameters } from '../strategies/SOLPerpetualStrategy';
import { TradingAgent, AgentConfig } from './TradingAgent';

interface Trade {
    price: number;
    volume: number;
    type: 'long' | 'short';
    entryPrice: number;
    exitPrice: number;
}

interface TechnicalIndicators {
    rsi: number[];
    macd: {
        line: number[];
        signal: number[];
        histogram: number[];
    };
    ema: number[];
    volumeMA: number[];
}

export class StrategyAgent extends TradingAgent {
    private technicalIndicators: TechnicalIndicators = {
        rsi: [],
        macd: {
            line: [],
            signal: [],
            histogram: []
        },
        ema: [],
        volumeMA: []
    };

    constructor(
        connection: Connection,
        userPublicKey: PublicKey,
        private readonly params: StrategyParameters
    ) {
        const config: AgentConfig = {
            maxPositionSize: params.maxPositionSize,
            stopLossPercentage: params.stopLossPercentage,
            takeProfitPercentage: params.takeProfitPercentage
        };
        super(connection, userPublicKey, config);
    }

    private async updateMarketIndicators(price: number, volume: number): Promise<void> {
        const period = this.params.indicatorPeriod || 14;
        
        // Update RSI
        const prices = [...this.technicalIndicators.rsi, price];
        const newRSI = this.calculateRSI(prices, period);
        
        // Update MACD
        const newMACD = this.calculateMACD(prices);
        
        // Update EMA
        const newEMA = this.calculateEMA(prices, period);

        // Update Volume MA
        const volumes = [...this.technicalIndicators.volumeMA, volume];
        const newVolumeMA = this.calculateVolumeMA(volumes, period);

        this.technicalIndicators = {
            rsi: newRSI,
            macd: newMACD,
            ema: newEMA,
            volumeMA: newVolumeMA
        };
    }

    private calculateVolumeMA(volumes: number[], period: number): number[] {
        if (volumes.length < period) return volumes;
        const ma = volumes.slice(-period).reduce((sum, vol) => sum + vol, 0) / period;
        return [...volumes.slice(-period + 1), ma];
    }

    private calculateRSI(prices: number[], period: number): number[] {
        if (prices.length < period + 1) return prices;
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i <= period; i++) {
            const diff = prices[i] - prices[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
        }
        
        const rs = gains / losses;
        const rsi = 100 - (100 / (1 + rs));
        return [...prices.slice(-period + 1), rsi];
    }

    private calculateMACD(prices: number[]): TechnicalIndicators['macd'] {
        const shortPeriod = 12;
        const longPeriod = 26;
        const signalPeriod = 9;

        const shortEMA = this.calculateEMA(prices, shortPeriod);
        const longEMA = this.calculateEMA(prices, longPeriod);
        const line = shortEMA.map((short, i) => short - (longEMA[i] || 0));
        const signal = this.calculateEMA(line, signalPeriod);
        const histogram = line.map((l, i) => l - (signal[i] || 0));

        return { line, signal, histogram };
    }

    private calculateEMA(prices: number[], period: number): number[] {
        if (prices.length < period) return prices;
        const multiplier = 2 / (period + 1);
        let ema = prices.slice(0, period).reduce((sum, price) => sum + price) / period;
        const result = [ema];
        
        for (let i = period; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
            result.push(ema);
        }
        
        return result;
    }

    public async analyzeTrade(trade: Trade): Promise<boolean> {
        await this.updateMarketIndicators(trade.price, trade.volume);
        const { type, entryPrice, exitPrice } = trade;
        return type === 'long' ? exitPrice > entryPrice : exitPrice < entryPrice;
    }

    public async getMarketPrediction(price: number, volume: number): Promise<'long' | 'short' | 'hold'> {
        await this.updateMarketIndicators(price, volume);
        const { rsi, macd, ema, volumeMA } = this.technicalIndicators;

        const lastRSI = rsi[rsi.length - 1] || 50;
        const lastMACD = macd.histogram[macd.histogram.length - 1] || 0;
        const lastEMA = ema[ema.length - 1] || price;
        const lastVolumeMA = volumeMA[volumeMA.length - 1] || volume;

        // Volume confirmation
        const volumeConfirmation = volume > lastVolumeMA;

        if (lastRSI < 30 && lastMACD > 0 && price < lastEMA && volumeConfirmation) {
            return 'long';
        }
        if (lastRSI > 70 && lastMACD < 0 && price > lastEMA && volumeConfirmation) {
            return 'short';
        }

        return 'hold';
    }
}
