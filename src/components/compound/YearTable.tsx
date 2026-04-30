import type { ProjectionPoint } from '@/utils/compound';
import { fmtMoney } from '@/utils/compound';

interface Props {
  points: ProjectionPoint[];
}

export function YearTable({ points }: Props) {
  const yearly = points.filter((p) => p.month > 0 && p.month % 12 === 0);
  const rows =
    yearly.length > 6
      ? yearly.filter((_, i, arr) => {
          const step = Math.ceil(arr.length / 6);
          return i % step === 0 || i === arr.length - 1;
        })
      : yearly;

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontVariantNumeric: 'tabular-nums',
        fontSize: 14,
      }}
    >
      <thead>
        <tr
          style={{
            color: 'var(--text-3)',
            textAlign: 'left',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <th style={{ padding: '10px 0', fontWeight: 600 }}>Year</th>
          <th style={{ padding: '10px 0', fontWeight: 600, textAlign: 'right' }}>Deposits</th>
          <th style={{ padding: '10px 0', fontWeight: 600, textAlign: 'right' }}>Interest</th>
          <th style={{ padding: '10px 0', fontWeight: 600, textAlign: 'right' }}>Balance</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => (
          <tr key={p.month} style={{ borderTop: '1px solid var(--line)' }}>
            <td style={{ padding: '14px 0', fontWeight: 600, color: 'var(--text-1)' }}>
              Y{p.month / 12}
            </td>
            <td style={{ padding: '14px 0', textAlign: 'right', color: 'var(--text-2)' }}>
              {fmtMoney(p.principal + p.deposits, 0)}
            </td>
            <td
              style={{
                padding: '14px 0',
                textAlign: 'right',
                color: 'var(--positive)',
                fontWeight: 600,
              }}
            >
              +{fmtMoney(p.interest, 0)}
            </td>
            <td
              style={{
                padding: '14px 0',
                textAlign: 'right',
                fontWeight: 700,
                color: 'var(--text-1)',
              }}
            >
              {fmtMoney(p.total, 0)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
