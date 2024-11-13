/** Position direction type */
export type PositionDirection = 'long' | 'short';

/** Trading strategy interface */
export interface TradingStrategy {
    asset: 'SOL-PERP';
    indicators: {
        funding: boolean;
        momentum: boolean;
        volatility: boolean;
    };
    position: {
        size: number;
        leverage: number;
        direction: PositionDirection;
    };
}

/** Strategy parameters interface */
export interface StrategyParameters {
    minPositionSize: number;
    maxPositionSize: number;
    defaultLeverage: number;
    maxLeverage: number;
    fundingRateThreshold: number;
    volatilityThreshold: number;
    momentumPeriod: number;
    stopLossPercentage: number;
    takeProfitPercentage: number;
}