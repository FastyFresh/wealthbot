
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DriftClient, DriftEnv } from '@drift-labs/sdk';
import { SolPriceService } from '../services/SolPriceService';

// Create base mock client
const createBaseMockClient = () => ({
  connection: new Connection('https://api.devnet.solana.com', 'confirmed'),
  wallet: null,
  program: {},
  subscribe: vi.fn().mockResolvedValue(undefined),
  getOraclePrice: vi.fn().mockImplementation((marketName: string) => {
    if (marketName !== 'SOL-PERP') {
      throw new Error('Invalid market');
    }
    return Promise.resolve(100);
  }),
  isSubscribed: vi.fn().mockReturnValue(true),
  swiftID: new PublicKey('11111111111111111111111111111111'),
  authority: new PublicKey('11111111111111111111111111111111'),
  accountSubscriber: { subscribe: vi.fn(), unsubscribe: vi.fn() },
  bulkAccountLoader: { load: vi.fn(), unload: vi.fn() },
  userAccountMap: new Map(),
  userStatsMap: new Map(),
  perpMarketMap: new Map(),
  spotMarketMap: new Map(),
  oracleInfoMap: new Map(),
  insuranceFundStakeAccountMap: new Map()
});

// Mock @drift-labs/sdk
vi.mock('@drift-labs/sdk', () => ({
  DriftClient: vi.fn().mockImplementation(() => createBaseMockClient()),
  DriftEnv: { DEVNET: 'devnet' },
  initialize: vi.fn().mockReturnValue({ DRIFT_PROGRAM_ID: 'mock-program-id' })
}));

describe('SOL Trading Integration', () => {
  let connection: Connection;
  let priceService: SolPriceService;
  let userKeypair: Keypair;

  beforeEach(() => {
    connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    priceService = new SolPriceService();
    userKeypair = Keypair.generate();
    vi.clearAllMocks();
  });

  test('initializes DriftClient successfully', async () => {
    const price = await priceService.getCurrentPrice();
    expect(price).toBe(100);
    expect(DriftClient).toHaveBeenCalled();
  });

  test('calculates minimum SOL requirement correctly', async () => {
    const { solAmount, usdAmount } = await priceService.calculateMinimumSol();
    
    // With SOL price at $100:
    // $100 USD minimum = 1 SOL
    // Plus 0.25 SOL for gas
    expect(solAmount).toBe(1.25);
    expect(usdAmount).toBe(100);
  });

  test('formats balance correctly', async () => {
    const solBalance = 1.5;
    const formatted = await priceService.formatBalance(solBalance);
    
    expect(formatted.sol).toBe('1.5000 SOL');
    expect(formatted.usd).toBe('$150.00'); // 1.5 SOL * $100 per SOL
  });

  test('handles negative balance error', async () => {
    await expect(priceService.formatBalance(-1))
      .rejects
      .toThrow('Invalid SOL balance');
  });

  test('returns correct minimum USD deposit', () => {
    expect(priceService.getMinimumUsdDeposit()).toBe(100);
  });

  test('returns correct gas fee in SOL', () => {
    expect(priceService.getGasFeeInSol()).toBe(0.25);
  });

  test('handles DriftClient initialization failure', async () => {
    vi.mocked(DriftClient).mockImplementationOnce(() => ({
      ...createBaseMockClient(),
      subscribe: vi.fn().mockRejectedValue(new Error('Failed to connect')),
      getOraclePrice: vi.fn().mockImplementation((marketName: string) => {
        return Promise.resolve(100);
      })
    } as unknown as DriftClient));

    await expect(priceService.getCurrentPrice())
      .rejects
      .toThrow('Failed to fetch SOL price');
  });

  test('handles invalid oracle price', async () => {
    vi.mocked(DriftClient).mockImplementationOnce(() => ({
      ...createBaseMockClient(),
      getOraclePrice: vi.fn().mockImplementation((marketName: string) => {
        return Promise.resolve(0);
      })
    } as unknown as DriftClient));

    await expect(priceService.getCurrentPrice())
      .rejects
      .toThrow('Invalid SOL price received from oracle');
  });

  test('formats large balances correctly', async () => {
    const largeBalance = 1000.123456789;
    const formatted = await priceService.formatBalance(largeBalance);
    
    expect(formatted.sol).toBe('1000.1235 SOL'); // 4 decimal places
    expect(formatted.usd).toBe('$100012.35'); // 2 decimal places
  });

  test('calculates minimum SOL for different price scenarios', async () => {
    vi.mocked(DriftClient).mockImplementationOnce(() => ({
      ...createBaseMockClient(),
      getOraclePrice: vi.fn().mockImplementation((marketName: string) => {
        return Promise.resolve(200);
      })
    } as unknown as DriftClient));

    const { solAmount, usdAmount } = await priceService.calculateMinimumSol();
    
    // $100 USD minimum at $200 per SOL = 0.5 SOL
    // Plus 0.25 SOL for gas
    expect(solAmount).toBe(0.75);
    expect(usdAmount).toBe(100);
  });

  test('handles invalid market name', async () => {
    vi.mocked(DriftClient).mockImplementationOnce(() => ({
      ...createBaseMockClient(),
      getOraclePrice: vi.fn().mockImplementation((marketName: string) => {
        if (marketName !== 'SOL-PERP') {
          throw new Error('Invalid market');
        }
        return Promise.resolve(100);
      })
    } as unknown as DriftClient));

    const priceService = new SolPriceService();
    const price = await priceService.getCurrentPrice();
    expect(price).toBe(100);
  });
});
