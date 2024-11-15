interface Window {
  solana?: {
    isPhantom?: boolean;
    networkVersion?: string;
    connect: () => Promise<{ publicKey: string }>;
    disconnect: () => Promise<void>;
    signTransaction: (transaction: any) => Promise<any>;
    signAllTransactions: (transactions: any[]) => Promise<any[]>;
    signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    request: (method: string, params: any) => Promise<any>;
    on: (event: string, callback: (args: any) => void) => void;
    removeListener: (event: string, callback: (args: any) => void) => void;
  };
}

export {};
