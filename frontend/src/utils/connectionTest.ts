import { Connection, PublicKey } from '@solana/web3.js';
import { DriftClient, DriftEnv } from '@drift-labs/sdk';
import { DEVNET_CONFIG } from '../config/devnet';

export interface ConnectionStatus {
  solana: {
    connected: boolean;
    latency?: number;
    error?: string;
  };
  drift: {
    connected: boolean;
    markets?: number;
    error?: string;
  };
}

export async function testConnections(userPublicKey?: PublicKey): Promise<ConnectionStatus> {
  const status: ConnectionStatus = {
    solana: { connected: false },
    drift: { connected: false }
  };

  const connection = new Connection(DEVNET_CONFIG.rpcUrl);
  const start = Date.now();
  await connection.getVersion();
  status.solana.connected = true;
  status.solana.latency = Date.now() - start;

  return status;
}