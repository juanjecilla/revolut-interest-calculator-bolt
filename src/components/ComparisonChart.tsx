import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { PLANS, CHART_COLORS, CHART_DASH_PATTERNS } from '@/constants/plans';
import { generateChartData, findBestPlan, calculateNetProfit } from '@/utils/calculator';

const SVG_HEIGHT = 300;
const SVG_WIDTH = 700;
const PAD_LEFT = 55;
const PAD_RIGHT = 20;
const PAD_TOP = 20;
const PAD_BOTTOM = 45;
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
      SVG_HEIGHT -
      PAD_BOTTOM -
      ((profit - minProfit) / profitRange) * (SVG_HEIGHT - PAD_TOP - PAD_BOTTOM)
    );
  }

  function getX(amt: number) {
    return PAD_LEFT + (amt / maxAmount) * (SVG_WIDTH - PAD_LEFT - PAD_RIGHT);
  }

  const bestPlan = findBestPlan(amount, PLANS);

  const yTicks = Array.from({ length: 5 }, (_, i) => minProfit + (i / 4) * profitRange);
  const xTicks = Array.from({ length: 5 }, (_, i) => (i / 4) * maxAmount);

  function fmtProfit(v: number) {
    return `€${v >= 1000 || v <= -1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}`;
  }

  function fmtAmount(v: number) {
    return v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v.toFixed(0)}`;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#0075EB]" />
        Plan Comparison Chart
      </h3>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
        {PLANS.map((plan, i) => (
          <div key={plan.name} className="flex items-center gap-1.5">
            <svg width="20" height="10" aria-hidden="true">
              <line
                x1="0"
                y1="5"
                x2="20"
                y2="5"
                stroke={CHART_COLORS[i]}
                strokeWidth="3"
                strokeDasharray={
                  CHART_DASH_PATTERNS[i] === 'none' ? undefined : CHART_DASH_PATTERNS[i]
                }
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs font-medium text-gray-600">{plan.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <svg width="20" height="10" aria-hidden="true">
            <line
              x1="0"
              y1="5"
              x2="20"
              y2="5"
              stroke="#FF4B4B"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
          </svg>
          <span className="text-xs font-medium text-gray-600">Your amount</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-labelledby="chart-title"
        >
          <title id="chart-title">
            Net annual profit comparison for 5 Revolut subscription plans across investment amounts
          </title>

          {yTicks.map((val, i) => (
            <g key={i}>
              <line
                x1={PAD_LEFT}
                y1={getY(val)}
                x2={SVG_WIDTH - PAD_RIGHT}
                y2={getY(val)}
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <text
                x={PAD_LEFT - 6}
                y={getY(val) + 4}
                textAnchor="end"
                fontSize="10"
                fill="#9CA3AF"
              >
                {fmtProfit(val)}
              </text>
            </g>
          ))}

          {xTicks.map((val, i) => (
            <g key={i}>
              <line
                x1={getX(val)}
                y1={PAD_TOP}
                x2={getX(val)}
                y2={SVG_HEIGHT - PAD_BOTTOM}
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <text
                x={getX(val)}
                y={SVG_HEIGHT - PAD_BOTTOM + 14}
                textAnchor="middle"
                fontSize="10"
                fill="#9CA3AF"
              >
                {fmtAmount(val)}
              </text>
            </g>
          ))}

          <line
            x1={PAD_LEFT}
            y1={SVG_HEIGHT - PAD_BOTTOM}
            x2={SVG_WIDTH - PAD_RIGHT}
            y2={SVG_HEIGHT - PAD_BOTTOM}
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          <line
            x1={PAD_LEFT}
            y1={PAD_TOP}
            x2={PAD_LEFT}
            y2={SVG_HEIGHT - PAD_BOTTOM}
            stroke="#CBD5E1"
            strokeWidth="1.5"
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
                strokeWidth="2.5"
                strokeDasharray={
                  CHART_DASH_PATTERNS[planIndex] === 'none'
                    ? undefined
                    : CHART_DASH_PATTERNS[planIndex]
                }
                strokeLinejoin="round"
                strokeLinecap="round"
                aria-label={`${plan.name} plan net profit line`}
              />
            );
          })}

          <line
            x1={getX(amount)}
            y1={PAD_TOP}
            x2={getX(amount)}
            y2={SVG_HEIGHT - PAD_BOTTOM}
            stroke="#FF4B4B"
            strokeWidth="1.5"
            strokeDasharray="5,4"
            aria-label="Current investment amount indicator"
          />
          <circle
            cx={getX(amount)}
            cy={getY(calculateNetProfit(amount, bestPlan))}
            r="5"
            fill="#FF4B4B"
            stroke="white"
            strokeWidth="2"
          />

          <text
            x={(PAD_LEFT + SVG_WIDTH - PAD_RIGHT) / 2}
            y={SVG_HEIGHT - 5}
            textAnchor="middle"
            fontSize="11"
            fill="#6B7280"
            fontWeight="500"
          >
            Investment Amount (€)
          </text>
          <text
            x={12}
            y={(PAD_TOP + SVG_HEIGHT - PAD_BOTTOM) / 2}
            textAnchor="middle"
            fontSize="11"
            fill="#6B7280"
            fontWeight="500"
            transform={`rotate(-90, 12, ${(PAD_TOP + SVG_HEIGHT - PAD_BOTTOM) / 2})`}
          >
            Net Profit (€)
          </text>
        </svg>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-xl text-sm text-gray-500">
        The red dashed line marks your current investment amount. The dot shows the best plan's net
        profit at that level.
      </div>
    </div>
  );
}
