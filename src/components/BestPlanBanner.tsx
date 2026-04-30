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
      <div
        className="p-5 flex items-center gap-4"
        style={{
          background: 'var(--brand-ink)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-2)',
        }}
      >
        <div
          className="p-2.5 flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Crown className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xs text-white font-semibold uppercase tracking-wide mb-0.5">
            Best Plan for €{amount.toLocaleString()}
          </p>
          <h2 className="text-2xl font-bold leading-tight">{bestPlan.name}</h2>
          <p className="text-sm text-white mt-0.5">
            Net profit: <span className="font-semibold">{formatEuro(netProfit)}</span> / year
          </p>
        </div>
      </div>
    </div>
  );
}
