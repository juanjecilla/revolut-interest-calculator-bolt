import { useMemo } from 'react';
import { Calculator, ExternalLink } from 'lucide-react';
import { PLANS, KOFI_URL, REVOLUT_PRICING_URL } from '@/constants/plans';
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
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-[#0075EB]" />
          <span className="font-bold text-base text-gray-900 dark:text-gray-100 tracking-tight flex-1">
            Revolut Calculator
          </span>
          <DarkModeToggle dark={dark} onToggle={toggle} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
            Revolut Subscription <span className="text-[#0075EB]">Calculator</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-4">
            Find the optimal Revolut plan for your savings and maximize your net returns.
          </p>
          <a
            href={REVOLUT_PRICING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#0075EB] text-sm font-medium hover:underline"
          >
            View official Revolut pricing
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="max-w-sm mx-auto mb-10">
          <label
            htmlFor="amount"
            className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"
          >
            Investment Amount
          </label>
          <div className="flex items-center rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:border-[#0075EB] transition-colors duration-200">
            <span className="pl-4 text-xl font-bold text-gray-400 dark:text-gray-500 select-none">
              €
            </span>
            <input
              id="amount"
              type="number"
              value={rawAmount}
              onChange={(e) => setRawAmount(e.target.value)}
              min="0"
              step="100"
              className="flex-1 px-3 py-4 text-2xl font-bold bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-300 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="10000"
            />
          </div>
          <div className="flex justify-center mt-3">
            <CopyLinkButton />
          </div>
        </div>

        <StaleRatesWarning />

        <BestPlanBanner amount={amount} bestPlan={bestPlan} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              amount={amount}
              isBest={plan.name === bestPlan.name}
            />
          ))}
        </div>

        <div className="mb-8">
          <ComparisonChart amount={amount} dark={dark} />
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm space-y-4">
          <div className="flex justify-center">
            <a
              href={KOFI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#FF5E5B] text-white font-semibold rounded-full hover:bg-[#e54e4b] transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.033 11.596c.049 4.271 3.468 4.669 3.468 4.669s11.723.083 15.628.083c3.905 0 4.371-2.773 4.371-2.773s.729-4.751.373-9.78z" />
              </svg>
              Support this project on Ko-fi
            </a>
          </div>
          <p className="max-w-lg mx-auto">
            Interest rates and fees are subject to change. Please verify current rates with Revolut
            directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
