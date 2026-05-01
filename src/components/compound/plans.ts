import { PLANS } from '@/constants/plans';

export interface CompoundPlan {
  name: string;
  rate: number;
  fee: number;
}

export const COMPOUND_PLANS: CompoundPlan[] = PLANS.map((p) => ({
  name: p.name,
  rate: p.interestRate,
  fee: p.monthlyFee,
}));
