
import { Connection, PublicKey } from '@solana/web3.js';
import { DriftClient, DriftEnv, initialize } from '@drift-labs/sdk';

export class SolPriceService {
  private connection: Connection;
  private driftClient: DriftClient | null = null;
  private readonly MIN_USD_DEPOSIT = 100;
  private readonly GAS_FEE_SOL = 0.25;

  constructor() {
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  }

  private async initializeDriftClient(): Promise<void> {
    if (!this.driftClient) {
      const driftConfig = initialize({ env: DriftEnv.DEVNET });
      this.driftClient = new DriftClient({
        connection: this.connection,
        wallet: null, // We only need price data, no wallet required
        programID: new PublicKey(driftConfig.DRIFT_PROGRAM_ID),
        env: DriftEnv.DEVNET,
      });
      await this.driftClient.subscribe();
    }
  }

  async getCurrentPrice(): Promise<number> {
    try {
      await this.initializeDriftClient();
      if (!this.driftClient) {
        throw new Error('DriftClient not initialized');
      }

      const solPrice = await this.driftClient.getOraclePrice('SOL-PERP');
      if (!solPrice || solPrice <= 0) {
        throw new Error('Invalid SOL price received from oracle');
      }

      return solPrice;
    } catch (error) {
      throw new Error(`Failed to fetch SOL price: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async calculateMinimumSol(): Promise<{solAmount: number, usdAmount: number}> {
    try {
      const currentPrice = await this.getCurrentPrice();
      const solAmount = (this.MIN_USD_DEPOSIT / currentPrice) + this.GAS_FEE_SOL;
      
      return {
        solAmount,
        usdAmount: this.MIN_USD_DEPOSIT
      };
    } catch (error) {
      throw new Error(`Failed to calculate minimum SOL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async formatBalance(solBalance: number): Promise<{
    sol: string;
    usd: string;
  }> {
    try {
      if (solBalance < 0) {
        throw new Error('Invalid SOL balance');
      }

      const price = await this.getCurrentPrice();
      const usdValue = solBalance * price;

      return {
        sol: `${solBalance.toFixed(4)} SOL`,
        usd: `$${usdValue.toFixed(2)}`
      };
    } catch (error) {
      throw new Error(`Failed to format balance: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getMinimumUsdDeposit(): number {
    return this.MIN_USD_DEPOSIT;
  }

  getGasFeeInSol(): number {
    return this.GAS_FEE_SOL;
  }
}
