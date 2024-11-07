# WealthBot - AI-Powered Trading Platform

WealthBot is a modern trading platform that combines machine learning with technical analysis to provide intelligent trading signals for cryptocurrency markets.

## Features

- 🤖 Machine Learning Price Predictions
- 📊 Real-time Technical Analysis
- 💹 Live Market Data Integration
- 🔄 Automated Trading Signals
- 📱 Responsive Design
- 🔒 Wallet Integration
- 🐳 Docker Support

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **ML**: TensorFlow.js
- **Technical Analysis**: TechnicalIndicators
- **Market Data**: CCXT
- **Styling**: Tailwind CSS
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (optional)

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

3. Start the development server:
```bash
npm run dev
```

### Docker Setup

1. Build the development container:
```bash
docker-compose up frontend-dev
```

2. Build for production:
```bash
docker-compose up frontend-prod
```

## ML Trading Strategy

The platform uses a sophisticated LSTM (Long Short-Term Memory) neural network to predict price movements:

- Input: 30 days of OHLCV (Open, High, Low, Close, Volume) data
- Features: Technical indicators (RSI, MACD, Bollinger Bands)
- Output: Price prediction and trading signals

### Trading Signals

- **Strong Buy**: Prediction > +2% and RSI < 70
- **Buy**: Prediction > +0.5% and RSI < 60
- **Strong Sell**: Prediction < -2% and RSI > 30
- **Sell**: Prediction < -0.5% and RSI > 40
- **Neutral**: All other conditions

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── trading/       # Trading components
│   │   └── wallet/        # Wallet integration
│   ├── services/
│   │   └── TradingStrategy.ts  # ML and trading logic
│   └── types/             # TypeScript definitions
├── Dockerfile            # Production build
├── Dockerfile.dev        # Development build
└── docker-compose.yml    # Docker configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- TensorFlow.js for ML capabilities
- CCXT for cryptocurrency market data
- TechnicalIndicators for analysis tools