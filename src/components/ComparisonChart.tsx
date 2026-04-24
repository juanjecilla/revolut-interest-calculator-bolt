import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { PLANS, CHART_COLORS, CHART_DASH_PATTERNS } from '@/constants/plans';
import { generateChartData, findBestPlan, calculateNetProfit } from '@/utils/calculator';

const SVG_HEIGHT = 300;
const SVG_WIDTH = 760;
const PADDING_LEFT = 40;
const PADDING_RIGHT = 20;
const PADDING_V = 40;
const CHART_POINTS = 100;

interface Props {
  amount: number;
}

export function ComparisonChart({ amount }: Props) {
  const maxAmount = useMemo(() => Math.max(amount * 1.5, 50000), [amount]);
  const chartData = useMemo(() => generateChartData(maxAmount, CHART_POINTS, PLANS), [maxAmount]);

  const allProfits = chartData.flatMap((d) => d.profits);
  const maxProfit = Math.max(...allProfits);
  const minProfit = Math.min(...allProfits);
  const profitRange = maxProfit - minProfit || 1;

  function getY(profit: number) {
    return (
      SVG_HEIGHT - PADDING_V - ((profit - minProfit) / profitRange) * (SVG_HEIGHT - 2 * PADDING_V)
    );
  }

  function getX(amt: number) {
    return PADDING_LEFT + (amt / maxAmount) * (SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT);
  }

  const bestPlan = findBestPlan(amount, PLANS);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
        Plan Comparison Chart
      </h3>

      {/* viewBox makes the SVG fully responsive — scales to any container width */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby="chart-title"
      >
        <title id="chart-title">
          Net annual profit comparison for 5 Revolut subscription plans across investment amounts
        </title>

        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <line
          x1={PADDING_LEFT}
          y1={SVG_HEIGHT - PADDING_V}
          x2={SVG_WIDTH - PADDING_RIGHT}
          y2={SVG_HEIGHT - PADDING_V}
          stroke="#374151"
          strokeWidth="2"
        />
        <line
          x1={PADDING_LEFT}
          y1={PADDING_V}
          x2={PADDING_LEFT}
          y2={SVG_HEIGHT - PADDING_V}
          stroke="#374151"
          strokeWidth="2"
        />

        {PLANS.map((plan, planIndex) => {
          const pathData = chartData
            .map((point, i) => {
              const x = getX(point.amount);
              const y = getY(point.profits[planIndex]);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');

          return (
            <path
              key={plan.name}
              d={pathData}
              fill="none"
              stroke={CHART_COLORS[planIndex]}
              strokeWidth="3"
              strokeDasharray={CHART_DASH_PATTERNS[planIndex]}
              aria-label={`${plan.name} plan net profit line`}
              className="drop-shadow-sm"
            />
          );
        })}

        <line
          x1={getX(amount)}
          y1={PADDING_V}
          x2={getX(amount)}
          y2={SVG_HEIGHT - PADDING_V}
          stroke="#dc2626"
          strokeWidth="2"
          strokeDasharray="5,5"
          aria-label="Current investment amount indicator"
        />
        <circle
          cx={getX(amount)}
          cy={getY(calculateNetProfit(amount, bestPlan))}
          r="6"
          fill="#dc2626"
        />

        <text
          x={(PADDING_LEFT + SVG_WIDTH - PADDING_RIGHT) / 2}
          y={SVG_HEIGHT - 10}
          textAnchor="middle"
          fill="#374151"
          fontSize="12"
        >
          Investment Amount (€)
        </text>
        <text
          x="14"
          y={SVG_HEIGHT / 2}
          textAnchor="middle"
          transform={`rotate(-90, 14, ${SVG_HEIGHT / 2})`}
          fill="#374151"
          fontSize="12"
        >
          Net Profit (€)
        </text>
      </svg>

      {/* HTML legend — always readable at any screen width */}
      <div
        className="flex flex-wrap gap-3 mt-3 justify-center"
        role="list"
        aria-label="Chart legend"
      >
        {PLANS.map((plan, i) => (
          <div key={plan.name} className="flex items-center gap-1.5" role="listitem">
            <svg width="24" height="12" aria-hidden="true">
              <line
                x1="0"
                y1="6"
                x2="24"
                y2="6"
                stroke={CHART_COLORS[i]}
                strokeWidth="3"
                strokeDasharray={CHART_DASH_PATTERNS[i]}
              />
            </svg>
            <span className="text-sm text-gray-700">{plan.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5" role="listitem">
          <svg width="24" height="12" aria-hidden="true">
            <line
              x1="0"
              y1="6"
              x2="24"
              y2="6"
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
          <span className="text-sm text-gray-700">Your amount</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">
          The red dashed line shows your current investment amount. The chart displays how net
          profit changes across different investment levels, helping you identify optimal plan
          switching points.
        </p>
      </div>
    </div>
  );
}
