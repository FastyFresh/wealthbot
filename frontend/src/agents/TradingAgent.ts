import { Connection, PublicKey } from '@solana/web3.js';

export interface AgentConfig {
    maxPositionSize: number;
    stopLossPercentage: number;
    takeProfitPercentage: number;
}

export class TradingAgent {
    protected connection: Connection;
    protected userPublicKey: PublicKey;
    protected config: AgentConfig;

    constructor(
        connection: Connection,
        userPublicKey: PublicKey,
        config: AgentConfig
    ) {
        this.connection = connection;
        this.userPublicKey = userPublicKey;
        this.config = config;
        this.validateConfig(config);
    }

    private validateConfig(config: AgentConfig): void {
        if (config.maxPositionSize <= 0) {
            throw new Error('maxPositionSize must be greater than 0');
        }
        if (config.stopLossPercentage <= 0 || config.stopLossPercentage >= 100) {
            throw new Error('stopLossPercentage must be between 0 and 100');
        }
        if (config.takeProfitPercentage <= 0 || config.takeProfitPercentage >= 100) {
            throw new Error('takeProfitPercentage must be between 0 and 100');
        }
    }

    protected async validateConnection(): Promise<boolean> {
        try {
            await this.connection.getVersion();
            return true;
        } catch (error) {
            console.error('Connection validation failed:', error);
            return false;
        }
    }

    protected calculatePositionSize(price: number, balance: number): number {
        const maxPosition = Math.min(
            this.config.maxPositionSize,
            balance * 0.95 // Leave 5% for fees and slippage
        );
        return Math.floor(maxPosition / price);
    }

    protected calculateStopLoss(entryPrice: number, positionType: 'long' | 'short'): number {
        const stopLossMultiplier = this.config.stopLossPercentage / 100;
        return positionType === 'long'
            ? entryPrice * (1 - stopLossMultiplier)
            : entryPrice * (1 + stopLossMultiplier);
    }

    protected calculateTakeProfit(entryPrice: number, positionType: 'long' | 'short'): number {
        const takeProfitMultiplier = this.config.takeProfitPercentage / 100;
        return positionType === 'long'
            ? entryPrice * (1 + takeProfitMultiplier)
            : entryPrice * (1 - takeProfitMultiplier);
    }

    public async getBalance(): Promise<number> {
        try {
            const balance = await this.connection.getBalance(this.userPublicKey);
            return balance / 1e9; // Convert lamports to SOL
        } catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }
}
