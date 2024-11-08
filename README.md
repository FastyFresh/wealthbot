
# Wealthbot: Autonomous Trading dApp on Solana

## Objective
Wealthbot aims to help users grow their equity autonomously by trading SOL perpetuals on the Drift Protocol within the Solana blockchain. The app uses agent-driven operations inspired by hedge fund strategies, targeting long-term compounded growth with a goal of reaching $1,000,000 in equity over 3-5 years.

## Core Features

### 1. User Access
- Wallet-Based Login: Users access Wealthbot via their Phantom wallet with no additional sign-up requirements
- Minimum Investment: Requires a $125 SOL balance to start, with a $100 minimum investment

### 2. Autonomous Trading Engine
The system employs multiple specialized agents working in concert:

- **Trading Agent**: Executes SOL perpetual trades on Drift Protocol
- **Risk Management Agent**: Uses machine learning to dynamically manage risk exposure
- **Strategy Agent**: Optimizes trading strategies using real-time data for compounded growth
- **Research Agent**: Tracks SOL and Drift Protocol trends for strategy adjustments
- **Backtesting Agent**: Validates strategies with historical data

### 3. User Dashboard
- Displays key metrics like profit/loss, daily compounded growth rate, open trades, and equity status
- Real-Time Strategy Updates: Shows live adjustments while limiting notifications to critical updates

### 4. Technical Stack

#### Frontend
- React.js with a modern UI
- Integration with Phantom Wallet
- Real-time data visualization

#### Backend
- Node.js, Python, and optional Rust for secure on-chain operations
- Machine Learning: TensorFlow or PyTorch for real-time strategy and risk adjustments

#### Development Platform
- Built and deployed on Replit
- Integrates Solana Web3.js and Drift Protocol SDK

## Key Differentiator
Wealthbot stands out for its agent-driven, hedge-fund-style trading strategy on a decentralized platform, targeting significant long-term equity growth for users with minimal intervention.

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/FastyFresh/wealthbot.git

# Install dependencies
cd wealthbot/frontend
npm install

# Start the development server
npm run dev
```

## Architecture

The system is built around several key agents:

1. **Trading Agent** (`src/agents/TradingAgent.ts`)
   - Executes trades based on strategy signals
   - Manages position sizing and entry/exit points
   - Integrates with Drift Protocol

2. **Strategy Agent** (`src/agents/StrategyAgent.ts`)
   - Implements trading strategies
   - Manages strategy performance metrics
   - Adapts to market conditions

3. **Backtesting Agent** (`src/agents/BacktestingAgent.ts`)
   - Simulates strategies on historical data
   - Calculates performance metrics
   - Validates strategy effectiveness

4. **Research Agent** (`src/agents/ResearchAgent.ts`)
   - Analyzes market trends
   - Processes market data and news
   - Provides strategy recommendations

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
