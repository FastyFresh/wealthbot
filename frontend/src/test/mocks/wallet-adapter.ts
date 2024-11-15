import React, { ReactNode } from 'react';

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const useWallet = () => {
  return {
    publicKey: null,
    connected: false,
    connect: async () => {},
    disconnect: async () => {},
    signTransaction: async () => null,
    signAllTransactions: async () => [],
  };
};

export const useConnection = () => {
  return {
    connection: null,
  };
};
