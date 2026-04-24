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
      className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
        isBest
          ? 'bg-white dark:bg-gray-800 ring-4 ring-blue-400 ring-opacity-50 shadow-2xl'
          : 'bg-white dark:bg-gray-800 hover:shadow-xl'
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{plan.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Monthly Fee</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {plan.monthlyFee === 0 ? 'Free' : formatEuro(plan.monthlyFee)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Interest Rate</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {plan.interestRate}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Annual Fee</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {annualFee === 0 ? 'Free' : formatEuro(annualFee)}
          </span>
        </div>

        <hr className="my-3 border-gray-200 dark:border-gray-700" />

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Gross Earnings</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {formatEuro(grossEarnings)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-900 dark:text-gray-100 font-medium">Net Profit</span>
          <span
            className={`font-bold text-lg ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
          >
            {formatEuro(netProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}
