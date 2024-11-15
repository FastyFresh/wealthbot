import { render, screen, fireEvent } from '@testing-library/react';
import { WalletConnect } from './WalletConnect';
import type {} from '../../types/test-types';

// Create mock functions
const mockDisconnect = jest.fn();
const mockConnect = jest.fn();
const mockSignTransaction = jest.fn();
const mockSignAllTransactions = jest.fn();
const mockSignMessage = jest.fn();
const mockOn = jest.fn();
const mockRemoveListener = jest.fn();

// Mock window.alert
window.alert = jest.fn();

// Create mock Solana provider
const mockSolana: PhantomProvider = {
    publicKey: null,
    isConnected: false,
    networkVersion: 'devnet',
    signTransaction: mockSignTransaction,
    signAllTransactions: mockSignAllTransactions,
    signMessage: mockSignMessage,
    connect: mockConnect,
    disconnect: mockDisconnect,
    on: mockOn,
    removeListener: mockRemoveListener
};

// Mock the wallet adapter module
jest.mock('@solana/wallet-adapter-react', () => ({
    useWallet: jest.fn(),
    useConnection: jest.fn(() => ({
        connection: null
    }))
}));

// Get the mocked module
const { useWallet } = jest.requireMock('@solana/wallet-adapter-react');

describe('WalletConnect', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Default wallet state
        useWallet.mockReturnValue({
            connected: false,
            connecting: false,
            disconnect: mockDisconnect,
            connect: mockConnect,
            publicKey: null
        });

        // Set up window.solana before each test
        window.solana = {
            ...mockSolana,
            networkVersion: 'devnet',
            isConnected: false,
            publicKey: null
        };
    });

    afterEach(() => {
        // Clean up
        jest.clearAllMocks();
        delete window.solana;
    });

    it('renders wallet connection component', () => {
        render(<WalletConnect />);
        expect(screen.getByRole('button', { name: /Connect Wallet/i })).toBeInTheDocument();
        expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });

    it('shows connected status when wallet is connected', () => {
        useWallet.mockReturnValue({
            connected: true,
            connecting: false,
            disconnect: mockDisconnect,
            connect: mockConnect,
            publicKey: 'mock-public-key'
        });

        render(<WalletConnect />);
        expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    it('shows connecting status', () => {
        useWallet.mockReturnValue({
            connected: false,
            connecting: true,
            disconnect: mockDisconnect,
            connect: mockConnect,
            publicKey: null
        });

        render(<WalletConnect />);
        expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });

    it('handles disconnection', async () => {
        useWallet.mockReturnValue({
            connected: true,
            connecting: false,
            disconnect: mockDisconnect,
            connect: mockConnect,
            publicKey: 'mock-public-key'
        });

        render(<WalletConnect />);
        const disconnectButton = screen.getByRole('button', { name: /Disconnect/i });
        await fireEvent.click(disconnectButton);
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('handles connection', async () => {
        mockConnect.mockResolvedValueOnce(undefined);
        
        render(<WalletConnect />);
        const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
        await fireEvent.click(connectButton);
        
        expect(mockConnect).toHaveBeenCalled();
    });

    it('shows alert when not on devnet', async () => {
        window.solana = {
            ...mockSolana,
            networkVersion: 'mainnet',
            isConnected: false,
            publicKey: null
        };

        render(<WalletConnect />);
        const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
        await fireEvent.click(connectButton);

        expect(window.alert).toHaveBeenCalledWith('Please switch to Devnet network in your Phantom wallet');
        expect(mockConnect).not.toHaveBeenCalled();
    });
});
