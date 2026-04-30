import { calculateNetProfit, formatEuro } from '@/utils/calculator';
import type { Plan } from '@/types';

interface Props {
  plan: Plan;
  amount: number;
  isBest: boolean;
}

export function PlanCard({ plan, amount, isBest }: Props) {
  const grossEarnings = (amount * plan.interestRate) / 100;
  const annualFee = plan.monthlyFee * 12;
  const netProfit = calculateNetProfit(amount, plan);

  return (
    <div
      data-plan={plan.name}
      className="relative p-6 transition-all duration-300 transform hover:scale-105"
      style={{
        background: 'var(--bg-surface)',
        border: isBest ? '2px solid var(--brand-ink)' : '1.5px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: isBest ? '0 0 0 4px var(--brand-ink-soft), var(--shadow-2)' : 'var(--shadow-1)',
      }}
    >
      {isBest && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div
            className="px-4 py-1 text-xs font-semibold tracking-wide uppercase"
            style={{
              background: 'var(--brand-ink)',
              color: '#fff',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            Best Choice
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-5">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.colorClass} text-white shadow-sm`}>
          {plan.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>
            {plan.name}
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            {plan.description}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>
            Monthly Fee
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            {plan.monthlyFee === 0 ? 'Free' : formatEuro(plan.monthlyFee)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>
            Interest Rate
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            {plan.interestRate}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>
            Annual Fee
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            {annualFee === 0 ? 'Free' : formatEuro(annualFee)}
          </span>
        </div>

        <hr style={{ borderColor: 'var(--line)' }} />

        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>
            Gross Earnings
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--positive)' }}>
            {formatEuro(grossEarnings)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
            Net Profit
          </span>
          <span
            className="font-bold text-lg"
            style={{ color: netProfit >= 0 ? 'var(--positive)' : 'var(--negative)' }}
          >
            {formatEuro(netProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}
