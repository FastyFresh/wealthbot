import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers as any)

// Mock Solana Web3 Connection
vi.mock('@solana/web3.js', async () => {
  const actual = await vi.importActual('@solana/web3.js')
  return {
    ...actual,
    Connection: vi.fn().mockImplementation(() => ({
      requestAirdrop: vi.fn().mockResolvedValue('airdrop-signature'),
      confirmTransaction: vi.fn().mockResolvedValue(true),
      getBalance: vi.fn().mockResolvedValue(1000000000), // 1 SOL
    })),
  }
})

// Mock Drift SDK
vi.mock('@drift-labs/sdk', async () => {
  const actual = await vi.importActual('@drift-labs/sdk')
  return {
    ...actual,
    DriftClient: vi.fn().mockImplementation(() => ({
      subscribe: vi.fn().mockResolvedValue(undefined),
      getPerpMarkets: vi.fn().mockResolvedValue([
        {
          name: 'SOL-PERP',
          marketIndex: 0,
          price: { toNumber: () => 100 },
          currentFundingRate: { toNumber: () => 0.001 },
        },
      ]),
      getPositions: vi.fn().mockResolvedValue([]),
      placeOrder: vi.fn().mockResolvedValue('tx-signature'),
      getUser: vi.fn().mockReturnValue({
        getCollateralValue: vi.fn().mockResolvedValue({ toNumber: () => 1000 }),
      }),
    })),
    BN: vi.fn().mockImplementation((value) => ({
      toNumber: () => Number(value),
      gt: (other) => Number(value) > Number(other),
      isZero: () => Number(value) === 0,
    })),
  }
})

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
