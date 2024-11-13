
# Wealthbot Devnet Testing Guide

## Prerequisites
1. Install [Phantom Wallet](https://phantom.app/) browser extension
2. Ensure you have the latest version of the application running
3. Development server should be running on port 3005

## Environment Setup

### 1. Docker Development Environment
```bash
# The app should be running on port 3005
# Verify by accessing http://localhost:3005
```

### 2. Devnet Configuration
The following environment variables are automatically configured:
- Network: Devnet
- Drift Program ID: dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH
- RPC URL: https://api.devnet.solana.com

## Testing Steps

### 1. Wallet Setup
1. Open Phantom wallet extension
2. Click on the settings gear icon
3. Select "Change Network"
4. Choose "Devnet"
5. Return to the Wealthbot application

### 2. Getting Devnet SOL
1. Connect your Phantom wallet to the application
2. The application will automatically request devnet SOL if balance is insufficient
3. Alternatively, you can get SOL from the devnet faucet:
   - Visit https://faucet.solana.com/devnet
   - Enter your wallet address
   - Request 2 SOL (default amount)

### 3. Testing Trading Flow

#### A. Initial Setup
1. Connect Phantom wallet (ensure it's in devnet mode)
2. Verify your SOL balance (minimum required: $100 worth of SOL + 0.25 SOL for gas)
3. Check that the wallet status shows "Connected" and "Devnet"

#### B. Account Initialization
1. Navigate to the trading dashboard
2. Click "Initialize Drift Account"
3. Approve the transaction in Phantom wallet
4. Wait for confirmation (this may take a few seconds)

#### C. Trading Operations
1. Start with a minimum deposit ($100 worth of SOL)
2. Initialize your Drift account
3. Configure trading parameters:
   - Leverage: 2x (default)
   - Position size: 0.1 SOL (minimum)
   - Stop loss: 5%
   - Take profit: 15%
4. Start automated trading
5. Monitor positions and P&L in the dashboard

### 4. Error Handling
Common errors and solutions:

1. "Please switch your Phantom wallet to Devnet network"
   - Solution: Change network in Phantom wallet settings

2. "Insufficient balance"
   - Solution: Request more SOL from devnet faucet

3. "Failed to initialize Drift account"
   - Solution: Retry the initialization process
   - Ensure you have enough SOL for gas fees

## Monitoring and Debugging

### Development Logs
- Check browser console for detailed logs
- Server logs available at development server output
- Trading activity logs in the dashboard

### Health Checks
1. Wallet Connection Status
2. Network Status (should show Devnet)
3. Account Balance
4. Drift Protocol Connection
5. Trading Bot Status

## Support and Resources

- Drift Protocol Documentation: [Drift Docs](https://docs.drift.trade/)
- Solana Devnet Explorer: [Explorer](https://explorer.solana.com/?cluster=devnet)
- Devnet Faucet: [Faucet](https://faucet.solana.com/devnet)

## Notes

- All trades are simulated on devnet; no real funds are at risk
- Gas fees are estimated at 0.25 SOL per transaction
- Minimum deposit requirement: $100 worth of SOL
- Keep extra SOL for gas fees and trading operations
- Regular monitoring of positions is recommended
- Test all features incrementally before running automated strategies
- Report any issues through the GitHub repository
