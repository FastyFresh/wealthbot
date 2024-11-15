declare global {
    interface TestPhantomProvider {
        publicKey: string | null;
        isConnected: boolean;
        networkVersion: string;
        signTransaction: jest.Mock;
        signAllTransactions: jest.Mock;
        signMessage: jest.Mock;
        connect: jest.Mock;
        disconnect: jest.Mock;
        on: jest.Mock;
        removeListener: jest.Mock;
    }

    interface Window {
        solana?: TestPhantomProvider;
    }
}

export {};
