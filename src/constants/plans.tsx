import { TrendingUp, Crown, Star, Zap, Shield } from 'lucide-react';
import type { Plan } from '@/types';

export const KOFI_URL = 'https://ko-fi.com/juanjecilla';

/** ISO date when plan rates/fees were last verified against revolut.com */
export const RATES_LAST_UPDATED = '2025-04-25';

/** Show stale warning after this many days without a rates update */
export const RATES_STALE_AFTER_DAYS = 90;

export const CHART_COLORS = ['#6b7280', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'] as const;

export const CHART_DASH_PATTERNS = ['none', '6,3', '4,4', '8,2,2,2', '2,2'] as const;

export const PLANS: Plan[] = [
  {
    name: 'Standard',
    monthlyFee: 0,
    interestRate: 1.25,
    icon: <Shield className="w-6 h-6" />,
    colorClass: 'from-gray-400 to-gray-600',
    description: 'Free plan',
  },
  {
    name: 'Plus',
    monthlyFee: 3.99,
    interestRate: 1.25,
    icon: <Star className="w-6 h-6" />,
    colorClass: 'from-blue-400 to-blue-600',
    description: 'Basic premium',
  },
  {
    name: 'Premium',
    monthlyFee: 8.99,
    interestRate: 1.51,
    icon: <TrendingUp className="w-6 h-6" />,
    colorClass: 'from-purple-400 to-purple-600',
    description: 'Enhanced returns',
  },
  {
    name: 'Metal',
    monthlyFee: 15.99,
    interestRate: 2.02,
    icon: <Crown className="w-6 h-6" />,
    colorClass: 'from-yellow-400 to-orange-500',
    description: 'Premium experience',
  },
  {
    name: 'Ultra',
    monthlyFee: 45,
    interestRate: 2.27,
    icon: <Zap className="w-6 h-6" />,
    colorClass: 'from-pink-400 to-red-500',
    description: 'Ultimate rewards',
  },
];
