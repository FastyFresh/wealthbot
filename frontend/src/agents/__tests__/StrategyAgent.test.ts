import { Connection, PublicKey } from '@solana/web3.js';
import { StrategyAgent } from '../StrategyAgent';
import { StrategyParameters } from '../../strategies/SOLPerpetualStrategy';

describe('StrategyAgent', () => {
    let strategyAgent: StrategyAgent;
    let connection: Connection;
    let publicKey: PublicKey;
    let strategyParams: StrategyParameters;

    beforeEach(() => {
        connection = new Connection('http://localhost:8899');
        publicKey = new PublicKey('11111111111111111111111111111111');
        strategyParams = {
            maxPositionSize: 1000,
            stopLossPercentage: 2,
            takeProfitPercentage: 4,
            indicatorPeriod: 14
        };
        strategyAgent = new StrategyAgent(connection, publicKey, strategyParams);
    });

    describe('analyzeTrade', () => {
        it('should analyze trade with current market conditions', async () => {
            const price = 100;
            const volume = 1000;
            const result = await strategyAgent.analyzeTrade({
                price,
                volume,
                type: 'long',
                entryPrice: 95,
                exitPrice: 105
            });
            expect(typeof result).toBe('boolean');
        });
    });

    describe('getMarketPrediction', () => {
        it('should return a valid trading signal', async () => {
            const result = await strategyAgent.getMarketPrediction(100, 1000);
            expect(['long', 'short', 'hold']).toContain(result);
        });

        it('should handle oversold conditions', async () => {
            // Simulate declining prices
            for (let i = 0; i < 20; i++) {
                await strategyAgent.getMarketPrediction(100 - i, 1000);
            }
            const result = await strategyAgent.getMarketPrediction(80, 1000);
            expect(['hold', 'long']).toContain(result);
        });

        it('should handle overbought conditions', async () => {
            // Simulate rising prices
            for (let i = 0; i < 20; i++) {
                await strategyAgent.getMarketPrediction(100 + i, 1000);
            }
            const result = await strategyAgent.getMarketPrediction(120, 1000);
            expect(['hold', 'short']).toContain(result);
        });
    });
});
