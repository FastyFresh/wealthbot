
import React from 'react';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { TradingChart } from './TradingChart';
import { OrderBook } from './OrderBook';
import { TradingControls } from './TradingControls';
import { useDrift } from '../../providers/DriftProvider';
import { theme } from '../../config/theme';
import clsx from 'clsx';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
);

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-red-900/20 border border-red-500 text-red-100 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button
            onClick={onRetry}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
            Retry
        </button>
    </div>
);

interface TopBarMetrics {
    accountValue: number;
    dailyPnL: number;
    totalPnL: number;
    availableBalance: number;
    marginUsage: number;
}

const TopBar: React.FC<TopBarMetrics> = ({
    accountValue,
    dailyPnL,
    totalPnL,
    availableBalance,
    marginUsage
}) => (
    <div className="grid grid-cols-5 gap-4 mb-6">
        {[
            { label: 'Account Value', value: `$${accountValue.toFixed(2)}` },
            { label: 'Daily P&L', value: `${dailyPnL >= 0 ? '+' : ''}$${dailyPnL.toFixed(2)}`, 
              color: dailyPnL >= 0 ? 'text-green-500' : 'text-red-500' },
            { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`,
              color: totalPnL >= 0 ? 'text-green-500' : 'text-red-500' },
            { label: 'Available Balance', value: `$${availableBalance.toFixed(2)}` },
            { label: 'Margin Usage', value: `${marginUsage.toFixed(2)}%`,
              color: marginUsage > 80 ? 'text-red-500' : marginUsage > 50 ? 'text-yellow-500' : 'text-green-500' }
        ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-400">{label}</div>
                <div className={clsx('text-lg font-semibold mt-1', color || 'text-slate-200')}>
                    {value}
                </div>
            </div>
        ))}
    </div>
);

export const TradingDashboard: React.FC = () => {
    const {
        positions,
        accountValue,
        marginRatio,
        unrealizedPnl,
        isInitialized,
        isLoading,
        error,
        placeOrder,
        closePosition,
        emergencyClose,
        refresh
    } = useDrift();

    const mockMetrics: TopBarMetrics = {
        accountValue,
        dailyPnL: unrealizedPnl,
        totalPnL: unrealizedPnl,
        availableBalance: accountValue,
        marginUsage: marginRatio * 100
    };

    const mockOrderBook = {
        bids: Array.from({ length: 10 }, (_, i) => ({
            price: 40000 - i * 10,
            size: Math.random() * 2,
            total: Math.random() * 10
        })),
        asks: Array.from({ length: 10 }, (_, i) => ({
            price: 40100 + i * 10,
            size: Math.random() * 2,
            total: Math.random() * 10
        })),
        spread: 100
    };

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-slate-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-200 mb-6">Initializing AI Trading Model...</h1>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-slate-900 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-200">AI Trading Dashboard</h1>
                        <div className="flex space-x-4">
                            <button
                                onClick={refresh}
                                disabled={isLoading}
                                className={clsx(
                                    'px-4 py-2 rounded-lg',
                                    'bg-slate-800 border border-slate-700',
                                    'text-slate-200 hover:bg-slate-700 transition-colors'
                                )}
                            >
                                Refresh
                            </button>
                            <button
                                onClick={emergencyClose}
                                disabled={isLoading || positions.length === 0}
                                className={clsx(
                                    'px-4 py-2 rounded-lg',
                                    'bg-red-600 hover:bg-red-700 transition-colors',
                                    'text-white',
                                    (isLoading || positions.length === 0) && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                Emergency Close
                            </button>
                        </div>
                    </div>

                    {/* Top Metrics Bar */}
                    <TopBar {...mockMetrics} />
                    
                    {error && <ErrorDisplay error={error} onRetry={refresh} />}
                    
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="space-y-6">
                            {/* Main Trading View */}
                            <div className="grid grid-cols-4 gap-6">
                                {/* Chart */}
                                <div className="col-span-3">
                                    <TradingChart
                                        data={positions.map(pos => ({
                                            timestamp: Date.now(),
                                            open: pos.entryPrice,
                                            high: pos.entryPrice * 1.1,
                                            low: pos.entryPrice * 0.9,
                                            close: pos.entryPrice,
                                            volume: pos.size
                                        }))}
                                        timeframe="1m"
                                        indicators={['MA20', 'MA50']}
                                        height={600}
                                    />
                                </div>
                                
                                {/* Order Book */}
                                <div className="col-span-1">
                                    <OrderBook
                                        bids={mockOrderBook.bids}
                                        asks={mockOrderBook.asks}
                                        spread={mockOrderBook.spread}
                                    />
                                </div>
                            </div>

                            {/* Trading Controls */}
                            <TradingControls
                                onSubmitOrder={placeOrder}
                                maxLeverage={20}
                                availableBalance={accountValue}
                            />

                            {/* Positions */}
                            {positions.length > 0 && (
                                <div className="bg-slate-800 rounded-lg p-4">
                                    <h2 className="text-xl font-semibold text-slate-200 mb-4">Open Positions</h2>
                                    <div className="grid grid-cols-6 gap-4 text-sm text-slate-400 mb-2">
                                        <div>Market</div>
                                        <div>Size</div>
                                        <div>Entry Price</div>
                                        <div>Current PnL</div>
                                        <div>Liquidation Price</div>
                                        <div></div>
                                    </div>
                                    {positions.map((position) => (
                                        <div key={position.market} className="grid grid-cols-6 gap-4 py-2 border-t border-slate-700">
                                            <div className="text-slate-200">{position.market}</div>
                                            <div className={position.direction === 'long' ? 'text-green-500' : 'text-red-500'}>
                                                {position.direction === 'long' ? '+' : '-'}{Math.abs(position.size)}
                                            </div>
                                            <div className="text-slate-200">${position.entryPrice.toFixed(2)}</div>
                                            <div className={position.unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                ${position.unrealizedPnl.toFixed(2)}
                                            </div>
                                            <div className="text-slate-200">${position.liquidationPrice.toFixed(2)}</div>
                                            <div>
                                                <button
                                                    onClick={() => closePosition(position.market)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};
