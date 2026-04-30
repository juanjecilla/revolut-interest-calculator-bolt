export interface ProjectionPoint {
  month: number;
  principal: number;
  deposits: number;
  interest: number;
  total: number;
}

export function computeProjection({
  principal,
  rate,
  months,
  monthly = 0,
}: {
  principal: number;
  rate: number;
  months: number;
  monthly?: number;
}): ProjectionPoint[] {
  const r = rate / 100 / 12;
  const points: ProjectionPoint[] = [
    { month: 0, principal, deposits: 0, interest: 0, total: principal },
  ];
  let bal = principal;
  let totalDeposits = 0;
  for (let m = 1; m <= months; m++) {
    bal = bal * (1 + r) + monthly;
    totalDeposits += monthly;
    const contributed = principal + totalDeposits;
    points.push({
      month: m,
      principal,
      deposits: totalDeposits,
      interest: Math.max(0, bal - contributed),
      total: bal,
    });
  }
  return points;
}

export function fmtMoney(n: number, decimals?: number): string {
  const d = decimals ?? (n >= 10000 ? 0 : 2);
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n);
}

export function fmtCompact(n: number): string {
  const v = new Intl.NumberFormat('de-DE', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
  return '€' + v;
}
