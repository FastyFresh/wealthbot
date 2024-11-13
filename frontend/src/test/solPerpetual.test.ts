import { describe, test, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DriftService } from '../services/DriftService';
import { TradingAgent } from '../agents/TradingAgent';
import { SOLPerpetualStrategy } from '../services/TradingStrategy';

describe('SOL Perpetual Trading Tests', () => {
  let connection: Connection;
  let driftService: DriftService;
  let tradingAgent: TradingAgent;
  let userKeypair: Keypair;

  beforeAll(async () => {
    connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    userKeypair = Keypair.generate();

    const signature = await connection.requestAirdrop(
      userKeypair.publicKey,
      2 * 10 ** 9 // 2 SOL
    );
    await connection.confirmTransaction(signature);
  });

  beforeEach(async () => {
    driftService = new DriftService(connection);
    tradingAgent = new TradingAgent(connection, userKeypair.publicKey, {
      minPositionSize: 0.1,
      maxPositionSize: 1.0,
      defaultLeverage: 2,
      maxLeverage: 5,
      fundingRateThreshold: 0.01,
      volatilityThreshold: 0.02,
      momentumPeriod: 12,
      stopLossPercentage: 5,
      takeProfitPercentage: 15
    });
  });

  test('Initialize DriftService', async () => {
    await expect(driftService.initialize(userKeypair.publicKey))
      .resolves.not.toThrow();
  });

  test('Get SOL Market Price', async () => {
    await driftService.initialize(userKeypair.publicKey);
    const price = await driftService.getMarketPrice();
    expect(price).toBeGreaterThan(0);
  });

  test('Get Funding Rate', async () => {
    await driftService.initialize(userKeypair.publicKey);
    const fundingRate = await driftService.getFundingRate();
    expect(typeof fundingRate).toBe('number');
  });

  test('Open Long Position', async () => {
    await driftService.initialize(userKeypair.publicKey);
    const size = 0.1;
    const leverage = 2;
    const tx = await driftService.openPosition(size, leverage, 'long');
    expect(tx).toBeTruthy();

    const position = await driftService.getPositionMetrics(0);
    expect(position).toBeTruthy();
    expect(position?.size).toBe(size);
    expect(position?.leverage).toBe(leverage);
    expect(position?.direction).toBe('long');
  });

  test('Close Position', async () => {
    await driftService.initialize(userKeypair.publicKey);
    
    // Open position first
    await driftService.openPosition(0.1, 2, 'long');
    
    // Close position
    const tx = await driftService.closePosition(0);
    expect(tx).toBeTruthy();

    // Verify position is closed
    const position = await driftService.getPositionMetrics(0);
    expect(position?.size).toBe(0);
  });

  test('Trading Agent Initialization', async () => {
    await expect(tradingAgent.initialize()).resolves.not.toThrow();
    expect(tradingAgent.isActive()).toBe(false);
  });

  test('Trading Agent Start/Stop', async () => {
    await tradingAgent.start();
    expect(tradingAgent.isActive()).toBe(true);

    tradingAgent.stop();
    expect(tradingAgent.isActive()).toBe(false);
  });

  test('Strategy Execution', async () => {
    const strategy = new SOLPerpetualStrategy(driftService);
    await strategy.initialize();

    // Execute strategy
    const tx = await strategy.executeStrategy();
    expect(tx).toBeTruthy();

    // Verify strategy state
    const state = strategy.getStrategyState();
    expect(state.asset).toBe('SOL-PERP');
    expect(state.indicators.funding).toBe(true);
    expect(state.indicators.momentum).toBe(true);
    expect(state.indicators.volatility).toBe(true);
  });

  test('Risk Management', async () => {
    await tradingAgent.initialize();
    
    // Open a position
    await driftService.openPosition(0.5, 5, 'long');
    
    // Get position metrics
    const position = await driftService.getPositionMetrics(0);
    expect(position).toBeTruthy();
    
    // Verify risk parameters
    const config = tradingAgent.getAgentConfig();
    expect(config.maxDrawdown).toBe(8.50);
    expect(config.riskLimit).toBe(50);
  });

  test('Devnet Integration', async () => {
    await driftService.initialize(userKeypair.publicKey);
    
    // Verify connection to devnet
    const markets = await driftService.getMarkets();
    expect(markets).toBeTruthy();
    expect(markets.length).toBeGreaterThan(0);
    
    // Verify SOL market exists
    const solMarket = markets.find(m => m.baseAssetSymbol === 'SOL');
    expect(solMarket).toBeTruthy();
  });

  afterEach(() => {
    if (tradingAgent.isActive()) {
      tradingAgent.stop();
    }
  });
});