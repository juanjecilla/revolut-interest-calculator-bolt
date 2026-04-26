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
const SVG_WIDTH = 700;
const PAD_LEFT = 55;
const PAD_RIGHT = 20;
const PAD_TOP = 20;
const PAD_BOTTOM = 45;
const CHART_POINTS = 100;
const TOOLTIP_FLIP_THRESHOLD = 60;

interface TooltipData {
  amount: number;
  profits: number[];
  svgX: number;
}

const AXIS_COLOR_LIGHT = '#374151';
const AXIS_COLOR_DARK = '#9ca3af';
const GRID_COLOR_LIGHT = '#F1F5F9';
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
      SVG_HEIGHT -
      PAD_BOTTOM -
      ((profit - minProfit) / profitRange) * (SVG_HEIGHT - PAD_TOP - PAD_BOTTOM)
    );
  }

  function getX(amt: number) {
    return PAD_LEFT + (amt / maxAmount) * (SVG_WIDTH - PAD_LEFT - PAD_RIGHT);
  }

  function amountFromSvgX(svgX: number): number {
    return ((svgX - PAD_LEFT) / (SVG_WIDTH - PAD_LEFT - PAD_RIGHT)) * maxAmount;
  }

  function resolveTooltip(svgX: number) {
    if (svgX < PAD_LEFT || svgX > SVG_WIDTH - PAD_RIGHT) {
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

  const yTicks = Array.from({ length: 5 }, (_, i) => minProfit + (i / 4) * profitRange);
  const xTicks = Array.from({ length: 5 }, (_, i) => (i / 4) * maxAmount);

  function fmtProfit(v: number) {
    return `€${v >= 1000 || v <= -1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}`;
  }

  function fmtAmount(v: number) {
    return v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v.toFixed(0)}`;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
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
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {plan.name}
            </span>
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
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Your amount</span>
        </div>
      </div>

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

          {yTicks.map((val, i) => (
            <g key={i}>
              <line
                x1={PAD_LEFT}
                y1={getY(val)}
                x2={SVG_WIDTH - PAD_RIGHT}
                y2={getY(val)}
                stroke={gridColor}
                strokeWidth="1"
              />
              <text
                x={PAD_LEFT - 6}
                y={getY(val) + 4}
                textAnchor="end"
                fontSize="10"
                fill={axisColor}
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
                stroke={gridColor}
                strokeWidth="1"
              />
              <text
                x={getX(val)}
                y={SVG_HEIGHT - PAD_BOTTOM + 14}
                textAnchor="middle"
                fontSize="10"
                fill={axisColor}
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
            stroke={axisColor}
            strokeWidth="1.5"
          />
          <line
            x1={PAD_LEFT}
            y1={PAD_TOP}
            x2={PAD_LEFT}
            y2={SVG_HEIGHT - PAD_BOTTOM}
            stroke={axisColor}
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
                data-plan={plan.name}
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
              />
            );
          })}

          {tooltip && (
            <line
              x1={tooltip.svgX}
              y1={PAD_TOP}
              x2={tooltip.svgX}
              y2={SVG_HEIGHT - PAD_BOTTOM}
              stroke="#6b7280"
              strokeWidth="1"
              strokeDasharray="4,2"
            />
          )}

          <line
            x1={getX(amount)}
            y1={PAD_TOP}
            x2={getX(amount)}
            y2={SVG_HEIGHT - PAD_BOTTOM}
            stroke="#FF4B4B"
            strokeWidth="1.5"
            strokeDasharray="5,4"
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
            fill={axisColor}
            fontWeight="500"
          >
            Investment Amount (€)
          </text>
          <text
            x={12}
            y={(PAD_TOP + SVG_HEIGHT - PAD_BOTTOM) / 2}
            textAnchor="middle"
            fontSize="11"
            fill={axisColor}
            fontWeight="500"
            transform={`rotate(-90, 12, ${(PAD_TOP + SVG_HEIGHT - PAD_BOTTOM) / 2})`}
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

      <div className="mt-4 p-3 bg-slate-50 dark:bg-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-300">
        The red dashed line marks your current investment amount. The dot shows the best plan&apos;s
        net profit at that level. Hover to explore exact values.
      </div>
    </div>
  );
}
