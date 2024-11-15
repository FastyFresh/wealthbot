import React from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { DEVNET_CONFIG } from '../config/devnet';
import { clusterApiUrl } from '@solana/web3.js';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function NetworkWarning() {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [showWarning, setShowWarning] = React.useState(false);

  React.useEffect(() => {
    if (!wallet?.adapter.connected) return;

    const checkNetwork = async () => {
      try {
        const currentEndpoint = connection.rpcEndpoint;
        const isDevnet = currentEndpoint.includes('devnet');
        setShowWarning(!isDevnet);
      } catch (error) {
        console.error('Error checking network:', error);
        setShowWarning(true);
      }
    };

    checkNetwork();
  }, [connection, wallet?.adapter.connected]);

  if (!showWarning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center">
      Please switch to Solana Devnet in your Phantom wallet settings
    </div>
  );
}

export function WalletProvider({ children }: Props): JSX.Element {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = DEVNET_CONFIG.rpcUrl || clusterApiUrl(network);
  const wallet = new PhantomWalletAdapter({ network });

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={[wallet]} autoConnect={true}>
        <NetworkWarning />
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}