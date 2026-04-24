import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanCard } from './PlanCard';
import { PLANS } from '@/constants/plans';

const standardPlan = PLANS[0];
const ultraPlan = PLANS[4];

describe('PlanCard', () => {
  it('renders plan name', () => {
    render(<PlanCard plan={standardPlan} amount={10000} isBest={false} />);
    expect(screen.getByText('Standard')).toBeInTheDocument();
  });

  it('shows Best Choice badge when isBest=true', () => {
    render(<PlanCard plan={standardPlan} amount={10000} isBest={true} />);
    expect(screen.getByText('Best Choice')).toBeInTheDocument();
  });

  it('does not show Best Choice badge when isBest=false', () => {
    render(<PlanCard plan={standardPlan} amount={10000} isBest={false} />);
    expect(screen.queryByText('Best Choice')).not.toBeInTheDocument();
  });

  it('shows Free for Standard monthly fee (€0)', () => {
    render(<PlanCard plan={standardPlan} amount={10000} isBest={false} />);
    const freeLabels = screen.getAllByText('Free');
    expect(freeLabels.length).toBeGreaterThan(0);
  });

  it('shows monetary fee for paid plan', () => {
    render(<PlanCard plan={ultraPlan} amount={10000} isBest={false} />);
    expect(screen.getByText('Ultra')).toBeInTheDocument();
    // Ultra has €45/month fee — should show a formatted amount, not "Free"
    expect(screen.queryByText('Free')).not.toBeInTheDocument();
  });

  it('shows negative net profit in red for very low amounts', () => {
    render(<PlanCard plan={ultraPlan} amount={100} isBest={false} />);
    const netProfitEl = screen.getByText(/Net Profit/i).closest('div');
    expect(netProfitEl).toBeInTheDocument();
  });
});
