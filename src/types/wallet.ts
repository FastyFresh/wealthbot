export interface WalletState {
  connected: boolean;
  error: string | null;
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}
