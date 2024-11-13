import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import App from './App';

// Import styles
import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';

const endpoint = clusterApiUrl('devnet');
const wallets = [new PhantomWalletAdapter()];

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>
);
