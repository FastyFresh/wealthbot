import * as tf from '@tensorflow/tfjs';
import { RSI, BollingerBands } from 'technicalindicators';

interface MarketData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export class TradingStrategy {
    private model: tf.Sequential | null = null;
    private baseUrl = 'https://api.binance.com/api/v3';
    
    constructor() {
        // Initialize TensorFlow model
        this.initialize();
    }

    async initialize() {
        // Create a simple LSTM model for price prediction
        this.model = tf.sequential({
            layers: [
                tf.layers.lstm({
                    units: 50,
                    returnSequences: true,
                    inputShape: [30, 5] // 30 days of 5 features (OHLCV)
                }),
                tf.layers.dropout({
                    rate: 0.2
                }),
                tf.layers.lstm({
                    units: 50,
                    returnSequences: false
                }),
                tf.layers.dense({
                    units: 1
                })
            ]
        });

        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError'
        });
    }

    async fetchMarketData(symbol: string, interval: string = '1d', limit: number = 1000): Promise<MarketData[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/klines?symbol=${symbol.replace('/', '')}&interval=${interval}&limit=${limit}`
            );
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            return data.map((candle: any[]) => ({
                timestamp: candle[0],
                open: parseFloat(candle[1]),
                high: parseFloat(candle[2]),
                low: parseFloat(candle[3]),
                close: parseFloat(candle[4]),
                volume: parseFloat(candle[5])
            }));
        } catch (error) {
            console.error('Error fetching market data:', error);
            throw error;
        }
    }

    calculateIndicators(data: MarketData[]) {
        const closes = data.map(d => d.close);
        const highs = data.map(d => d.high);
        const lows = data.map(d => d.low);

        const rsi = RSI.calculate({
            values: closes,
            period: 14
        });

        // Calculate MACD manually since the library types are incorrect
        const ema12 = this.calculateEMA(closes, 12);
        const ema26 = this.calculateEMA(closes, 26);
        const macdLine = ema12.map((value, index) => value - ema26[index]);
        const signalLine = this.calculateEMA(macdLine, 9);
        const histogram = macdLine.map((value, index) => value - signalLine[index]);

        const macd = {
            MACD: macdLine,
            signal: signalLine,
            histogram: histogram
        };

        const bb = BollingerBands.calculate({
            values: closes,
            period: 20,
            stdDev: 2
        });

        return {
            rsi,
            macd,
            bollinger: bb
        };
    }

    private calculateEMA(data: number[], period: number): number[] {
        const k = 2 / (period + 1);
        const ema = [data[0]];
        
        for (let i = 1; i < data.length; i++) {
            ema.push(data[i] * k + ema[i - 1] * (1 - k));
        }
        
        return ema;
    }

    async trainModel(data: MarketData[]) {
        const windowSize = 30;
        const features = this.prepareFeatures(data);
        const labels = this.prepareLabels(data);

        // Convert to tensors
        const xs = tf.tensor3d(features);
        const ys = tf.tensor2d(labels);

        // Train the model
        await this.model?.fit(xs, ys, {
            epochs: 50,
            batchSize: 32,
            validationSplit: 0.1,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
                }
            }
        });

        // Clean up tensors
        xs.dispose();
        ys.dispose();
    }

    private prepareFeatures(data: MarketData[]) {
        const features = [];
        const windowSize = 30;

        for (let i = windowSize; i < data.length; i++) {
            const window = data.slice(i - windowSize, i).map(d => [
                d.open,
                d.high,
                d.low,
                d.close,
                d.volume
            ]);
            features.push(window);
        }

        return features;
    }

    private prepareLabels(data: MarketData[]) {
        const labels = [];
        const windowSize = 30;

        for (let i = windowSize; i < data.length; i++) {
            labels.push([data[i].close]);
        }

        return labels;
    }

    async predict(data: MarketData[]) {
        if (!this.model) {
            throw new Error('Model not initialized');
        }

        const features = this.prepareFeatures(data.slice(-31, -1));
        const xs = tf.tensor3d([features[0]]);
        const prediction = this.model.predict(xs) as tf.Tensor;
        const result = prediction.dataSync()[0];
        
        // Clean up tensors
        xs.dispose();
        prediction.dispose();
        
        return result;
    }
}