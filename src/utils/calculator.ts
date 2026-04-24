import type { PlanData } from '@/types';

export function calculateNetProfit(amount: number, plan: PlanData): number {
  const grossEarnings = (amount * plan.interestRate) / 100;
  const annualFee = plan.monthlyFee * 12;
  return grossEarnings - annualFee;
}

export function findBestPlan<T extends PlanData>(amount: number, plans: T[]): T {
  let best = plans[0];
  let bestProfit = calculateNetProfit(amount, best);
  for (let i = 1; i < plans.length; i++) {
    const profit = calculateNetProfit(amount, plans[i]);
    if (profit > bestProfit) {
      best = plans[i];
      bestProfit = profit;
    }
  }
  return best;
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function generateChartData(
  maxAmount: number,
  points: number,
  plans: PlanData[]
): { amount: number; profits: number[] }[] {
  const step = maxAmount / points;
  return Array.from({ length: points }, (_, i) => {
    const x = i * step;
    return { amount: x, profits: plans.map((plan) => calculateNetProfit(x, plan)) };
  });
}
