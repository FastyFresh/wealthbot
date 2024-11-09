
export interface BollingerBand {
    upper: number;
    middle: number;
    lower: number;
}

export interface TechnicalIndicators {
    rsi: number[];
    macd: {
        MACD: number[];
        signal: number[];
        histogram: number[];
    };
    bollinger: BollingerBand[];
}

export interface MarketData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface PredictionResult {
    predictedPrice: number;
    confidence: number;
    volatility: number;
    trend: 'bullish' | 'bearish' | 'neutral';
}

export interface OrderType {
    type: 'market' | 'limit' | 'stop';
    side: 'buy' | 'sell';
    size: number;
    price?: number;
    leverage: number;
    stopPrice?: number;
}

export interface OrderBookEntry {
    price: number;
    size: number;
    total: number;
}

export interface OrderBookData {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
    spread: number;
}

export interface TopBarMetrics {
    accountValue: number;
    dailyPnL: number;
    totalPnL: number;
    availableBalance: number;
    marginUsage: number;
}
