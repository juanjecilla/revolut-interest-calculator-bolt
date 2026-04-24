import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { PLANS, CHART_COLORS, CHART_DASH_PATTERNS } from '@/constants/plans';
import { generateChartData, findBestPlan, calculateNetProfit } from '@/utils/calculator';

const SVG_HEIGHT = 300;
const SVG_WIDTH = 800;
const PADDING = 40;
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
    return SVG_HEIGHT - PADDING - ((profit - minProfit) / profitRange) * (SVG_HEIGHT - 2 * PADDING);
  }

  function getX(amt: number) {
    return PADDING + (amt / maxAmount) * (SVG_WIDTH - 2 * PADDING);
  }

  const bestPlan = findBestPlan(amount, PLANS);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
        Plan Comparison Chart
      </h3>

      <div className="overflow-x-auto">
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
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
            x1={PADDING}
            y1={SVG_HEIGHT - PADDING}
            x2={SVG_WIDTH - PADDING}
            y2={SVG_HEIGHT - PADDING}
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1={PADDING}
            y1={PADDING}
            x2={PADDING}
            y2={SVG_HEIGHT - PADDING}
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
              <g key={plan.name}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={CHART_COLORS[planIndex]}
                  strokeWidth="3"
                  strokeDasharray={CHART_DASH_PATTERNS[planIndex]}
                  aria-label={`${plan.name} plan net profit line`}
                  className="drop-shadow-sm"
                />
                <g transform={`translate(${SVG_WIDTH - 150}, ${20 + planIndex * 25})`}>
                  <line
                    x1="0"
                    y1="10"
                    x2="20"
                    y2="10"
                    stroke={CHART_COLORS[planIndex]}
                    strokeWidth="3"
                    strokeDasharray={CHART_DASH_PATTERNS[planIndex]}
                  />
                  <text x="25" y="14" fill="#374151" fontSize="12">
                    {plan.name}
                  </text>
                </g>
              </g>
            );
          })}

          <line
            x1={getX(amount)}
            y1={PADDING}
            x2={getX(amount)}
            y2={SVG_HEIGHT - PADDING}
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
            x={SVG_WIDTH / 2}
            y={SVG_HEIGHT - 10}
            textAnchor="middle"
            fill="#374151"
            fontSize="12"
          >
            Investment Amount (€)
          </text>
          <text
            x="20"
            y={SVG_HEIGHT / 2}
            textAnchor="middle"
            transform={`rotate(-90, 20, ${SVG_HEIGHT / 2})`}
            fill="#374151"
            fontSize="12"
          >
            Net Profit (€)
          </text>
        </svg>
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
