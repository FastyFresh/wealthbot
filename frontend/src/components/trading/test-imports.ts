import type { TradingStrategy, PositionDirection, StrategyParameters } from '../../services/TradingStrategy';
import { SOLPerpetualStrategy } from '../../services/TradingStrategy';
import { DriftService } from '../../services/DriftService';

// Type test
const strategyState: TradingStrategy = {
    asset: 'SOL-PERP',
    indicators: {
        funding: true,
        momentum: true,
        volatility: true
    },
    position: {
        size: 0,
        leverage: 1,
        direction: 'long'
    }
};

// Class test
const driftService = new DriftService();
const strategy = new SOLPerpetualStrate