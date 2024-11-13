import { TradingStrategy } from '../services/TradingStrategy';

interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface NewsItem {
  timestamp: number;
  headline: string;
  source: string;
  content: string;
  sentiment: number;
  relevance: number;
}

interface MarketPattern {
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  description: string;
  supportingData: any[];
}

interface ResearchReport {
  timestamp: number;
  marketSentiment: {
    overall: number;
    technical: number;
    fundamental: number;
    news: number;
  };
  patterns: MarketPattern[];
  keyFindings: string[];
  recommendations: string[];
  risks: string[];
  technicalAnalysis: {
    trendStrength: number;
    volatility: number;
    momentum: number;
    supportLevels: number[];
    resistanceLevels: number[];
  };
  newsAnalysis: {
    topHeadlines: NewsItem[];
    sentimentScore: number;
    keyTopics: string[];
  };
}

export class ResearchAgent {
  private strategy: TradingStrategy;
  private historicalReports: ResearchReport[] = [];
  private newsCache: Map<string, NewsItem[]> = new Map();
  private patternDatabase: MarketPattern[] = [];

  constructor(strategy: TradingStrategy) {
    this.strategy = strategy;
    this.initializePatternDatabase();
  }

  private initializePatternDatabase(): void {
    // Initialize common market patterns for recognition
    this.patternDatabase = [
      {
        type: 'bullish',
        confidence: 0.8,
        description: 'Double Bottom',
        supportingData: [],
      },
      {
        type: 'bearish',
        confidence: 0.8,
        description: 'Double Top',
        supportingData: [],
      },
      {
        type: 'bullish',
        confidence: 0.7,
        description: 'Golden Cross',
        supportingData: [],
      },
      {
        type: 'bearish',
        confidence: 0.7,
        description: 'Death Cross',
        supportingData: [],
      },
    ];
  }

  public async generateResearchReport(
    marketData: MarketData[],
    news: NewsItem[]
  ): Promise<ResearchReport> {
    const technicalAnalysis = await this.performTechnicalAnalysis(marketData);
    const newsAnalysis = this.analyzeNews(news);
    const patterns = this.identifyPatterns(marketData);
    const sentiment = this.calculateMarketSentiment(
      technicalAnalysis,
      newsAnalysis,
      patterns
    );

    const report: ResearchReport = {
      timestamp: Date.now(),
      marketSentiment: sentiment,
      patterns,
      keyFindings: this.generateKeyFindings(
        technicalAnalysis,
        newsAnalysis,
        patterns
      ),
      recommendations: this.generateRecommendations(sentiment, patterns),
      risks: this.identifyRisks(technicalAnalysis, newsAnalysis),
      technicalAnalysis,
      newsAnalysis,
    };

    this.historicalReports.push(report);
    return report;
  }

  private async performTechnicalAnalysis(
    marketData: MarketData[]
  ): Promise<ResearchReport['technicalAnalysis']> {
    const indicators = this.strategy.calculateIndicators(marketData);
    const closes = marketData.map(d => d.close);

    // Calculate trend strength using ADX-like method
    const trendStrength = this.calculateTrendStrength(closes);

    // Calculate volatility using standard deviation
    const volatility = this.calculateVolatility(closes);

    // Calculate momentum using ROC
    const momentum = this.calculateMomentum(closes);

    // Calculate support and resistance levels
    const levels = this.calculateSupportResistanceLevels(marketData);

    return {
      trendStrength,
      volatility,
      momentum,
      supportLevels: levels.support,
      resistanceLevels: levels.resistance,
    };
  }

  private calculateTrendStrength(prices: number[]): number {
    // Simplified ADX calculation
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const positiveSum = changes
      .filter(change => change > 0)
      .reduce((a, b) => a + b, 0);
    const negativeSum = Math.abs(
      changes.filter(change => change < 0).reduce((a, b) => a + b, 0)
    );
    return (positiveSum - negativeSum) / (positiveSum + negativeSum);
  }

