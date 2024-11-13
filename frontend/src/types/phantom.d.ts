
interface PhantomProvider {
  isPhantom?: boolean;
  networkVersion?: string;
  connect: () => Promise<{ publicKey: string }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
}

interface Window {
  solana?: PhantomProvider;
}
