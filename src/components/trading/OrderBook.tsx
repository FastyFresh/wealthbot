
import React from 'react';
import { theme } from '../../config/theme';
import clsx from 'clsx';

interface Order {
  price: number;
  size: number;
  total: number;
}

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
  spread: number;
  className?: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  bids,
  asks,
  spread,
  className
}) => {
  const maxTotal = Math.max(
    ...bids.map(bid => bid.total),
    ...asks.map(ask => ask.total)
  );

  const renderOrders = (orders: Order[], type: 'bid' | 'ask') => {
    const isAsk = type === 'ask';
    const sortedOrders = [...orders].sort((a, b) => 
      isAsk ? a.price - b.price : b.price - a.price
    );

    return sortedOrders.map((order, index) => (
      <div
        key={`${type}-${index}`}
        className={clsx(
          'grid grid-cols-3 py-1 px-2 text-sm font-mono',
          'hover:bg-slate-800/50 transition-colors',
          'cursor-default select-none'
        )}
        style={{
          background: `linear-gradient(to ${isAsk ? 'left' : 'right'}, 
            ${isAsk ? theme.colors.trading.loss : theme.colors.trading.profit}15 
            ${(order.total / maxTotal) * 100}%, 
            transparent ${(order.total / maxTotal) * 100}%)`
        }}
      >
        <span className={clsx(
          'text-right',
          isAsk ? 'text-red-500' : 'text-green-500'
        )}>
          {order.price.toFixed(2)}
        </span>
        <span className="text-right text-slate-300">{order.size.toFixed(4)}</span>
        <span className="text-right text-slate-400">{order.total.toFixed(4)}</span>
      </div>
    ));
  };

  return (
    <div className={clsx(
      'flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700',
      'overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="grid grid-cols-3 px-2 py-3 text-xs font-semibold text-slate-400 border-b border-slate-700">
        <span className="text-right">PRICE</span>
        <span className="text-right">SIZE</span>
        <span className="text-right">TOTAL</span>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="flex-1 overflow-y-auto">
        {renderOrders(asks, 'ask')}
      </div>

      {/* Spread */}
      <div className="px-2 py-2 text-center text-sm text-slate-400 border-y border-slate-700 bg-slate-800/50">
        Spread: {spread.toFixed(2)} ({((spread / asks[0]?.price || 0) * 100).toFixed(2)}%)
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex-1 overflow-y-auto">
        {renderOrders(bids, 'bid')}
      </div>
    </div>
  );
};
