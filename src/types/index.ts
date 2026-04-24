import type { ReactNode } from 'react';

export interface PlanData {
  name: string;
  monthlyFee: number;
  interestRate: number;
  colorClass: string;
  description: string;
}

export interface Plan extends PlanData {
  icon: ReactNode;
}
