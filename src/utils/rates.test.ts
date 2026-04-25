import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isRatesStale, daysSinceRatesUpdate } from './rates';

describe('isRatesStale', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false when rates updated recently', () => {
    // Set today to 30 days after RATES_LAST_UPDATED (2026-04-25)
    const recent = new Date('2026-05-25');
    vi.setSystemTime(recent);
    expect(isRatesStale()).toBe(false);
  });

  it('returns true when rates updated more than 90 days ago', () => {
    const stale = new Date('2026-07-25');
    vi.setSystemTime(stale);
    expect(isRatesStale()).toBe(true);
  });
});

describe('daysSinceRatesUpdate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns correct number of days', () => {
    vi.setSystemTime(new Date('2026-05-25'));
    expect(daysSinceRatesUpdate()).toBe(30);
  });
});
