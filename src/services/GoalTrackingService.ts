interface MilestoneConfig {
  target: number;
  description: string;
  riskAdjustment: number; // Risk adjustment factor when milestone is reached
}

interface ProgressMetrics {
  currentValue: number;
  percentageToGoal: number;
  projectedTimeToGoal: number; // in days
  currentGrowthRate: number;
  requiredGrowthRate: number;
  nextMilestone: MilestoneConfig;
}

export class GoalTrackingService {
  private readonly FINAL_GOAL = 1000000; // $1M in USD
  private readonly TARGET_TIMEFRAME = 5 * 365; // 5 years in days
  private readonly initialDeposit: number;
  private readonly milestones: MilestoneConfig[];

  constructor(initialDeposit: number) {
    this.initialDeposit = initialDeposit;
    this.milestones = this.initializeMilestones();
  }

  private initializeMilestones(): MilestoneConfig[] {
    return [
      {
        target: 1000,
        description: 'Initial Growth Phase',
        riskAdjustment: 1.0, // Full risk tolerance
      },
      {
        target: 10000,
        description: 'Early Momentum',
        riskAdjustment: 0.9, // Slightly reduced risk
      },
      {
        target: 50000,
        description: 'Acceleration Phase',
        riskAdjustment: 0.8, // Moderately reduced risk
      },
      {
        target: 100000,
        description: 'Six Figure Milestone',
        riskAdjustment: 0.7, // Conservative adjustment
      },
      {
        target: 250000,
        description: 'Quarter Million',
        riskAdjustment: 0.6, // More conservative
      },
      {
        target: 500000,
        description: 'Halfway Point',
        riskAdjustment: 0.5, // Significantly reduced risk
      },
      {
        target: 750000,
        description: 'Final Stretch',
        riskAdjustment: 0.4, // Very conservative
      },
      {
        target: 1000000,
        description: 'Goal Achievement',
        riskAdjustment: 0.3, // Most conservative
      },
    ];
  }

  public calculateRequiredGrowthRate(
    currentValue: number,
    daysElapsed: number
  ): number {
    const remainingDays = this.TARGET_TIMEFRAME - daysElapsed;
    if (remainingDays <= 0) return 0;

    // Using compound interest formula: FV = PV(1 + r)^t
    // Solving for r: r = (FV/PV)^(1/t) - 1
    const dailyRate =
      Math.pow(this.FINAL_GOAL / currentValue, 1 / remainingDays) - 1;
    return dailyRate * 365; // Convert to annual rate
  }

  public getCurrentMilestone(currentValue: number): MilestoneConfig {
    return (
      this.milestones.find(m => m.target > currentValue) ||
      this.milestones[this.milestones.length - 1]
    );
  }

  public calculateProgress(
    currentValue: number,
    daysElapsed: number,
    recentDailyReturns: number[]
  ): ProgressMetrics {
    const percentageToGoal = (currentValue / this.FINAL_GOAL) * 100;
    const currentGrowthRate =
      this.calculateCurrentGrowthRate(recentDailyReturns);
    const requiredGrowthRate = this.calculateRequiredGrowthRate(
      currentValue,
      daysElapsed
    );

    // Project time to goal based on current growth rate
    const projectedDays = this.projectTimeToGoal(
      currentValue,
      currentGrowthRate
    );

    return {
      currentValue,
      percentageToGoal,
      projectedTimeToGoal: projectedDays,
      currentGrowthRate,
      requiredGrowthRate,
      nextMilestone: this.getCurrentMilestone(currentValue),
    };
  }

  private calculateCurrentGrowthRate(recentDailyReturns: number[]): number {
    if (recentDailyReturns.length === 0) return 0;

    // Calculate average daily return
    const avgDailyReturn =
      recentDailyReturns.reduce((a, b) => a + b, 0) / recentDailyReturns.length;

    // Convert to annual rate
    return Math.pow(1 + avgDailyReturn, 365) - 1;
  }

  private projectTimeToGoal(
    currentValue: number,
    currentGrowthRate: number
  ): number {
    if (currentGrowthRate <= 0) return Infinity;

    // Using compound interest formula: t = log(FV/PV) / log(1 + r)
    const dailyRate = Math.pow(1 + currentGrowthRate, 1 / 365) - 1;
    return Math.log(this.FINAL_GOAL / currentValue) / Math.log(1 + dailyRate);
  }

  public getProgressSummary(metrics: ProgressMetrics): string {
    const {
      currentValue,
      percentageToGoal,
      projectedTimeToGoal,
      currentGrowthRate,
      requiredGrowthRate,
      nextMilestone,
    } = metrics;

    const remainingDays = this.TARGET_TIMEFRAME - projectedTimeToGoal;
    const status = remainingDays > 0 ? 'ahead of schedule' : 'behind schedule';

    return `
Current Progress:
• Value: $${currentValue.toLocaleString()}
• Progress: ${percentageToGoal.toFixed(2)}% to $1M goal
• Growth Rate: ${(currentGrowthRate * 100).toFixed(2)}% annually
• Required Rate: ${(requiredGrowthRate * 100).toFixed(2)}% annually
• Next Milestone: $${nextMilestone.target.toLocaleString()} (${nextMilestone.description})
• Projection: ${
      projectedTimeToGoal === Infinity
        ? 'Needs positive growth rate'
        : `${Math.abs(Math.round(projectedTimeToGoal))} days to goal (${status})`
    }
    `;
  }

  public getRiskAdjustmentFactor(currentValue: number): number {
    const currentMilestone = this.getCurrentMilestone(currentValue);
    return currentMilestone.riskAdjustment;
  }

  public suggestPositionSize(
    currentValue: number,
    volatility: number,
    confidence: number
  ): number {
    const riskFactor = this.getRiskAdjustmentFactor(currentValue);
    const baseRisk = 0.02; // Base risk per trade (2%)

    // Adjust position size based on milestone progress, volatility, and confidence
    const adjustedRisk = baseRisk * riskFactor * (1 - volatility) * confidence;

    return currentValue * adjustedRisk;
  }
}
