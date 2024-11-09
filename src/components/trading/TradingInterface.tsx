import React, { useState, useEffect } from 'react';
import { useWallet } from '../../providers/WalletProvider';

interface OrderFormData {
  type: 'MARKET' | 'LIMIT' | 'STOP';
  side: 'BUY' | 'SELL';
  amount: number;
  price?: number;
  stopPrice?: number;
}

interface MarketData {
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

const TradingInterface: React.FC = () => {
  const { balance, isLoading } = useWallet();
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    type: 'MARKET',
    side: 'BUY',
    amount: 0
  });

  const [marketData, setMarketData] = useState<MarketData>({
    price: 0,
    change24h: 0,
    volume24h: 0,
    high24h: 0,
    low24h: 0
  });

  useEffect(() => {
    // Simulate real-time market data updates
    const interval = setInterval(() => {
      const basePrice = 100;
      const randomChange = (Math.random() - 0.5) * 5;
      const newPrice = basePrice + randomChange;
      
      setMarketData({
        price: newPrice,
        change24h: (randomChange / basePrice) * 100,
        volume24h: Math.random() * 1000000,
        high24h: newPrice + Math.random() * 5,
        low24h: newPrice - Math.random() * 5
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitOrder = async () => {
    try {
      // Implement order submission logic
      console.log('Submitting order:', orderForm);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Market Data Panel */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-baseline">
            <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
            <div className={`text-sm ${marketData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {marketData.change24h.toFixed(2)}%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            ${marketData.price.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">24h Volume</p>
            <p className="text-lg font-semibold text-gray-900">
              ${marketData.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">24h High</p>
            <p className="text-lg font-semibold text-gray-900">
              ${marketData.high24h.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">24h Low</p>
            <p className="text-lg font-semibold text-gray-900">
              ${marketData.low24h.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-lg font-semibold text-gray-900">
              {isLoading ? '...' : `${balance?.available.toFixed(4) || 0} SOL`}
            </p>
          </div>
        </div>

        {/* Trading Chart */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Trading Chart</p>
            <p className="text-sm text-gray-400">Real-time price chart integration coming soon</p>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Place Order</h3>
        
        <div className="space-y-6">
          {/* Order Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Type
            </label>
            <select
              value={orderForm.type}
              onChange={(e) => setOrderForm({ ...orderForm, type: e.target.value as OrderFormData['type'] })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="MARKET">Market</option>
              <option value="LIMIT">Limit</option>
              <option value="STOP">Stop</option>
            </select>
          </div>

          {/* Buy/Sell Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Side
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOrderForm({ ...orderForm, side: 'BUY' })}
                className={`py-2 px-4 rounded-md ${
                  orderForm.side === 'BUY'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderForm({ ...orderForm, side: 'SELL' })}
                className={`py-2 px-4 rounded-md ${
                  orderForm.side === 'SELL'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (SOL)
            </label>
            <input
              type="number"
              value={orderForm.amount}
              onChange={(e) => setOrderForm({ ...orderForm, amount: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Price Inputs (for Limit and Stop orders) */}
          {orderForm.type !== 'MARKET' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {orderForm.type === 'LIMIT' ? 'Limit Price' : 'Stop Price'} (USD)
              </label>
              <input
                type="number"
                value={orderForm.type === 'LIMIT' ? orderForm.price : orderForm.stopPrice}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setOrderForm({
                    ...orderForm,
                    ...(orderForm.type === 'LIMIT'
                      ? { price: value }
                      : { stopPrice: value })
                  });
                }}
                min="0"
                step="0.01"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Order Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Order Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-900">{orderForm.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Side</span>
                <span className={orderForm.side === 'BUY' ? 'text-green-600' : 'text-red-600'}>
                  {orderForm.side}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="text-gray-900">{orderForm.amount} SOL</span>
              </div>
              {orderForm.type !== 'MARKET' && (
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {orderForm.type === 'LIMIT' ? 'Limit Price' : 'Stop Price'}
                  </span>
                  <span className="text-gray-900">
                    ${orderForm.type === 'LIMIT' ? orderForm.price : orderForm.stopPrice}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={isLoading || orderForm.amount <= 0}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading || orderForm.amount <= 0
                ? 'bg-gray-400 cursor-not-allowed'
                : orderForm.side === 'BUY'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? 'Processing...' : `Place ${orderForm.side} Order`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;