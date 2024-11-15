import '@testing-library/jest-dom';

// Mock window methods
Object.defineProperty(window, 'alert', {
    writable: true,
    value: jest.fn()
});

// Mock solana object
Object.defineProperty(window, 'solana', {
    writable: true,
    value: {
        networkVersion: 'devnet',
        connect: jest.fn(),
        disconnect: jest.fn()
    }
});

// Mock web3 modules
jest.mock('@solana/web3.js', () => ({
    Connection: jest.fn(() => ({
        getVersion: jest.fn().mockResolvedValue({ 'feature-set': 0 }),
        getBalance: jest.fn().mockResolvedValue(1000000000)
    })),
    PublicKey: jest.fn((key) => ({
        toString: () => key,
        toBase58: () => key
    }))
}));

// Mock wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
    useWallet: jest.fn(() => ({
        connected: false,
        connecting: false,
        disconnect: jest.fn(),
        connect: jest.fn(),
        publicKey: null
    })),
    useConnection: jest.fn(() => ({
        connection: null
    }))
}));

// Global setup
beforeAll(() => {
    // Add any required global setup
});

// Global cleanup
afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    jest.resetModules();
});
