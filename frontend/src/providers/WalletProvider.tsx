
import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { DEVNET_CONFIG } from '../config/devnet';

interface Props {
  children: ReactNode;
}

export const WalletProvider: FC<Props> = ({ children }) => {
  // You can add more wallets here
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={DEVNET_CONFIG.endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export const useWallet = () => {
  const { connected, publicKey, connecting, disconnect, connect, wallet } = 
    require('@solana/wallet-adapter-react').useWallet();

  return {
    connected,
    publicKey,
    connecting,
    error: null,
    connect: async () => {
      try {
        await connect();
      } catch (error) {
        console.error('Failed to connect:', error);
        throw error;
      }
    },
    disconnect: async () => {
      try {
        await disconnect();
      } catch (error) {
        console.error('Failed to disconnect:', error);
        throw error;
      }
    }
  };
};
