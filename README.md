# Wealthbot: Autonomous Trading dApp on Solana

A sophisticated trading dashboard built with React, Solana, and the Drift Protocol. This platform provides a professional trading experience with real-time market data, advanced charting, and AI-powered trading capabilities.

## Objective
Wealthbot aims to help users grow their equity autonomously by trading SOL perpetuals on the Drift Protocol within the Solana blockchain. The app uses agent-driven operations inspired by hedge fund strategies, targeting long-term compounded growth with a goal of reaching $1,000,000 in equity over 3-5 years.

## Core Features

### 1. Professional Trading Interface
- 📊 Advanced charting with TradingView integration
- 📈 Real-time order book and market depth
- 💼 Position management and tracking
- 🎯 Market, limit, and stop orders

### 2. Autonomous Trading Engine
The system employs multiple specialized agents working in concert:

- **Trading Agent**: Executes SOL perpetual trades on Drift Protocol
- **Risk Management Agent**: Uses machine learning to dynamically manage risk exposure
- **Strategy Agent**: Optimizes trading strategies using real-time data
- **Research Agent**: Tracks SOL and Drift Protocol trends
- **Backtesting Agent**: Validates strategies with historical data

### 3. Secure Wallet Integration
- 🔐 Phantom wallet support with secure transaction handling
- 💫 Solana devnet and mainnet compatibility
- 🔑 Multi-signature support for enhanced security
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

### Development
- Node.js 20+
- Docker support
- ESLint and TypeScript for code quality
- Vitest for testing

## Getting Started

### Prerequisites
- Node.js 20+
- Phantom Wallet browser extension
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wealthbot.git
cd wealthbot
```

2. Install dependencies:
```bash
cd frontend
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

This project is currently in development. Use on mainnet at your own risk.

## Support

For support, please open an issue in the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Drift Protocol](https://www.drift.trade/) for the trading infrastructure
- [Solana](https://solana.com/) for the blockchain platform
- [Phantom](https://phantom.app/) for the wallet integration
- [TradingView](https://www.tradingview.com/) for charting libraries