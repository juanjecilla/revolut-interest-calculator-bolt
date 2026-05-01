interface Props {
  label: string;
  value: string;
  accent?: string;
}

export function StatCard({ label, value, accent }: Props) {
  return (
    <div
      style={{
        background: accent || 'var(--bg-surface)',
        color: accent ? '#fff' : 'var(--text-1)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px',
        border: accent ? 'none' : '1.5px solid var(--line)',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: accent ? 0.85 : 0.6,
        }}
      >
        {label}
      </div>
      <div
        className="tabular"
        style={{
          fontWeight: 800,
          letterSpacing: '-0.025em',
          fontSize: 28,
          lineHeight: 1,
          marginTop: 8,
        }}
      >
        {value}
      </div>
    </div>
  );
}
