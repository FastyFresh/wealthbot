# Wealthbot: Autonomous Trading dApp on Solana

## Objective
Wealthbot aims to help users grow their equity autonomously by trading SOL perpetuals on the Drift Protocol within the Solana blockchain. The app uses agent-driven operations inspired by hedge fund strategies, targeting long-term compounded growth with a goal of reaching $1,000,000 in equity over 3-5 years.

## Core Features

### 1. Professional Trading Interface
- 📊 Advanced charting with Lightweight Charts
- 📈 Real-time order book and market depth
- 💼 Position management and tracking
- 🎯 Market, limit, and stop orders

### 2. Autonomous Trading Engine
The system employs multiple specialized agents working in concert:

- **Trading Agent**: Executes SOL perpetual trades on Drift Protocol
- **Risk Management Agent**: Uses machine learning to dynamically manage risk exposure
- **Strategy Agent**: Optimizes trading strategies using real-time data for compounded growth
- **Research Agent**: Tracks SOL and Drift Protocol trends for strategy adjustments
- **Backtesting Agent**: Validates strategies with historical data

### 3. Secure Wallet Integration
- 🔐 Phantom wallet support
- 💫 Devnet and mainnet compatibility
- 🔑 Secure transaction handling
- 💰 Simple deposit and withdrawal process

### 4. Modern UI/UX
- 🌙 Dark mode optimized for trading
- 📱 Fully responsive design
- 🎨 Clean, professional interface
- 🎯 Intuitive trading controls

## Tech Stack

### Frontend
- React 18.3 with TypeScript
- Vite 5.4 for fast development
- Tailwind CSS for styling
- Lightweight Charts for technical analysis

### Blockchain
- Solana Web3.js
- Drift Protocol SDK
- Phantom Wallet integration
- Anchor Framework

## Getting Started

### Prerequisites
- Node.js 20+
- Phantom Wallet browser extension
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FastyFresh/wealthbot.git
cd wealthbot/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Development Setup

1. Install Phantom Wallet from the Chrome Web Store
2. Switch to Solana Devnet
3. Get some devnet SOL (you can use the airdrop feature)
4. Connect your wallet to the application

## Project Structure

```
src/
├── agents/            # Trading and research agents
├── components/        # React components
│   ├── common/       # Shared components
│   ├── trading/      # Trading-specific components
│   └── wallet/       # Wallet integration components
├── providers/        # Context providers
├── services/        # Business logic and API integration
├── config/          # Configuration files
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Docker Support

Development:
```bash
docker-compose up frontend-dev
```

Production:
```bash
docker-compose up frontend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This project is currently in development and not ready for production use. Use on mainnet at your own risk.

## Support

For support, please open an issue in the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Drift Protocol](https://www.drift.trade/) for the trading infrastructure
- [Solana](https://solana.com/) for the blockchain platform
- [Phantom](https://phantom.app/) for the wallet integration
- [Lightweight Charts](https://www.tradingview.com/lightweight-charts/) for charting library