import { useMemo, useState, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import { PLANS, CHART_COLORS, CHART_DASH_PATTERNS } from '@/constants/plans';
import {
  generateChartData,
  findBestPlan,
  calculateNetProfit,
  formatEuro,
} from '@/utils/calculator';

const SVG_HEIGHT = 300;
const SVG_WIDTH = 800;
const PADDING = 40;
const CHART_POINTS = 100;
const TOOLTIP_FLIP_THRESHOLD = 60;

interface TooltipData {
  amount: number;
  profits: number[];
  svgX: number;
}

const AXIS_COLOR_LIGHT = '#374151';
const AXIS_COLOR_DARK = '#9ca3af';
const GRID_COLOR_LIGHT = '#f1f5f9';
const GRID_COLOR_DARK = '#1f2937';

interface Props {
  amount: number;
  dark?: boolean;
}

export function ComparisonChart({ amount, dark = false }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const maxAmount = useMemo(() => Math.max(amount * 1.5, 50000), [amount]);
  const chartData = useMemo(() => generateChartData(maxAmount, CHART_POINTS, PLANS), [maxAmount]);

  const allProfits = chartData.flatMap((d) => d.profits);
  const maxProfit = Math.max(...allProfits);
  const minProfit = Math.min(...allProfits);
  const profitRange = maxProfit - minProfit || 1;

  const axisColor = dark ? AXIS_COLOR_DARK : AXIS_COLOR_LIGHT;
  const gridColor = dark ? GRID_COLOR_DARK : GRID_COLOR_LIGHT;

  function getY(profit: number) {
    return SVG_HEIGHT - PADDING - ((profit - minProfit) / profitRange) * (SVG_HEIGHT - 2 * PADDING);
  }

  function getX(amt: number) {
    return PADDING + (amt / maxAmount) * (SVG_WIDTH - 2 * PADDING);
  }

  function amountFromSvgX(svgX: number): number {
    return ((svgX - PADDING) / (SVG_WIDTH - 2 * PADDING)) * maxAmount;
  }

  function resolveTooltip(svgX: number) {
    if (svgX < PADDING || svgX > SVG_WIDTH - PADDING) {
      setTooltip(null);
      return;
    }
    const hoveredAmount = amountFromSvgX(svgX);
    const pointIndex = Math.min(
      Math.round((hoveredAmount / maxAmount) * (CHART_POINTS - 1)),
      CHART_POINTS - 1
    );
    const point = chartData[Math.max(0, pointIndex)];
    setTooltip({ amount: point.amount, profits: point.profits, svgX });
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = SVG_WIDTH / rect.width;
      resolveTooltip((e.clientX - rect.left) * scaleX);
    },
    [chartData, maxAmount] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleTouch = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = SVG_WIDTH / rect.width;
      resolveTooltip((e.touches[0].clientX - rect.left) * scaleX);
    },
    [chartData, maxAmount] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const bestPlan = findBestPlan(amount, PLANS);
  const tooltipLeftPct = tooltip ? (tooltip.svgX / SVG_WIDTH) * 100 : 0;
  const tooltipOnRight = tooltipLeftPct > TOOLTIP_FLIP_THRESHOLD;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-colors duration-300">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        Plan Comparison Chart
      </h3>

      <div className="overflow-x-auto relative">
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="w-full h-auto cursor-crosshair"
          role="img"
          aria-labelledby="chart-title"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          onTouchEnd={() => setTooltip(null)}
        >
          <title id="chart-title">
            Net annual profit comparison for 5 Revolut subscription plans across investment amounts
          </title>

          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={gridColor} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <line
            x1={PADDING}
            y1={SVG_HEIGHT - PADDING}
            x2={SVG_WIDTH - PADDING}
            y2={SVG_HEIGHT - PADDING}
            stroke={axisColor}
            strokeWidth="2"
          />
          <line
            x1={PADDING}
            y1={PADDING}
            x2={PADDING}
            y2={SVG_HEIGHT - PADDING}
            stroke={axisColor}
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
                  <text x="25" y="14" fill={axisColor} fontSize="12">
                    {plan.name}
                  </text>
                </g>
              </g>
            );
          })}

          {tooltip && (
            <line
              x1={tooltip.svgX}
              y1={PADDING}
              x2={tooltip.svgX}
              y2={SVG_HEIGHT - PADDING}
              stroke="#6b7280"
              strokeWidth="1"
              strokeDasharray="4,2"
            />
          )}

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
            fill={axisColor}
            fontSize="12"
          >
            Investment Amount (€)
          </text>
          <text
            x="20"
            y={SVG_HEIGHT / 2}
            textAnchor="middle"
            transform={`rotate(-90, 20, ${SVG_HEIGHT / 2})`}
            fill={axisColor}
            fontSize="12"
          >
            Net Profit (€)
          </text>
        </svg>

        {tooltip && (
          <div
            className="pointer-events-none absolute top-2 z-10 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-52 text-xs"
            style={{
              left: tooltipOnRight ? undefined : `calc(${tooltipLeftPct}% + 8px)`,
              right: tooltipOnRight ? `calc(${100 - tooltipLeftPct}% + 8px)` : undefined,
            }}
            aria-live="polite"
          >
            <p className="font-semibold text-gray-700 mb-2 border-b pb-1">
              €{Math.round(tooltip.amount).toLocaleString()}
            </p>
            {PLANS.map((plan, i) => (
              <div key={plan.name} className="flex justify-between items-center py-0.5">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-0.5"
                    style={{ background: CHART_COLORS[i] }}
                  />
                  <span className="text-gray-600">{plan.name}</span>
                </span>
                <span
                  className={`font-semibold ${tooltip.profits[i] >= 0 ? 'text-green-600' : 'text-red-500'}`}
                >
                  {formatEuro(tooltip.profits[i])}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Hover over the chart to see exact profit values for each plan. The red dashed line shows
          your current investment amount.
        </p>
      </div>
    </div>
  );
}
