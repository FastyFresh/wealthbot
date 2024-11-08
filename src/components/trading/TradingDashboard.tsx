import React, { useEffect, useState, useCallback } from 'react';
import { TradingStrategy } from '../../services/TradingStrategy';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { MarketData, TechnicalIndicators } from '../../types/indicators';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
);

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button
            onClick={onRetry}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
            Retry
        </button>
    </div>
);

export const TradingDashboard: React.FC = () => {
    console.log('TradingDashboard: Component mounting');
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    const [tradingStrategy] = useState(() => {
        console.log('TradingDashboard: Creating TradingStrategy instance');
        return new TradingStrategy();
    });
    const [initializing, setInitializing] = useState(true);

    const fetchData = useCallback(async () => {
        console.log('TradingDashboard: Fetching data');
        try {
            setLoading(true);
            setError(null);
            
            // Fetch market data
            console.log('TradingDashboard: Fetching market data');
            const data = await tradingStrategy.fetchMarketData(selectedSymbol);
            setMarketData(data);
            console.log('TradingDashboard: Market data fetched', data.length);

            // Calculate indicators
            console.log('TradingDashboard: Calculating indicators');
            const rawIndicators = tradingStrategy.calculateIndicators(data);
            
            // Transform Bollinger Bands data to match our type
            const transformedIndicators: TechnicalIndicators = {
                rsi: rawIndicators.rsi,
                macd: rawIndicators.macd,
                bollinger: rawIndicators.bollinger.map(band => ({
                    upper: band.upper,
                    middle: band.middle,
                    lower: band.lower
                }))
            };
            
            setIndicators(transformedIndicators);
            console.log('TradingDashboard: Indicators calculated');

            // Train model and make prediction
            console.log('TradingDashboard: Training model');
            await tradingStrategy.trainModel(data);
            console.log('TradingDashboard: Making prediction');
            const nextPricePrediction = await tradingStrategy.predict(data);
            setPrediction(nextPricePrediction);
            console.log('TradingDashboard: Prediction made', nextPricePrediction);

            setLoading(false);
        } catch (err) {
            console.error('TradingDashboard: Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
            setLoading(false);
        }
    }, [selectedSymbol, tradingStrategy]);

    useEffect(() => {
        console.log('TradingDashboard: Running initialization effect');
        const initializeAndFetch = async () => {
            try {
                console.log('TradingDashboard: Initializing trading strategy');
                await tradingStrategy.initialize();
                setInitializing(false);
                console.log('TradingDashboard: Trading strategy initialized');
                await fetchData();
            } catch (err) {
                console.error('TradingDashboard: Error initializing:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize trading strategy');
                setInitializing(false);
            }
        };

        initializeAndFetch();
    }, [fetchData]);

    const getSignalStrength = () => {
        if (!indicators || !prediction || marketData.length === 0) return 'Neutral';

        const lastClose = marketData[marketData.length - 1].close;
        const lastRsi = indicators.rsi[indicators.rsi.length - 1];
        const priceChange = ((prediction - lastClose) / lastClose) * 100;

        if (priceChange > 2 && lastRsi < 70) return 'Strong Buy';
        if (priceChange > 0.5 && lastRsi < 60) return 'Buy';
        if (priceChange < -2 && lastRsi > 30) return 'Strong Sell';
        if (priceChange < -0.5 && lastRsi > 40) return 'Sell';
        return 'Neutral';
    };

    const getSignalColor = (signal: string) => {
        switch (signal) {
            case 'Strong Buy':
            case 'Buy':
                return 'text-green-600';
            case 'Strong Sell':
            case 'Sell':
                return 'text-red-600';
            default:
                return 'text-yellow-600';
        }
    };

    if (initializing) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Initializing AI Trading Model...</h1>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">AI Trading Dashboard</h1>
                        <select
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e.target.value)}
                            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="BTCUSDT">Bitcoin (BTC/USDT)</option>
                            <option value="ETHUSDT">Ethereum (ETH/USDT)</option>
                            <option value="SOLUSDT">Solana (SOL/USDT)</option>
                        </select>
                    </div>
                    
                    {error && <ErrorDisplay error={error} onRetry={fetchData} />}
                    
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4">Market Data</h2>
                                {marketData.length > 0 && (
                                    <div className="space-y-2">
                                        <p>Current Price: ${marketData[marketData.length - 1].close.toFixed(2)}</p>
                                        <p>24h High: ${marketData[marketData.length - 1].high.toFixed(2)}</p>
                                        <p>24h Low: ${marketData[marketData.length - 1].low.toFixed(2)}</p>
                                        <p>24h Volume: {marketData[marketData.length - 1].volume.toFixed(2)}</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
                                {indicators && (
                                    <div className="space-y-2">
                                        <p>RSI: {indicators.rsi[indicators.rsi.length - 1]?.toFixed(2)}</p>
                                        <p>MACD: {indicators.macd.MACD[indicators.macd.MACD.length - 1]?.toFixed(2)}</p>
                                        <p>Signal: {indicators.macd.signal[indicators.macd.signal.length - 1]?.toFixed(2)}</p>
                                        <p>Bollinger Upper: {indicators.bollinger[indicators.bollinger.length - 1]?.upper.toFixed(2)}</p>
                                        <p>Bollinger Lower: {indicators.bollinger[indicators.bollinger.length - 1]?.lower.toFixed(2)}</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4">ML Prediction</h2>
                                {prediction !== null && (
                                    <div className="space-y-2">
                                        <p>Next Price Prediction: ${prediction.toFixed(2)}</p>
                                        <p className={`font-bold ${getSignalColor(getSignalStrength())}`}>
                                            Signal: {getSignalStrength()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4">Controls</h2>
                                <div className="space-y-4">
                                    <button
                                        onClick={fetchData}
                                        disabled={loading}
                                        className={`w-full py-2 px-4 rounded transition-colors ${
                                            loading
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                    >
                                        {loading ? 'Refreshing...' : 'Refresh Data'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};