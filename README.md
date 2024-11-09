
# WealthBot Trading Dashboard

A sophisticated trading dashboard built with React, Solana, and the Drift Protocol. This platform provides a professional trading experience with real-time market data, advanced charting, and AI-powered trading capabilities.

## Features

- 📊 Professional Trading Interface
  - Advanced charting with TradingView integration
  - Real-time order book
  - Position management
  - Market and limit orders

- 🔐 Secure Wallet Integration
  - Phantom wallet support
  - Devnet compatibility
  - Secure transaction handling
  - Multi-signature support

- 📈 Trading Features
  - Multiple timeframe support
  - Technical indicators (MA20, MA50)
  - Real-time price updates
  - Position tracking

- 🎨 Modern UI/UX
  - Dark mode optimized
  - Responsive design
  - Clean, professional interface
  - Intuitive controls

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Solana Web3.js
- Drift Protocol SDK
- Lightweight Charts for technical analysis

## Prerequisites

- Node.js 18+
- Phantom Wallet browser extension
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

The application will be available at `http://localhost:8081`

## Development Setup

1. Install Phantom Wallet from the Chrome Web Store
2. Switch to Solana Devnet
3. Get some devnet SOL (you can use the airdrop feature)
4. Connect your wallet to the application

## Project Structure

```
src/
├── components/         # React components
│   ├── common/        # Shared components
│   ├── trading/       # Trading-specific components
│   └── wallet/        # Wallet integration components
├── providers/         # Context providers
├── services/         # Business logic and API integration
├── config/           # Configuration files
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Drift Protocol](https://www.drift.trade/) for the trading infrastructure
- [Solana](https://solana.com/) for the blockchain platform
- [Phantom](https://phantom.app/) for the wallet integration
- [TradingView](https://www.tradingview.com/) for charting libraries

## Security

This project is currently in development and not ready for production use. Use on mainnet at your own risk.

## Support

For support, please open an issue in the GitHub repository.
