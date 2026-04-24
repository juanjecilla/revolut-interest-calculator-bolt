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
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl text-white text-center">
        <Crown className="w-8 h-8 mx-auto mb-2" />
        <h2 className="text-2xl font-bold mb-2">
          Best Plan for €{amount.toLocaleString()}: {bestPlan.name}
        </h2>
        <p className="text-blue-100">Net profit: {formatEuro(netProfit)} annually</p>
      </div>
    </div>
  );
}
