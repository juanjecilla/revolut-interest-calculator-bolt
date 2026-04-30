import { describe, it, expect } from 'vitest';
import { computeProjection, fmtMoney, fmtCompact } from './compound';

describe('computeProjection', () => {
  it('returns month-0 point equal to principal', () => {
    const pts = computeProjection({ principal: 1000, rate: 5, months: 1 });
    expect(pts[0]).toEqual({ month: 0, principal: 1000, deposits: 0, interest: 0, total: 1000 });
  });

  it('returns months+1 points total', () => {
    const pts = computeProjection({ principal: 1000, rate: 5, months: 12 });
    expect(pts).toHaveLength(13);
  });

  it('grows principal with 0% rate and no monthly deposits', () => {
    const pts = computeProjection({ principal: 1000, rate: 0, months: 3 });
    pts.forEach((p) => {
      expect(p.total).toBeCloseTo(1000, 5);
      expect(p.interest).toBe(0);
    });
  });

  it('accumulates monthly deposits in deposits field', () => {
    const pts = computeProjection({ principal: 0, rate: 0, months: 3, monthly: 100 });
    expect(pts[1].deposits).toBe(100);
    expect(pts[2].deposits).toBe(200);
    expect(pts[3].deposits).toBe(300);
  });

  it('interest is 0 when bal <= contributed (rate 0)', () => {
    const pts = computeProjection({ principal: 1000, rate: 0, months: 6, monthly: 50 });
    pts.forEach((p) => expect(p.interest).toBe(0));
  });

  it('interest grows with positive rate', () => {
    const pts = computeProjection({ principal: 10000, rate: 6, months: 12 });
    expect(pts[12].interest).toBeGreaterThan(0);
    expect(pts[12].total).toBeGreaterThan(10000);
  });

  it('total at month 12 matches known compound formula (no monthly)', () => {
    const principal = 1000;
    const rate = 12;
    const pts = computeProjection({ principal, rate, months: 12 });
    const r = rate / 100 / 12;
    const expected = principal * Math.pow(1 + r, 12);
    expect(pts[12].total).toBeCloseTo(expected, 6);
  });

  it('month field matches loop index', () => {
    const pts = computeProjection({ principal: 500, rate: 3, months: 5 });
    pts.forEach((p, i) => expect(p.month).toBe(i));
  });

  it('principal field is constant across all points', () => {
    const pts = computeProjection({ principal: 2500, rate: 4, months: 6, monthly: 200 });
    pts.forEach((p) => expect(p.principal).toBe(2500));
  });
});

describe('fmtMoney', () => {
  it('formats large numbers with 0 decimals by default', () => {
    const result = fmtMoney(10000);
    expect(result).toContain('10');
    expect(result).toContain('000');
    expect(result).toContain('€');
  });

  it('formats small numbers with 2 decimals by default', () => {
    const result = fmtMoney(9.99);
    expect(result).toContain('9');
    expect(result).toContain('€');
  });

  it('respects explicit decimals override', () => {
    const result = fmtMoney(100, 3);
    expect(result).toContain('100');
    expect(result).toContain('€');
  });

  it('formats negative values', () => {
    const result = fmtMoney(-50);
    expect(result).toContain('50');
    expect(result).toContain('€');
  });
});

describe('fmtCompact', () => {
  it('prepends € to compact notation', () => {
    const result = fmtCompact(1000);
    expect(result).toMatch(/^€/);
  });

  it('uses compact notation for large numbers', () => {
    const result = fmtCompact(1_000_000);
    expect(result.length).toBeLessThan(8);
  });

  it('formats small numbers without compact suffix', () => {
    const result = fmtCompact(500);
    expect(result).toContain('500');
  });
});
