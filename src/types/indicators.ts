export interface BollingerBand {
  upper: number;
  middle: number;
  lower: number;
}
export interface TechnicalIndicators {
  rsi: number[];
  macd: { MACD: number[]; signal: number[]; histogram: number[] };
  bollinger: BollingerBand[];
}
export interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
