import { describe, it, expect } from 'vitest';
import { calculateNetProfit, findBestPlan, formatEuro } from './calculator';
import type { PlanData } from '@/types';

const mockPlans: PlanData[] = [
  { name: 'Standard', monthlyFee: 0, interestRate: 1.25, colorClass: '', description: '' },
  { name: 'Plus', monthlyFee: 3.99, interestRate: 1.25, colorClass: '', description: '' },
  { name: 'Premium', monthlyFee: 8.99, interestRate: 1.51, colorClass: '', description: '' },
  { name: 'Metal', monthlyFee: 15.99, interestRate: 2.02, colorClass: '', description: '' },
  { name: 'Ultra', monthlyFee: 45, interestRate: 2.27, colorClass: '', description: '' },
];

describe('calculateNetProfit', () => {
  it('returns gross earnings for Standard (no fee)', () => {
    expect(calculateNetProfit(10000, mockPlans[0])).toBeCloseTo(125.0);
  });

  it('deducts annual fee correctly for Plus', () => {
    // 10000 * 1.25% = 125, annual fee = 3.99*12 = 47.88, net = 77.12
    expect(calculateNetProfit(10000, mockPlans[1])).toBeCloseTo(77.12);
  });

  it('returns negative profit when fee exceeds earnings', () => {
    // Ultra at €100: 100 * 2.27% = 2.27, fee = 45*12 = 540, net = -537.73
    expect(calculateNetProfit(100, mockPlans[4])).toBeLessThan(0);
  });

  it('returns 0 for amount=0 with no-fee plan', () => {
    expect(calculateNetProfit(0, mockPlans[0])).toBe(0);
  });

  it('handles very large amounts', () => {
    const result = calculateNetProfit(1_000_000, mockPlans[4]);
    expect(result).toBeGreaterThan(0);
  });
});

describe('findBestPlan', () => {
  it('returns Standard for zero investment (free beats paid fees)', () => {
    expect(findBestPlan(0, mockPlans).name).toBe('Standard');
  });

  it('returns Ultra for very high amounts', () => {
    expect(findBestPlan(1_000_000, mockPlans).name).toBe('Ultra');
  });

  it('works with a single plan', () => {
    expect(findBestPlan(5000, [mockPlans[0]])).toBe(mockPlans[0]);
  });

  it('is deterministic — same input always returns same plan', () => {
    const result1 = findBestPlan(50000, mockPlans);
    const result2 = findBestPlan(50000, mockPlans);
    expect(result1.name).toBe(result2.name);
  });
});

describe('formatEuro', () => {
  it('formats positive values with 2 decimal places', () => {
    expect(formatEuro(125)).toMatch(/125,00/);
  });

  it('formats negative values', () => {
    const result = formatEuro(-47.88);
    expect(result).toMatch(/47,88/);
  });

  it('formats zero', () => {
    expect(formatEuro(0)).toMatch(/0,00/);
  });
});
