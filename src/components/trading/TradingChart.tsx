
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { theme } from '../../config/theme';
import clsx from 'clsx';

export interface ChartData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface TradingChartProps {
    data: ChartData[];
    timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
    indicators?: string[];
    height?: number;
    className?: string;
}

// Helper function to calculate Moving Average
const calculateMA = (data: ChartData[], period: number): Array<{ time: UTCTimestamp; value: number }> => {
    const result: Array<{ time: UTCTimestamp; value: number }> = [];
    
    for (let i = period - 1; i < data.length; i++) {
        const sum = data
            .slice(i - period + 1, i + 1)
            .reduce((acc, val) => acc + val.close, 0);
        result.push({
            time: (data[i].timestamp / 1000) as UTCTimestamp,
            value: sum / period,
        });
    }
    
    return result;
};

export const TradingChart: React.FC<TradingChartProps> = ({
    data,
    timeframe,
    indicators = [],
    height = 500,
    className
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartRef, setChartRef] = React.useState<IChartApi | null>(null);
    const [candlestickSeries, setCandlestickSeries] = React.useState<ISeriesApi<'Candlestick'> | null>(null);
    const [volumeSeries, setVolumeSeries] = React.useState<ISeriesApi<'Histogram'> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height,
            layout: {
                background: { color: theme.colors.primary.background as ColorType },
                textColor: theme.colors.text.primary as ColorType,
            },
            grid: {
                vertLines: { color: theme.colors.primary.surface as ColorType },
                horzLines: { color: theme.colors.primary.surface as ColorType },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    width: 1,
                    color: theme.colors.primary.accent as ColorType,
                    style: 3,
                },
                horzLine: {
                    width: 1,
                    color: theme.colors.primary.accent as ColorType,
                    style: 3,
                },
            },
            timeScale: {
                borderColor: theme.colors.primary.surface as ColorType,
                timeVisible: true,
                secondsVisible: timeframe === '1m',
            },
            rightPriceScale: {
                borderColor: theme.colors.primary.surface as ColorType,
            },
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: theme.colors.trading.profit as ColorType,
            downColor: theme.colors.trading.loss as ColorType,
            borderVisible: false,
            wickUpColor: theme.colors.trading.profit as ColorType,
            wickDownColor: theme.colors.trading.loss as ColorType,
        });

        const volumeHistogram = chart.addHistogramSeries({
            color: theme.colors.primary.accent as ColorType,
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '', // Set as an overlay
        });

        // Set the volume series to display at the bottom of the chart
        chart.priceScale('').applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        setChartRef(chart);
        setCandlestickSeries(candleSeries);
        setVolumeSeries(volumeHistogram);

        // Cleanup
        return () => {
            chart.remove();
        };
    }, [height, timeframe]);

    // Update data when it changes
    useEffect(() => {
        if (!candlestickSeries || !volumeSeries || !data.length) return;

        const formattedData = data.map(candle => ({
            time: (candle.timestamp / 1000) as UTCTimestamp,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
        }));

        const volumeData = data.map(candle => ({
            time: (candle.timestamp / 1000) as UTCTimestamp,
            value: candle.volume,
            color: candle.close >= candle.open ? 
                theme.colors.trading.profit as ColorType : 
                theme.colors.trading.loss as ColorType,
        }));

        candlestickSeries.setData(formattedData);
        volumeSeries.setData(volumeData);

        // Handle indicators
        if (chartRef && indicators.length > 0) {
            // Calculate and add moving averages
            if (indicators.includes('MA20')) {
                const ma20Data = calculateMA(data, 20);
                const ma20Series = chartRef.addLineSeries({
                    color: '#2962FF',
                    lineWidth: 1,
                });
                ma20Series.setData(ma20Data);
            }

            if (indicators.includes('MA50')) {
                const ma50Data = calculateMA(data, 50);
                const ma50Series = chartRef.addLineSeries({
                    color: '#FF6B6B',
                    lineWidth: 1,
                });
                ma50Series.setData(ma50Data);
            }
        }

        // Fit content
        chartRef?.timeScale().fitContent();
    }, [data, candlestickSeries, volumeSeries, chartRef, indicators]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (chartRef && chartContainerRef.current) {
                const { clientWidth } = chartContainerRef.current;
                chartRef.applyOptions({
                    width: clientWidth,
                    height,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [chartRef, height]);

    return (
        <div 
            ref={chartContainerRef} 
            className={clsx(
                'w-full rounded-lg overflow-hidden border border-slate-700',
                className
            )}
            style={{ height }}
        />
    );
};
