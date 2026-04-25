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
      className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
        isBest
          ? 'bg-white ring-4 ring-blue-400 ring-opacity-50 shadow-2xl'
          : 'bg-white hover:shadow-xl'
      }`}
    >
      {isBest && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Best Choice
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${plan.colorClass} text-white`}>
          {plan.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
          <p className="text-sm text-gray-500">{plan.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Monthly Fee</span>
          <span className="font-semibold">
            {plan.monthlyFee === 0 ? 'Free' : formatEuro(plan.monthlyFee)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Interest Rate</span>
          <span className="font-semibold">{plan.interestRate}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Annual Fee</span>
          <span className="font-semibold">{annualFee === 0 ? 'Free' : formatEuro(annualFee)}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Gross Earnings</span>
          <span className="font-semibold text-green-600">{formatEuro(grossEarnings)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Net Profit</span>
          <span
            data-testid="net-profit"
            className={`font-bold text-lg ${netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}
          >
            {formatEuro(netProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}
