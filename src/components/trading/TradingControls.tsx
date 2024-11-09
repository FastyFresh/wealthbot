
import React, { useState } from 'react';
import clsx from 'clsx';
import { theme } from '../../config/theme';
import { DriftOrder } from '../../services/DriftService';

interface TradingControlsProps {
  onSubmitOrder: (order: DriftOrder) => Promise<void>;
  maxLeverage?: number;
  availableBalance: number;
  className?: string;
}

export const TradingControls: React.FC<TradingControlsProps> = ({
  onSubmitOrder,
  maxLeverage = 20,
  availableBalance,
  className
}) => {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [size, setSize] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [leverage, setLeverage] = useState<number>(1);
  const [market, setMarket] = useState<string>('0'); // Default to market index 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order: DriftOrder = {
      market,
      type: orderType,
      direction: side === 'buy' ? 'long' : 'short',
      size: Number(size),
      price: Number(price || 0),
      leverage,
    };
    onSubmitOrder(order);
  };

  const leverageOptions = [1, 2, 5, 10, 20].filter(lev => lev <= maxLeverage);

  return (
    <form 
      onSubmit={handleSubmit}
      className={clsx(
        'bg-slate-900 rounded-lg border border-slate-700 p-4',
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
        className
      )}
    >
      {/* Market Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Market</label>
        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className={clsx(
            'w-full px-3 py-2 bg-slate-800 rounded-md',
            'border border-slate-700 focus:border-blue-500',
            'text-slate-200 placeholder-slate-400',
            'focus:outline-none focus:ring-1 focus:ring-blue-500'
          )}
        >
          <option value="0">SOL-PERP</option>
          <option value="1">BTC-PERP</option>
          <option value="2">ETH-PERP</option>
        </select>
      </div>

      {/* Order Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Order Type</label>
        <div className="flex rounded-md overflow-hidden border border-slate-700">
          {(['market', 'limit', 'stop'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={clsx(
                'flex-1 px-4 py-2 text-sm font-medium capitalize',
                'transition-colors duration-200',
                orderType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Buy/Sell Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Side</label>
        <div className="flex rounded-md overflow-hidden border border-slate-700">
          <button
            type="button"
            onClick={() => setSide('buy')}
            className={clsx(
              'flex-1 px-4 py-2 text-sm font-medium',
              'transition-colors duration-200',
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
          >
            Long
          </button>
          <button
            type="button"
            onClick={() => setSide('sell')}
            className={clsx(
              'flex-1 px-4 py-2 text-sm font-medium',
              'transition-colors duration-200',
              side === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
          >
            Short
          </button>
        </div>
      </div>

      {/* Size Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Size (Max: {(availableBalance * leverage).toFixed(2)})
        </label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          min="0"
          max={availableBalance * leverage}
          step="0.01"
          required
          className={clsx(
            'w-full px-3 py-2 bg-slate-800 rounded-md',
            'border border-slate-700 focus:border-blue-500',
            'text-slate-200 placeholder-slate-400',
            'focus:outline-none focus:ring-1 focus:ring-blue-500'
          )}
          placeholder="Enter size..."
        />
      </div>

      {/* Price Input (for Limit and Stop orders) */}
      {orderType !== 'market' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            {orderType === 'stop' ? 'Stop Price' : 'Limit Price'}
          </label>
          <input
            type="number"
            value={orderType === 'stop' ? stopPrice : price}
            onChange={(e) => 
              orderType === 'stop' 
                ? setStopPrice(e.target.value)
                : setPrice(e.target.value)
            }
            min="0"
            step="0.01"
            required
            className={clsx(
              'w-full px-3 py-2 bg-slate-800 rounded-md',
              'border border-slate-700 focus:border-blue-500',
              'text-slate-200 placeholder-slate-400',
              'focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
            placeholder={`Enter ${orderType === 'stop' ? 'stop' : 'limit'} price...`}
          />
        </div>
      )}

      {/* Leverage Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Leverage (×)
        </label>
        <div className="flex rounded-md overflow-hidden border border-slate-700">
          {leverageOptions.map((lev) => (
            <button
              key={lev}
              type="button"
              onClick={() => setLeverage(lev)}
              className={clsx(
                'flex-1 px-2 py-2 text-sm font-medium',
                'transition-colors duration-200',
                leverage === lev
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              )}
            >
              {lev}×
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2 lg:col-span-4">
        <button
          type="submit"
          className={clsx(
            'w-full px-4 py-2 rounded-md font-medium',
            'transition-colors duration-200',
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          )}
        >
          {side === 'buy' ? 'Long' : 'Short'} {orderType.toUpperCase()}
        </button>
      </div>
    </form>
  );
};
