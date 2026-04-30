interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  id?: string;
}

export function ValueInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  id,
}: Props) {
  const safeId = id ?? `vi-${label.replace(/\W+/g, '-').toLowerCase()}`;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={safeId} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-3)' }}>
        {label}
      </label>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          padding: '12px 14px',
          background: 'var(--bg-inset)',
          border: '1.5px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          transition: 'border-color var(--dur) var(--ease)',
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand-ink)')
        }
        onBlur={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line)')}
      >
        {prefix && (
          <span style={{ color: 'var(--text-3)', fontSize: 20, fontWeight: 500 }}>{prefix}</span>
        )}
        <input
          id={safeId}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          aria-label={label}
          className="flex-1 bg-transparent border-0 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-1)',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
        {suffix && (
          <span style={{ color: 'var(--text-3)', fontSize: 14, fontWeight: 500 }}>{suffix}</span>
        )}
      </div>

      <input
        id={`${safeId}-s`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={`${label} (slider)`}
        style={{ '--_pct': `${pct}%` } as React.CSSProperties}
        className="w-full cursor-pointer"
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--text-3)',
          fontVariantNumeric: 'tabular-nums',
          marginTop: -4,
        }}
      >
        <span>
          {prefix}
          {min.toLocaleString()}
          {suffix}
        </span>
        <span>
          {prefix}
          {max.toLocaleString()}
          {suffix}
        </span>
      </div>
    </div>
  );
}
