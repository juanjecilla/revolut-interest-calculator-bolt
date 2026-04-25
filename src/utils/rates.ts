import { RATES_LAST_UPDATED, RATES_STALE_AFTER_DAYS } from '@/constants/plans';

export function isRatesStale(): boolean {
  const lastUpdated = new Date(RATES_LAST_UPDATED);
  const daysSince = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > RATES_STALE_AFTER_DAYS;
}

export function daysSinceRatesUpdate(): number {
  const lastUpdated = new Date(RATES_LAST_UPDATED);
  return Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
}
