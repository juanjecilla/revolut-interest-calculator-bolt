import { TrendingUp, Crown, Star, Zap, Shield } from 'lucide-react';
import type { Plan } from '@/types';

export const KOFI_URL = 'https://ko-fi.com/juanjecilla';
export const REVOLUT_PRICING_URL = 'https://www.revolut.com/pricing-plans/';

/** ISO date when plan rates/fees were last verified against revolut.com */
export const RATES_LAST_UPDATED = '2026-04-25';

/** Show stale warning after this many days without a rates update */
export const RATES_STALE_AFTER_DAYS = 90;

export const CHART_COLORS = ['#6B7280', '#0075EB', '#00B9FF', '#555B63', '#FFB800'] as const;

export const CHART_DASH_PATTERNS = ['none', '6,3', '4,4', '8,2,2,2', '2,2'] as const;

export const PLANS: Plan[] = [
  {
    name: 'Standard',
    monthlyFee: 0,
    interestRate: 1.25,
    icon: <Shield className="w-6 h-6" />,
    colorClass: 'from-[#6B7280] to-[#9CA3AF]',
    description: 'Free plan',
  },
  {
    name: 'Plus',
    monthlyFee: 3.99,
    interestRate: 1.25,
    icon: <Star className="w-6 h-6" />,
    colorClass: 'from-[#0075EB] to-[#00B9FF]',
    description: 'Basic premium',
  },
  {
    name: 'Premium',
    monthlyFee: 8.99,
    interestRate: 1.51,
    icon: <TrendingUp className="w-6 h-6" />,
    colorClass: 'from-[#00B9FF] to-[#00D4AA]',
    description: 'Enhanced returns',
  },
  {
    name: 'Metal',
    monthlyFee: 15.99,
    interestRate: 2.02,
    icon: <Crown className="w-6 h-6" />,
    colorClass: 'from-[#191C1F] to-[#3D4247]',
    description: 'Premium experience',
  },
  {
    name: 'Ultra',
    monthlyFee: 45,
    interestRate: 2.27,
    icon: <Zap className="w-6 h-6" />,
    colorClass: 'from-[#FFB800] to-[#FF8C00]',
    description: 'Ultimate rewards',
  },
];
