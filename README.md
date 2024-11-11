
# Wealthbot: Autonomous Trading dApp

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/FastyFresh/wealthbot.git
cd wealthbot
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the application:
- Open https://localhost:3001 in your browser
- Connect your Phantom wallet (devnet)
- Ensure you have minimum $125 SOL for gas fees
- Start trading with minimum $100 SOL deposit

## Development Setup

### Prerequisites
- Node.js 18 or higher
- Phantom Wallet browser extension
- Git

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at https://localhost:3001. The development server includes:
- Hot reloading
- HTTPS for Phantom wallet compatibility
- Devnet connection for testing

### Testing
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Features
- Autonomous trading system targeting $1M
- Real-time progress tracking
- Risk-adjusted strategy optimization
- Secure wallet integration
- Comprehensive performance analytics

## Architecture
- React 18 with TypeScript
- Vite for fast development
- Solana Web3.js for blockchain integration
- TailwindCSS for styling
- Phantom Wallet integration

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENS