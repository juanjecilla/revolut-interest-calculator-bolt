import { useRef, useState, useEffect } from 'react';
import type { ProjectionPoint } from '@/utils/compound';
import { fmtMoney, fmtCompact } from '@/utils/compound';

interface Props {
  points: ProjectionPoint[];
  height?: number;
  dark?: boolean;
}

const COLOR_PRINCIPAL = 'var(--brand-ink)';
const COLOR_INTEREST = 'var(--brand-accent)';

export function ProjectionChartNew({ points, height = 280, dark = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.max(280, e.contentRect.width));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const padL = 56;
  const padR = 8;
  const padT = 14;
  const padB = 26;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const maxTotal = Math.max(...points.map((p) => p.total), 1);

  const xs = (i: number) => padL + (i / (points.length - 1)) * innerW;
  const ys = (v: number) => padT + innerH - (v / maxTotal) * innerH;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => maxTotal * t);
  const totalMonths = points.length - 1;
  const yearStep = totalMonths <= 24 ? 6 : totalMonths <= 60 ? 12 : 24;
  const xLabels: number[] = [];
  for (let m = 0; m <= totalMonths; m += yearStep) xLabels.push(m);
  if (xLabels[xLabels.length - 1] !== totalMonths) xLabels.push(totalMonths);

  const axisColor = dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,14,20,0.08)';

  let principalPath = '';
  let totalPath = '';
  points.forEach((p, i) => {
    const x = xs(i);
    const yP = ys(p.principal + p.deposits);
    const yT = ys(p.total);
    principalPath += (i === 0 ? 'M' : 'L') + x + ' ' + yP + ' ';
    totalPath += (i === 0 ? 'M' : 'L') + x + ' ' + yT + ' ';
  });
  const principalArea =
    principalPath + `L${xs(points.length - 1)} ${padT + innerH} L${xs(0)} ${padT + innerH} Z`;
  const totalArea =
    totalPath + `L${xs(points.length - 1)} ${padT + innerH} L${xs(0)} ${padT + innerH} Z`;

  const hp = hover != null ? points[hover] : null;

  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (w / rect.width);
    if (x < padL || x > padL + innerW) {
      setHover(null);
      return;
    }
    const t = (x - padL) / innerW;
    setHover(Math.round(t * (points.length - 1)));
  }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <svg
        width={w}
        height={height}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={`Growth projection. Final balance ${fmtMoney(points[points.length - 1].total, 0)} after ${Math.round(totalMonths / 12)} years.`}
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="pcn-grad-total" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={COLOR_INTEREST} stopOpacity="0.35" />
            <stop offset="100%" stopColor={COLOR_INTEREST} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="pcn-grad-prin" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={COLOR_PRINCIPAL} stopOpacity="0.3" />
            <stop offset="100%" stopColor={COLOR_PRINCIPAL} stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Y-axis ticks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={padL + innerW}
              y1={ys(t)}
              y2={ys(t)}
              stroke={axisColor}
              strokeWidth={1}
              strokeDasharray={i === 0 ? '0' : '2 4'}
            />
            <text
              x={padL - 8}
              y={ys(t) + 4}
              fontSize="11"
              textAnchor="end"
              fill="var(--text-3)"
              fontVariantNumeric="tabular-nums"
            >
              {fmtCompact(t)}
            </text>
          </g>
        ))}

        {/* Area fills */}
        <path d={totalArea} fill="url(#pcn-grad-total)" />
        <path d={principalArea} fill="url(#pcn-grad-prin)" />

        {/* Lines */}
        <path
          d={totalPath}
          stroke={COLOR_INTEREST}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={principalPath}
          stroke={COLOR_PRINCIPAL}
          strokeWidth="2"
          fill="none"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />

        {/* X labels */}
        {xLabels.map((m, i) => {
          const idx = points.findIndex((p) => p.month === m);
          return (
            <text
              key={i}
              x={xs(idx)}
              y={padT + innerH + 18}
              fontSize="11"
              textAnchor="middle"
              fill="var(--text-3)"
            >
              {m === 0 ? 'Now' : `${Math.round(m / 12)}y`}
            </text>
          );
        })}

        {/* Hover crosshair */}
        {hover != null && hp && (
          <g>
            <line
              x1={xs(hover)}
              x2={xs(hover)}
              y1={padT}
              y2={padT + innerH}
              stroke="var(--text-1)"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
            <circle
              cx={xs(hover)}
              cy={ys(hp.total)}
              r="5"
              fill="var(--bg-surface)"
              stroke={COLOR_INTEREST}
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {hover != null && hp && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(Math.max(xs(hover) - 90, 8), w - 190),
            top: 8,
            background: 'var(--bg-surface)',
            color: 'var(--text-1)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '10px 12px',
            fontSize: 12,
            boxShadow: 'var(--shadow-2)',
            pointerEvents: 'none',
            minWidth: 182,
          }}
        >
          <div style={{ color: 'var(--text-3)', marginBottom: 4 }}>
            {hp.month === 0 ? 'Today' : `${(hp.month / 12).toFixed(1)} years`}
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }} className="tabular">
            {fmtMoney(hp.total, 0)}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              color: 'var(--text-2)',
            }}
          >
            <span>Deposits</span>
            <span className="tabular">{fmtMoney(hp.principal + hp.deposits, 0)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              color: 'var(--positive)',
            }}
          >
            <span>Interest</span>
            <span className="tabular">+{fmtMoney(hp.interest, 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
