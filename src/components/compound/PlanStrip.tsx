import { COMPOUND_PLANS } from './plans';
import type { CompoundPlan } from './plans';

export type { CompoundPlan };

interface Props {
  plan: CompoundPlan;
  onChange: (plan: CompoundPlan) => void;
}

export function PlanStrip({ plan, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Revolut plan"
      style={{
        display: 'flex',
        gap: 0,
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--line)',
      }}
    >
      {COMPOUND_PLANS.map((p, i) => {
        const selected = plan.name === p.name;
        return (
          <button
            key={p.name}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(p)}
            style={{
              flex: 1,
              padding: '14px 4px',
              cursor: 'pointer',
              background: selected ? 'var(--text-1)' : 'transparent',
              color: selected ? 'var(--bg-surface)' : 'var(--text-1)',
              border: 0,
              borderLeft: i === 0 ? '0' : '1.5px solid var(--line)',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'all var(--dur) var(--ease)',
              minHeight: 44,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                opacity: selected ? 0.7 : 0.6,
              }}
            >
              {p.name}
            </span>
            <span
              className="tabular"
              style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              {p.rate.toFixed(2)}
              <span style={{ fontSize: 11, fontWeight: 600 }}>%</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
