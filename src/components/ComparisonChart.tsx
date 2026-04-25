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
const SVG_WIDTH = 760;
const PADDING_LEFT = 40;
const PADDING_RIGHT = 20;
const PADDING_V = 40;
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
    return (
      SVG_HEIGHT - PADDING_V - ((profit - minProfit) / profitRange) * (SVG_HEIGHT - 2 * PADDING_V)
    );
  }

  function getX(amt: number) {
    return PADDING_LEFT + (amt / maxAmount) * (SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT);
  }

  function amountFromSvgX(svgX: number): number {
    return ((svgX - PADDING_LEFT) / (SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT)) * maxAmount;
  }

  function resolveTooltip(svgX: number) {
    if (svgX < PADDING_LEFT || svgX > SVG_WIDTH - PADDING_RIGHT) {
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

      <div className="relative">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
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
            x1={PADDING_LEFT}
            y1={SVG_HEIGHT - PADDING_V}
            x2={SVG_WIDTH - PADDING_RIGHT}
            y2={SVG_HEIGHT - PADDING_V}
            stroke={axisColor}
            strokeWidth="2"
          />
          <line
            x1={PADDING_LEFT}
            y1={PADDING_V}
            x2={PADDING_LEFT}
            y2={SVG_HEIGHT - PADDING_V}
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

          {tooltip && (
            <line
              x1={tooltip.svgX}
              y1={PADDING_V}
              x2={tooltip.svgX}
              y2={SVG_HEIGHT - PADDING_V}
              stroke="#6b7280"
              strokeWidth="1"
              strokeDasharray="4,2"
            />
          )}

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
            fill={axisColor}
            fontSize="12"
          >
            Investment Amount (€)
          </text>
          <text
            x="14"
            y={SVG_HEIGHT / 2}
            textAnchor="middle"
            transform={`rotate(-90, 14, ${SVG_HEIGHT / 2})`}
            fill={axisColor}
            fontSize="12"
          >
            Net Profit (€)
          </text>
        </svg>

        {tooltip && (
          <div
            className="pointer-events-none absolute top-2 z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 w-52 text-xs"
            style={{
              left: tooltipOnRight ? undefined : `calc(${tooltipLeftPct}% + 8px)`,
              right: tooltipOnRight ? `calc(${100 - tooltipLeftPct}% + 8px)` : undefined,
            }}
            aria-live="polite"
          >
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2 border-b dark:border-gray-700 pb-1">
              €{Math.round(tooltip.amount).toLocaleString()}
            </p>
            {PLANS.map((plan, i) => (
              <div key={plan.name} className="flex justify-between items-center py-0.5">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-0.5"
                    style={{ background: CHART_COLORS[i] }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">{plan.name}</span>
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
            <span className="text-sm text-gray-700 dark:text-gray-300">{plan.name}</span>
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
          <span className="text-sm text-gray-700 dark:text-gray-300">Your amount</span>
        </div>
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