  private calculateVolatility(prices: number[]): number {
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / prices.length);
  }

  private calculateMomentum(prices: number[]): number {
    // Rate of Change calculation
    const period = 14;
    const current = prices[prices.length - 1];
    const previous = prices[prices.length - 1 - period];
    return (current - previous) / previous;
  }

  private calculateSupportResistanceLevels(marketData: MarketData[]): {
    support: number[];
    resistance: number[];
  } {
    const prices = marketData.map(d => d.close);
    const pivotPoints = this.findPivotPoints(prices);

    return {
      support: pivotPoints.filter(p => p < prices[prices.length - 1]).slice(-3),
      resistance: pivotPoints
        .filter(p => p > prices[prices.length - 1])
        .slice(0, 3),
    };
  }

  private findPivotPoints(prices: number[]): number[] {
    const pivots: number[] = [];
    for (let i = 2; i < prices.length - 2; i++) {
      if (this.isPivot(prices, i)) {
        pivots.push(prices[i]);
      }
    }
    return pivots.sort((a, b) => a - b);
  }

  private isPivot(prices: number[], index: number): boolean {
    const window = prices.slice(index - 2, index + 3);
    const center = window[2];
    const isHigh = window.every(price => price <= center);
    const isLow = window.every(price => price >= center);
    return isHigh || isLow;
  }

  private analyzeNews(news: NewsItem[]): ResearchReport['newsAnalysis'] {
    const sortedNews = [...news].sort((a, b) => b.relevance - a.relevance);
    const topHeadlines = sortedNews.slice(0, 5);

    const sentimentScore =
      news.reduce((acc, item) => acc + item.sentiment, 0) / news.length;

    const keyTopics = this.extractKeyTopics(news);

    return {
      topHeadlines,
      sentimentScore,
      keyTopics,
    };
  }

  private extractKeyTopics(news: NewsItem[]): string[] {
    // Simple keyword extraction
    const keywords = news
      .map(item => item.headline + ' ' + item.content)
      .join(' ')
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);

    const frequency: { [key: string]: number } = {};
    keywords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private identifyPatterns(marketData: MarketData[]): MarketPattern[] {
    return this.patternDatabase
      .filter(pattern => this.matchPattern(pattern, marketData))
      .map(pattern => ({
        ...pattern,
        supportingData: this.extractPatternData(pattern, marketData),
      }));
  }

  private matchPattern(
    pattern: MarketPattern,
    marketData: MarketData[]
  ): boolean {
    // Pattern matching logic based on pattern type
    const prices = marketData.map(d => d.close);
    switch (pattern.description) {
      case 'Double Bottom':
        return this.detectDoubleBottom(prices);
      case 'Double Top':
        return this.detectDoubleTop(prices);
      case 'Golden Cross':
        return this.detectGoldenCross(prices);
      case 'Death Cross':
        return this.detectDeathCross(prices);
      default:
        return false;
    }
  }

  private detectDoubleBottom(prices: number[]): boolean {
    // Simplified double bottom detection
    const window = prices.slice(-20);
    const min1 = Math.min(...window.slice(0, 10));
    const min2 = Math.min(...window.slice(10));
    const max = Math.max(...window.slice(5, 15));
    return Math.abs(min1 - min2) / min1 < 0.02 && max > min1 * 1.02;
  }

  private detectDoubleTop(prices: number[]): boolean {
    // Simplified double top detection
    const window = prices.slice(-20);
    const max1 = Math.max(...window.slice(0, 10));
    const max2 = Math.max(...window.slice(10));
    const min = Math.min(...window.slice(5, 15));
    return Math.abs(max1 - max2) / max1 < 0.02 && min < max1 * 0.98;
  }

  private detectGoldenCross(prices: number[]): boolean {
    const ma50 = this.calculateMA(prices, 50);
    const ma200 = this.calculateMA(prices, 200);
    return (
      ma50[ma50.length - 1] > ma200[ma200.length - 1] &&
      ma50[ma50.length - 2] <= ma200[ma200.length - 2]
    );
  }

  private detectDeathCross(prices: number[]): boolean {
    const ma50 = this.calculateMA(prices, 50);
    const ma200 = this.calculateMA(prices, 200);
    return (
      ma50[ma50.length - 1] < ma200[ma200.length - 1] &&
      ma50[ma50.length - 2] >= ma200[ma200.length - 2]
    );
  }

  private calculateMA(prices: number[], period: number): number[] {
    const result: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices
        .slice(i - period + 1, i + 1)
        .reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
    return result;
  }

  private extractPatternData(
    pattern: MarketPattern,
    marketData: MarketData[]
  ): any[] {
    // Extract relevant data points for pattern visualization
    return marketData.slice(-20).map(d => ({
      timestamp: d.timestamp,
      price: d.close,
      volume: d.volume,
    }));
  }

  private calculateMarketSentiment(
    technical: ResearchReport['technicalAnalysis'],
    news: ResearchReport['newsAnalysis'],
    patterns: MarketPattern[]
  ): ResearchReport['marketSentiment'] {
    const technicalScore =
      (technical.trendStrength +
        Math.min(technical.momentum, 1) +
        (1 - Math.min(technical.volatility, 1))) /
      3;

    const fundamentalScore = 0.5; // Placeholder for fundamental analysis

    const newsScore = news.sentimentScore;

    const patternScore =
      patterns.reduce(
        (acc, pattern) =>
          acc +
          (pattern.type === 'bullish'
            ? pattern.confidence
            : -pattern.confidence),
        0
      ) / Math.max(patterns.length, 1);

    return {
      overall:
        (technicalScore + fundamentalScore + newsScore + patternScore) / 4,
      technical: technicalScore,
      fundamental: fundamentalScore,
      news: newsScore,
    };
  }

  private generateKeyFindings(
    technical: ResearchReport['technicalAnalysis'],
    news: ResearchReport['newsAnalysis'],
    patterns: MarketPattern[]
  ): string[] {
    const findings: string[] = [];

    // Technical findings
    if (technical.trendStrength > 0.7) {
      findings.push('Strong upward trend detected');
    } else if (technical.trendStrength < -0.7) {
      findings.push('Strong downward trend detected');
    }

    if (technical.volatility > 0.8) {
      findings.push('High market volatility observed');
    }

    // Pattern findings
    patterns.forEach(pattern => {
      findings.push(
        `${pattern.description} pattern detected with ${pattern.confidence * 100}% confidence`
      );
    });

    // News findings
    if (news.sentimentScore > 0.7) {
      findings.push('Highly positive market sentiment in news');
    } else if (news.sentimentScore < -0.7) {
      findings.push('Highly negative market sentiment in news');
    }

    return findings;
  }

  private generateRecommendations(
    sentiment: ResearchReport['marketSentiment'],
    patterns: MarketPattern[]
  ): string[] {
    const recommendations: string[] = [];

    if (sentiment.overall > 0.7) {
      recommendations.push('Consider increasing long positions');
    } else if (sentiment.overall < -0.7) {
      recommendations.push('Consider reducing exposure');
    }

    patterns.forEach(pattern => {
      if (pattern.confidence > 0.8) {
        recommendations.push(
          `${pattern.type === 'bullish' ? 'Buy' : 'Sell'} opportunity based on ${pattern.description}`
        );
      }
    });

    return recommendations;
  }

  private identifyRisks(
    technical: ResearchReport['technicalAnalysis'],
    news: ResearchReport['newsAnalysis']
  ): string[] {
    const risks: string[] = [];

    if (technical.volatility > 0.8) {
      risks.push('High market volatility increases trading risks');
    }

    if (news.sentimentScore < -0.5) {
      risks.push('Negative market sentiment may impact prices');
    }

    if (technical.momentum > 0.8) {
      risks.push('Potential for price correction due to overbought conditions');
    } else if (technical.momentum < -0.8) {
      risks.push('Potential for price correction due to oversold conditions');
    }

    return risks;
  }

  public getHistoricalReports(): ResearchReport[] {
    return this.historicalReports;
  }
}
