import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { StatusIndicator } from './StatusIndicator';
import { ConnectButton } from './ConnectButton';
import { WalletInfo } from './WalletInfo';

export const WalletConnect: React.FC = () => {
  const { connected, connecting, disconnect, connect, publicKey } = useWallet();
  const { connection } = useConnection();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  useEffect(() => {
    if (!connected) return;
    
    const checkNetwork = async () => {
      try {
        const currentEndpoint = connection.rpcEndpoint;
        setIsCorrectNetwork(currentEndpoint.includes('devnet'));
      } catch (error) {
        console.error('Network check error:', error);
      }
    };

    checkNetwork();
  }, [connected, connection]);

  return (
    <div className="flex flex-col items-start gap-4 p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
      <div className="flex items-center justify-between w-full">
        <StatusIndicator 
          connected={connected} 
          isCorrectNetwork={isCorrectNetwork} 
        />
        <ConnectButton
          connected={connected}
          connecting={connecting}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      </div>
      {connected && publicKey && (
        <WalletInfo
          publicKey={publicKey}
          isCorrectNetwork={isCorrectNetwork}
        />
      )}
    </div>
  );
};