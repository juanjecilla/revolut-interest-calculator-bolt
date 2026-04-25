import { Crown } from 'lucide-react';
import { calculateNetProfit, formatEuro } from '@/utils/calculator';
import type { Plan } from '@/types';

interface Props {
  amount: number;
  bestPlan: Plan;
}

export function BestPlanBanner({ amount, bestPlan }: Props) {
  const netProfit = calculateNetProfit(amount, bestPlan);

  return (
    <div className="max-w-2xl mx-auto mb-8" data-testid="best-plan-banner">
      <div className="bg-[#0075EB] rounded-2xl p-5 text-white flex items-center gap-4 shadow-lg shadow-[#0075EB]/20">
        <div className="p-2.5 bg-white/15 rounded-xl flex-shrink-0">
          <Crown className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xs text-blue-100 font-semibold uppercase tracking-wide mb-0.5">
            Best Plan for €{amount.toLocaleString()}
          </p>
          <h2 className="text-2xl font-bold leading-tight">{bestPlan.name}</h2>
          <p className="text-sm text-blue-100 mt-0.5">
            Net profit: <span className="font-semibold text-white">{formatEuro(netProfit)}</span> /
            year
          </p>
        </div>
      </div>
    </div>
  );
}
