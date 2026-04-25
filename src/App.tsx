import { useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { PLANS, KOFI_URL } from '@/constants/plans';
import { findBestPlan } from '@/utils/calculator';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useHashAmount } from '@/hooks/useHashAmount';
import { PlanCard } from '@/components/PlanCard';
import { ComparisonChart } from '@/components/ComparisonChart';
import { BestPlanBanner } from '@/components/BestPlanBanner';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { StaleRatesWarning } from '@/components/StaleRatesWarning';

function App() {
  const { rawAmount, setRawAmount } = useHashAmount();
  const { dark, toggle } = useDarkMode();

  const amount = useMemo(() => {
    const parsed = parseFloat(rawAmount);
    if (isNaN(parsed) || parsed < 0) return 0;
    return Math.min(parsed, 999_999_999);
  }, [rawAmount]);

  const bestPlan = useMemo(() => findBestPlan(amount, PLANS), [amount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="relative text-center mb-12">
          <div className="absolute right-0 top-0">
            <DarkModeToggle dark={dark} onToggle={toggle} />
          </div>
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Revolut Subscription Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find the optimal Revolut plan based on your investment amount and maximize your returns
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <label
            htmlFor="amount"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Investment Amount (€)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              value={rawAmount}
              onChange={(e) => setRawAmount(e.target.value)}
              min="0"
              step="100"
              className="w-full px-6 py-4 text-2xl font-bold text-center rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
              placeholder="10000"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
              €
            </span>
          </div>
          <div className="flex justify-center mt-3">
            <CopyLinkButton />
          </div>
        </div>

        <StaleRatesWarning />

        <BestPlanBanner amount={amount} bestPlan={bestPlan} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              amount={amount}
              isBest={plan.name === bestPlan.name}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto mb-8">
          <ComparisonChart amount={amount} dark={dark} />
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm space-y-4">
          <div className="flex justify-center">
            <a
              href={KOFI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.033 11.596c.049 4.271 3.468 4.669 3.468 4.669s11.723.083 15.628.083c3.905 0 4.371-2.773 4.371-2.773s.729-4.751.373-9.78z" />
              </svg>
              Support this project on Ko-fi
            </a>
          </div>
          <p>
            This calculator helps you compare Revolut subscription plans based on interest earnings.
            Interest rates and fees are subject to change. Please verify current rates with Revolut.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
