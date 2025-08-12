import React, { useState, useMemo } from 'react';
import { TrendingUp, Calculator, Crown, Star, Zap, Shield } from 'lucide-react';

interface Plan {
  name: string;
  monthlyFee: number;
  interestRate: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const plans: Plan[] = [
  {
    name: 'Standard',
    monthlyFee: 0,
    interestRate: 1.25,
    icon: <Shield className="w-6 h-6" />,
    color: 'from-gray-400 to-gray-600',
    description: 'Free plan'
  },
  {
    name: 'Plus',
    monthlyFee: 3.99,
    interestRate: 1.25,
    icon: <Star className="w-6 h-6" />,
    color: 'from-blue-400 to-blue-600',
    description: 'Basic premium'
  },
  {
    name: 'Premium',
    monthlyFee: 8.99,
    interestRate: 1.51,
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-purple-400 to-purple-600',
    description: 'Enhanced returns'
  },
  {
    name: 'Metal',
    monthlyFee: 15.99,
    interestRate: 2.02,
    icon: <Crown className="w-6 h-6" />,
    color: 'from-yellow-400 to-orange-500',
    description: 'Premium experience'
  },
  {
    name: 'Ultra',
    monthlyFee: 45,
    interestRate: 2.27,
    icon: <Zap className="w-6 h-6" />,
    color: 'from-pink-400 to-red-500',
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

function PlanCard({ plan, amount, isBest }: { plan: Plan; amount: number; isBest: boolean }) {
  const grossEarnings = (amount * plan.interestRate) / 100;
  const annualFee = plan.monthlyFee * 12;
  const netProfit = grossEarnings - annualFee;

  return (
    <div className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
      isBest 
        ? 'bg-white ring-4 ring-blue-400 ring-opacity-50 shadow-2xl' 
        : 'bg-white hover:shadow-xl'
    }`}>
      {isBest && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Best Choice
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${plan.color} text-white`}>
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
            {plan.monthlyFee === 0 ? 'Free' : `€${plan.monthlyFee.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Interest Rate</span>
          <span className="font-semibold">{plan.interestRate}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Annual Fee</span>
          <span className="font-semibold">
            {annualFee === 0 ? 'Free' : `€${annualFee.toFixed(2)}`}
          </span>
        </div>
        
        <hr className="my-3" />
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Gross Earnings</span>
          <span className="font-semibold text-green-600">€{grossEarnings.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Net Profit</span>
          <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            €{netProfit.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ComparisonChart({ amount }: { amount: number }) {
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
  const profitRange = maxProfit - minProfit;

  const svgHeight = 300;
  const svgWidth = 800;
  const padding = 40;

  function getY(profit: number) {
    return svgHeight - padding - ((profit - minProfit) / profitRange) * (svgHeight - 2 * padding);
  }

  function getX(amount: number) {
    return padding + (amount / maxAmount) * (svgWidth - 2 * padding);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
        Plan Comparison Chart
      </h3>
      
      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="w-full h-auto">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Axes */}
          <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} 
                stroke="#374151" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} 
                stroke="#374151" strokeWidth="2" />
          
          {/* Plot lines for each plan */}
          {plans.map((plan, planIndex) => {
            const pathData = chartData.map((point, i) => {
              const x = getX(point.amount);
              const y = getY(point.profits[planIndex]);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');
            
            const colors = ['#6b7280', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
            
            return (
              <g key={plan.name}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={colors[planIndex]}
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />
                {/* Legend */}
                <g transform={`translate(${svgWidth - 150}, ${20 + planIndex * 25})`}>
                  <line x1="0" y1="10" x2="20" y2="10" stroke={colors[planIndex]} strokeWidth="3" />
                  <text x="25" y="14" className="text-sm font-medium" fill="#374151">{plan.name}</text>
                </g>
              </g>
            );
          })}
          
          {/* Current amount indicator */}
          <line 
            x1={getX(amount)} 
            y1={padding} 
            x2={getX(amount)} 
            y2={svgHeight - padding}
            stroke="#dc2626" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
          <circle 
            cx={getX(amount)} 
            cy={getY(calculateNetProfit(amount, findBestPlan(amount)))}
            r="6" 
            fill="#dc2626"
          />
          
          {/* Axis labels */}
          <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle" className="text-sm font-medium" fill="#374151">
            Investment Amount (€)
          </text>
          <text x="20" y={svgHeight / 2} textAnchor="middle" transform={`rotate(-90, 20, ${svgHeight / 2})`} 
                className="text-sm font-medium" fill="#374151">
            Net Profit (€)
          </text>
        </svg>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">
          The red dashed line shows your current investment amount. The chart displays how net profit 
          changes across different investment levels, helping you identify optimal plan switching points.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [amount, setAmount] = useState<number>(10000);

  const bestPlan = useMemo(() => findBestPlan(amount), [amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(Math.max(0, value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Revolut Subscription Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the optimal Revolut plan based on your investment amount and maximize your returns
          </p>
        </div>

        {/* Amount Input */}
        <div className="max-w-md mx-auto mb-12">
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
            Investment Amount (€)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              step="100"
              className="w-full px-6 py-4 text-2xl font-bold text-center rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
              placeholder="10000"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              €
            </span>
          </div>
        </div>

        {/* Best Plan Highlight */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl text-white text-center">
            <Crown className="w-8 h-8 mx-auto mb-2" />
            <h2 className="text-2xl font-bold mb-2">
              Best Plan for €{amount.toLocaleString()}: {bestPlan.name}
            </h2>
            <p className="text-blue-100">
              Net profit: €{calculateNetProfit(amount, bestPlan).toFixed(2)} annually
            </p>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              amount={amount}
              isBest={plan.name === bestPlan.name}
            />
          ))}
        </div>

        {/* Comparison Chart */}
        <div className="max-w-6xl mx-auto mb-8">
          <ComparisonChart amount={amount} />
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm space-y-4">
          {/* Ko-fi Support Button */}
          <div className="flex justify-center">
            <a
              href="https://ko-fi.com/juanjecilla"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.033 11.596c.049 4.271 3.468 4.669 3.468 4.669s11.723.083 15.628.083c3.905 0 4.371-2.773 4.371-2.773s.729-4.751.373-9.78z"/>
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