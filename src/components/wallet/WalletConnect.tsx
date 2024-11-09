
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { theme } from '../../config/theme';
import clsx from 'clsx';

export const WalletConnect: React.FC = () => {
  const { connected, publicKey, connecting } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {connected && publicKey && (
        <div className="text-sm text-slate-300">
          <div className="font-medium">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </div>
        </div>
      )}
      <WalletMultiButton
        className={clsx(
          'px-4 py-2 rounded-lg font-medium transition-all duration-200',
          'bg-gradient-to-r from-blue-500 to-blue-600',
          'hover:from-blue-600 hover:to-blue-700',
          'text-white shadow-lg hover:shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
          connecting && 'opacity-75 cursor-not-allowed'
        )}
        style={{
          background: connecting ? theme.colors.primary.surface : undefined,
          borderColor: theme.colors.primary.accent,
        }}
      />
    </div>
  );
};
