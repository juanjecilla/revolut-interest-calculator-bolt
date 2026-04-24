import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Calculator, Crown, Star, Zap, Shield, Sun, Moon } from 'lucide-react';

interface Plan {
  name: string;
  monthlyFee: number;
  interestRate: number;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
  description: string;
}

const plans: Plan[] = [
  {
    name: 'Standard',
    monthlyFee: 0,
    interestRate: 1.25,
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-[#6B7280] to-[#9CA3AF]',
    accentColor: '#6B7280',
    description: 'Free plan'
  },
  {
    name: 'Plus',
    monthlyFee: 3.99,
    interestRate: 1.25,
    icon: <Star className="w-6 h-6" />,
    gradient: 'from-[#0075EB] to-[#00B9FF]',
    accentColor: '#0075EB',
    description: 'Basic premium'
  },
  {
    name: 'Premium',
    monthlyFee: 8.99,
    interestRate: 1.51,
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-[#00B9FF] to-[#00D4AA]',
    accentColor: '#00B9FF',
    description: 'Enhanced returns'
  },
  {
    name: 'Metal',
    monthlyFee: 15.99,
    interestRate: 2.02,
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-[#191C1F] to-[#3D4247]',
    accentColor: '#191C1F',
    description: 'Premium experience'
  },
  {
    name: 'Ultra',
    monthlyFee: 45,
    interestRate: 2.27,
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-[#FFB800] to-[#FF8C00]',
    accentColor: '#FFB800',
    description: 'Ultimate rewards'
  }
];

function calculateNetProfit(amount: number, plan: Plan): number {
  const grossEarnings = (amount * plan.interestRate) / 100;
  const annualFee = plan.monthlyFee * 12;
  return grossEarnings - annualFee;
}

function findBestPlan(amount: number): Plan {
  return plans.reduce((best, current) =>
    calculateNetProfit(amount, current) > calculateNetProfit(amount, best) ? current : best
  );
}

function PlanCard({ plan, amount, isBest, dark }: { plan: Plan; amount: number; isBest: boolean; dark: boolean }) {
  const grossEarnings = (amount * plan.interestRate) / 100;
  const annualFee = plan.monthlyFee * 12;
  const netProfit = grossEarnings - annualFee;

  return (
    <div className={`relative p-6 rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105 border ${
      isBest
        ? dark
          ? 'bg-[#1E2328] border-[#0075EB] ring-2 ring-[#0075EB]/40 shadow-xl shadow-[#0075EB]/10'
          : 'bg-white border-[#0075EB] ring-2 ring-[#0075EB]/30 shadow-xl shadow-[#0075EB]/10'
        : dark
          ? 'bg-[#1E2328] border-[#2A2F35] hover:shadow-lg hover:shadow-black/20'
          : 'bg-white border-gray-100 hover:shadow-lg'
    }`}>
      {isBest && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-[#0075EB] text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            Best Choice
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-5">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} text-white shadow-sm`}>
          {plan.icon}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-[#191C1F]'}`}>{plan.name}</h3>
          <p className={`text-xs ${dark ? 'text-[#8B9099]' : 'text-[#6B7280]'}`}>{plan.description}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${dark ? 'text-[#8B9099]' : 'text-[#6B7280]'}`}>Monthly Fee</span>
          <span className={`text-sm font-semibold ${dark ? 'text-[#C8CDD3]' : 'text-[#191C1F]'}`}>
            {plan.monthlyFee === 0 ? 'Free' : `€${plan.monthlyFee.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className={`text-sm ${dark ? 'text-[#8B9099]' : 'text-[#6B7280]'}`}>Interest Rate</span>
          <span className={`text-sm font-semibold ${dark ? 'text-[#C8CDD3]' : 'text-[#191C1F]'}`}>{plan.interestRate}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className={`text-sm ${dark ? 'text-[#8B9099]' : 'text-[#6B7280]'}`}>Annual Fee</span>
          <span className={`text-sm font-semibold ${dark ? 'text-[#C8CDD3]' : 'text-[#191C1F]'}`}>
            {annualFee === 0 ? 'Free' : `€${annualFee.toFixed(2)}`}
          </span>
        </div>

        <hr className={`my-2 ${dark ? 'border-[#2A2F35]' : 'border-gray-100'}`} />

        <div className="flex justify-between items-center">
          <span className={`text-sm ${dark ? 'text-[#8B9099]' : 'text-[#6B7280]'}`}>Gross Earnings</span>
          <span className="text-sm font-semibold text-[#00B9A9]">€{grossEarnings.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-[#191C1F]'}`}>Net Profit</span>
          <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-[#00B9A9]' : 'text-[#FF4B4B]'}`}>
            €{netProfit.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

const PLAN_COLORS = ['#6B7280', '#0075EB', '#00B9FF', '#555B63', '#FFB800'];

function ComparisonChart({ amount, dark }: { amount: number; dark: boolean }) {
  const maxAmount = Math.max(amount * 1.5, 50000);
  const points = 100;
  const step = maxAmount / points;

  const chartData = Array.from({ length: points }, (_, i) => {
    const x = i * step;
    return {
      amount: x,
      profits: plans.map(plan => calculateNetProfit(x, plan))
    };
  });

  const maxProfit = Math.max(...chartData.map(d => Math.max(...d.profits)));
  const minProfit = Math.min(...chartData.map(d => Math.min(...d.profits)));
  const profitRange = maxProfit - minProfit || 1;

  const svgHeight = 300;
  const svgWidth = 700;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 45;

  function getY(profit: number) {
    return svgHeight - paddingBottom - ((profit - minProfit) / profitRange) * (svgHeight - paddingTop - paddingBottom);
  }

  function getX(amt: number) {
    return paddingLeft + (amt / maxAmount) * (svgWidth - paddingLeft - paddingRight);
  }

  const gridColor = dark ? '#2A2F35' : '#F1F5F9';
  const axisColor = dark ? '#3D4247' : '#CBD5E1';
  const labelColor = dark ? '#8B9099' : '#6B7280';

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    minProfit + (i / (yTicks - 1)) * profitRange
  );

  const xTicks = 5;
  const xTickValues = Array.from({ length: xTicks }, (_, i) =>
    (i / (xTicks - 1)) * maxAmount
  );

  return (
    <div className={`p-6 rounded-2xl shadow-md border ${dark ? 'bg-[#1E2328] border-[#2A2F35]' : 'bg-white border-gray-100'}`}>
      <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${dark ? 'text-white' : 'text-[#191C1F]'}`}>
        <TrendingUp className="w-5 h-5 text-[#0075EB]" />
        Plan Comparison Chart
      </h3>

      {/* Legend above chart */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
        {plans.map((plan, i) => (
          <div key={plan.name} className="flex items-center gap-1.5">
            <svg width="20" height="10" className="flex-shrink-0">
              <line x1="0" y1="5" x2="20" y2="5" stroke={PLAN_COLORS[i]} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className={`text-xs font-medium ${dark ? 'text-[#C8CDD3]' : 'text-[#374151]'}`}>{plan.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <svg width="20" height="10" className="flex-shrink-0">
            <line x1="0" y1="5" x2="20" y2="5" stroke="#FF4B4B" strokeWidth="1.5" strokeDasharray="4,3" />
          </svg>
          <span className={`text-xs font-medium ${dark ? 'text-[#C8CDD3]' : 'text-[#374151]'}`}>Your amount</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="w-full h-auto" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Horizontal grid lines */}
          {yTickValues.map((val, i) => (
            <g key={i}>
              <line
                x1={paddingLeft} y1={getY(val)}
                x2={svgWidth - paddingRight} y2={getY(val)}
                stroke={gridColor} strokeWidth="1"
              />
              <text
                x={paddingLeft - 6} y={getY(val) + 4}
                textAnchor="end" fontSize="10" fill={labelColor}
              >
                €{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}
              </text>
            </g>
          ))}

          {/* Vertical grid lines */}
          {xTickValues.map((val, i) => (
            <g key={i}>
              <line
                x1={getX(val)} y1={paddingTop}
                x2={getX(val)} y2={svgHeight - paddingBottom}
                stroke={gridColor} strokeWidth="1"
              />
              <text
                x={getX(val)} y={svgHeight - paddingBottom + 14}
                textAnchor="middle" fontSize="10" fill={labelColor}
              >
                {val >= 1000 ? `€${(val / 1000).toFixed(0)}k` : `€${val.toFixed(0)}`}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line x1={paddingLeft} y1={svgHeight - paddingBottom} x2={svgWidth - paddingRight} y2={svgHeight - paddingBottom}
            stroke={axisColor} strokeWidth="1.5" />
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={svgHeight - paddingBottom}
            stroke={axisColor} strokeWidth="1.5" />

          {/* Plan lines */}
          {plans.map((plan, planIndex) => {
            const pathData = chartData.map((point, i) => {
              const x = getX(point.amount);
              const y = getY(point.profits[planIndex]);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');

            return (
              <path
                key={plan.name}
                d={pathData}
                fill="none"
                stroke={PLAN_COLORS[planIndex]}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}

          {/* Current amount indicator */}
          <line
            x1={getX(amount)} y1={paddingTop}
            x2={getX(amount)} y2={svgHeight - paddingBottom}
            stroke="#FF4B4B" strokeWidth="1.5" strokeDasharray="5,4"
          />
          <circle
            cx={getX(amount)}
            cy={getY(calculateNetProfit(amount, findBestPlan(amount)))}
            r="5"
            fill="#FF4B4B"
            stroke={dark ? '#1E2328' : 'white'}
            strokeWidth="2"
          />

          {/* Axis labels */}
          <text
            x={(paddingLeft + svgWidth - paddingRight) / 2}
            y={svgHeight - 5}
            textAnchor="middle" fontSize="11" fill={labelColor} fontWeight="500"
          >
            Investment Amount (€)
          </text>
          <text
            x={12} y={(paddingTop + svgHeight - paddingBottom) / 2}
            textAnchor="middle" fontSize="11" fill={labelColor} fontWeight="500"
            transform={`rotate(-90, 12, ${(paddingTop + svgHeight - paddingBottom) / 2})`}
          >
            Net Profit (€)
          </text>
        </svg>
      </div>

      <div className={`mt-4 p-3 rounded-xl text-sm ${dark ? 'bg-[#13161A] text-[#8B9099]' : 'bg-[#F8FAFC] text-[#6B7280]'}`}>
        The red dashed line marks your current investment amount. The dot shows the best plan's net profit at that level.
      </div>
    </div>
  );
}

function App() {
  const [amount, setAmount] = useState<number>(10000);
  const [dark, setDark] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const bestPlan = useMemo(() => findBestPlan(amount), [amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(Math.max(0, value));
  };

  const bg = dark ? 'bg-[#13161A]' : 'bg-[#F4F6F9]';
  const cardBg = dark ? 'bg-[#1E2328]' : 'bg-white';
  const textPrimary = dark ? 'text-white' : 'text-[#191C1F]';
  const textSecondary = dark ? 'text-[#8B9099]' : 'text-[#6B7280]';
  const border = dark ? 'border-[#2A2F35]' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* Top bar */}
      <div className={`sticky top-0 z-10 ${cardBg} border-b ${border} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#0075EB]" />
            <span className={`font-bold text-base tracking-tight ${textPrimary}`}>
              Revolut Calculator
            </span>
          </div>
          <button
            onClick={() => setDark(d => !d)}
            aria-label="Toggle theme"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
              dark
                ? 'bg-[#2A2F35] border-[#3D4247] text-[#C8CDD3] hover:bg-[#3D4247]'
                : 'bg-gray-100 border-gray-200 text-[#374151] hover:bg-gray-200'
            }`}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-extrabold tracking-tight mb-3 ${textPrimary}`}>
            Revolut Subscription
            <span className="text-[#0075EB]"> Calculator</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${textSecondary}`}>
            Find the optimal Revolut plan for your savings and maximize your net returns.
          </p>
        </div>

        {/* Amount Input */}
        <div className="max-w-sm mx-auto mb-10">
          <label htmlFor="amount" className={`block text-sm font-semibold mb-2 ${textSecondary}`}>
            Investment Amount
          </label>
          <div className={`flex items-center rounded-xl border-2 transition-all duration-200 ${
            dark
              ? 'bg-[#1E2328] border-[#2A2F35] focus-within:border-[#0075EB]'
              : 'bg-white border-gray-200 focus-within:border-[#0075EB]'
          }`}>
            <span className={`pl-4 text-xl font-bold select-none ${dark ? 'text-[#8B9099]' : 'text-[#6B7280]'}`}>€</span>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              step="100"
              className={`flex-1 px-3 py-4 text-2xl font-bold bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                dark ? 'text-white placeholder-[#3D4247]' : 'text-[#191C1F] placeholder-gray-300'
              }`}
              placeholder="10000"
            />
          </div>
        </div>

        {/* Best Plan Banner */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-[#0075EB] rounded-2xl p-5 text-white flex items-center gap-4 shadow-lg shadow-[#0075EB]/20">
            <div className="p-2 bg-white/15 rounded-xl">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-blue-100 font-medium uppercase tracking-wide">Best Plan for €{amount.toLocaleString()}</p>
              <p className="text-2xl font-bold">{bestPlan.name}</p>
              <p className="text-blue-100 text-sm">
                Net profit: <span className="font-semibold text-white">€{calculateNetProfit(amount, bestPlan).toFixed(2)}</span> / year
              </p>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              amount={amount}
              isBest={plan.name === bestPlan.name}
              dark={dark}
            />
          ))}
        </div>

        {/* Comparison Chart */}
        <div className="mb-8">
          <ComparisonChart amount={amount} dark={dark} />
        </div>

        {/* Footer */}
        <div className={`text-center space-y-4 ${textSecondary}`}>
          <div className="flex justify-center">
            <a
              href="https://ko-fi.com/juanjecilla"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#FF5E5B] text-white font-semibold rounded-full hover:bg-[#e54e4b] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.033 11.596c.049 4.271 3.468 4.669 3.468 4.669s11.723.083 15.628.083c3.905 0 4.371-2.773 4.371-2.773s.729-4.751.373-9.78z"/>
              </svg>
              Support this project on Ko-fi
            </a>
          </div>
          <p className="text-sm max-w-lg mx-auto">
            Interest rates and fees are subject to change. Please verify current rates with Revolut directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
