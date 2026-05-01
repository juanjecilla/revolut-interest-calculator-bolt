import { useMemo, useState } from 'react';
import { PlanStrip } from '@/components/compound/PlanStrip';
import { COMPOUND_PLANS } from '@/components/compound/plans';
import type { CompoundPlan } from '@/components/compound/plans';
import { ValueInput } from '@/components/compound/ValueInput';
import { StatCard } from '@/components/compound/StatCard';
import { ProjectionChartNew } from '@/components/compound/ProjectionChartNew';
import { YearTable } from '@/components/compound/YearTable';
import { computeProjection, fmtMoney } from '@/utils/compound';

interface Props {
  dark: boolean;
}

export function CompoundCalculator({ dark }: Props) {
  const [principal, setPrincipal] = useState(15000);
  const [monthly, setMonthly] = useState(400);
  const [years, setYears] = useState(10);
  const [plan, setPlan] = useState<CompoundPlan>(COMPOUND_PLANS[2]); // Premium
  const [comparePlan, setComparePlan] = useState<CompoundPlan>(COMPOUND_PLANS[0]); // Standard

  const months = years * 12;

  const points = useMemo(
    () => computeProjection({ principal, rate: plan.rate, months, monthly }),
    [principal, plan.rate, months, monthly]
  );

  const cmpPoints = useMemo(
    () => computeProjection({ principal, rate: comparePlan.rate, months, monthly }),
    [principal, comparePlan.rate, months, monthly]
  );

  const last = points[points.length - 1];
  const cmpLast = cmpPoints[cmpPoints.length - 1];
  const advantage = last.total - cmpLast.total;
  const totalDeposits = principal + monthly * months;
  const effectiveUplift = totalDeposits > 0 ? (last.interest / totalDeposits) * 100 : 0;

  return (
    <main
      style={{
        padding: '20px 40px 60px',
        maxWidth: 1320,
        margin: '0 auto',
      }}
    >
      {/* Hero strip */}
      <section
        style={{
          background: 'var(--bg-hero)',
          color: '#fff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 44px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 24,
        }}
      >
        {/* Decorative blob */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -80,
            top: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--brand-ink) 0%, transparent 70%)',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 40,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Left: headline */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--brand-accent)',
                }}
              />
              Live · {plan.name} · {plan.rate.toFixed(2)}% AER
            </div>

            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
              In {years} year{years !== 1 ? 's' : ''}, you&apos;ll have
            </div>

            <div
              className="tabular"
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                background: 'linear-gradient(120deg, #fff 0%, var(--brand-accent) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {fmtMoney(last.total, 0)}
            </div>

            <div
              style={{ marginTop: 18, fontSize: 17, lineHeight: 1.4, opacity: 0.85, maxWidth: 460 }}
            >
              That&apos;s{' '}
              <span style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>
                +{fmtMoney(last.interest, 0)}
              </span>{' '}
              earned in interest — <span className="tabular">{effectiveUplift.toFixed(1)}%</span> on
              top of every euro you put in.
            </div>
          </div>

          {/* Right: inputs card */}
          <div
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-1)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--pad-card)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <PlanStrip plan={plan} onChange={setPlan} />
            <ValueInput
              label="Initial deposit"
              value={principal}
              onChange={setPrincipal}
              min={0}
              max={250000}
              step={500}
              prefix="€"
            />
            <ValueInput
              label="Monthly deposit"
              value={monthly}
              onChange={setMonthly}
              min={0}
              max={5000}
              step={50}
              prefix="€"
            />
            <ValueInput
              label="Time horizon"
              value={years}
              onChange={setYears}
              min={1}
              max={30}
              step={1}
              suffix=" years"
            />
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 24,
        }}
        aria-label="Summary statistics"
      >
        <StatCard label="Deposits" value={fmtMoney(totalDeposits, 0)} />
        <StatCard
          label="Interest"
          value={'+' + fmtMoney(last.interest, 0)}
          accent="var(--brand-ink)"
        />
        <StatCard label="Avg / month" value={'+' + fmtMoney(last.interest / months, 0)} />
        <StatCard label="Effective uplift" value={effectiveUplift.toFixed(1) + '%'} />
      </section>

      {/* Chart + Comparison */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 16,
          marginBottom: 24,
        }}
        aria-label="Growth chart and plan comparison"
      >
        {/* Chart */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--pad-card)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 18,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: 22,
                margin: 0,
                letterSpacing: '-0.01em',
                color: 'var(--text-1)',
              }}
            >
              Growth over time
            </h2>
            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: 'var(--brand-ink)',
                  }}
                  aria-hidden="true"
                />
                Deposits
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: 'var(--brand-accent)',
                  }}
                  aria-hidden="true"
                />
                Total
              </span>
            </div>
          </div>
          <ProjectionChartNew points={points} height={300} dark={dark} />
        </div>

        {/* Comparison card */}
        <div
          style={{
            background: 'var(--brand-ink)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--pad-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            Versus {comparePlan.name}
          </div>

          <div>
            <div
              className="tabular"
              style={{ fontWeight: 800, fontSize: 52, letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              {advantage >= 0 ? '+' : ''}
              {fmtMoney(advantage, 0)}
            </div>
            <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6 }}>
              {advantage >= 0 ? 'more' : 'less'} than the {comparePlan.name} plan over {years} year
              {years !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {COMPOUND_PLANS.map((p) => {
              const sel = comparePlan.name === p.name;
              const dis = plan.name === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => !dis && setComparePlan(p)}
                  disabled={dis}
                  aria-pressed={sel}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-pill)',
                    background: sel ? '#fff' : 'rgba(255,255,255,0.12)',
                    color: sel ? 'var(--brand-ink)' : '#fff',
                    border: 0,
                    cursor: dis ? 'not-allowed' : 'pointer',
                    opacity: dis ? 0.4 : 1,
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: 13,
                    minHeight: 40,
                  }}
                >
                  <span>
                    {p.name}
                    {dis && ' · current'}
                  </span>
                  <span className="tabular">{p.rate.toFixed(2)}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Year breakdown */}
      <section
        style={{
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--pad-card)',
        }}
        aria-label="Year by year breakdown"
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: 22,
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
            color: 'var(--text-1)',
          }}
        >
          Year by year
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '0 0 12px' }}>
          Balance snapshot at each year-end.
        </p>
        <YearTable points={points} />
      </section>
    </main>
  );
}
