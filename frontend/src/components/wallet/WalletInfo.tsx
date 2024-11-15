import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { DEVNET_CONFIG } from '../../config/devnet';

interface WalletInfoProps {
  publicKey: PublicKey;
  isCorrectNetwork: boolean;
}

export const WalletInfo: React.FC<WalletInfoProps> = (props) => {
  const { publicKey, isCorrectNetwork } = props;
  const address = publicKey.toString();
  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
  const networkName = isCorrectNetwork ? DEVNET_CONFIG.network : 'Wrong Network';
  const networkClass = isCorrectNetwork 
    ? 'bg-blue-500/20 text-blue-300'
    : 'bg-yellow-500/20 text-yellow-300';

  const content = [
    React.createElement('p', { 
      key: 'address',
      className: 'flex items-center justify-between'
    }, [
      React.createElement('span', { key: 'label', className: 'text-slate-400' }, 'Address:'),
      React.createElement('span', { key: 'value', className: 'font-mono' }, shortAddress)
    ]),
    React.createElement('p', { 
      key: 'network',
      className: 'flex items-center justify-between mt-1'
    }, [
      React.createElement('span', { key: 'label', className: 'text-slate-400' }, 'Network:'),
      React.createElement('span', { 
        key: 'value',
        className: `px-2 py-0.5 rounded ${networkClass}`
      }, networkName)
    ])
  ];

  if (!isCorrectNetwork) {
    content.push(
      React.createElement('p', {
        key: 'warning',
        className: 'mt-2 text-yellow-300 text-xs'
      }, 'Please switch to Solana Devnet in your Phantom wallet settings')
    );
  }

  return React.createElement('div', {
    className: 'text-sm text-slate-300 bg-slate-700/50 p-3 rounded-md w-full',
    children: content
  });
};