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
      className={`relative p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 border ${
        isBest
          ? 'bg-white border-[#0075EB] ring-2 ring-[#0075EB]/20 shadow-xl shadow-[#0075EB]/10'
          : 'bg-white border-gray-100 shadow-md hover:shadow-lg'
      }`}
    >
      {isBest && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-[#0075EB] text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            Best Choice
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-5">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.colorClass} text-white shadow-sm`}>
          {plan.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
          <p className="text-xs text-gray-500">{plan.description}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Monthly Fee</span>
          <span className="text-sm font-semibold text-gray-800">
            {plan.monthlyFee === 0 ? 'Free' : formatEuro(plan.monthlyFee)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Interest Rate</span>
          <span className="text-sm font-semibold text-gray-800">{plan.interestRate}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Annual Fee</span>
          <span className="text-sm font-semibold text-gray-800">
            {annualFee === 0 ? 'Free' : formatEuro(annualFee)}
          </span>
        </div>

        <hr className="border-gray-100" />

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Gross Earnings</span>
          <span className="text-sm font-semibold text-emerald-600">
            {formatEuro(grossEarnings)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-800">Net Profit</span>
          <span
            className={`font-bold text-lg ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
          >
            {formatEuro(netProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}
