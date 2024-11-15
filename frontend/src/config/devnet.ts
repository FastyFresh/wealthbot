import { PublicKey } from '@solana/web3.js';

export const DEVNET_CONFIG = {
    network: 'devnet',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    wsUrl: 'wss://api.devnet.solana.com/',
    programId: new PublicKey(import.meta.env.VITE_DRIFT_PROGRAM_ID || 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'),
    marketId: new PublicKey('11111111111111111111111111111111'), // This will be updated with actual market ID
};

export const isDriftInitialized = async (publicKey: PublicKey): Promise<boolean> => {
    try {
        // Here we would typically check if the user's account is initialized with Drift
        // For now, returning true for development
        return true;
    } catch (error) {
        console.error('Error checking Drift initialization:', error);
        return false;
    }
};
