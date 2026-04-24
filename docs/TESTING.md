# Testing

## Test Runner

[Vitest](https://vitest.dev/) — native Vite integration, no separate config file needed.

## Commands

```bash
npm test                  # run all tests once (used in CI)
npm run test:watch        # watch mode — reruns on file change
npm run test:coverage     # coverage report in coverage/lcov.info + terminal summary
```

## Test File Conventions

- Unit tests: `src/utils/calculator.test.ts`
- Component tests: `src/components/PlanCard.test.tsx`
- Integration tests: `src/App.test.tsx`
- Test setup: `src/test/setup.ts` (loaded via `vitest.setupFiles`)

## Writing a Unit Test

```ts
import { describe, it, expect } from 'vitest';
import { calculateNetProfit } from '@/utils/calculator';
import type { PlanData } from '@/types';

const plan: PlanData = {
  name: 'Test',
  monthlyFee: 5,
  interestRate: 2,
  colorClass: '',
  description: '',
};

describe('calculateNetProfit', () => {
  it('subtracts annual fee from gross earnings', () => {
    // 10000 * 2% = 200, annual fee = 5*12 = 60, net = 140
    expect(calculateNetProfit(10000, plan)).toBeCloseTo(140);
  });
});
```

## Writing a Component Test

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanCard } from '@/components/PlanCard';
import { PLANS } from '@/constants/plans';

describe('PlanCard', () => {
  it('renders plan name', () => {
    render(<PlanCard plan={PLANS[0]} amount={10000} isBest={false} />);
    expect(screen.getByText('Standard')).toBeInTheDocument();
  });
});
```

Use `screen.getByRole` over `getByText` when an element has semantic meaning — it tests what users actually experience.

## What NOT to Test

- Tailwind class names (implementation detail, not behavior)
- Exact pixel positions or SVG coordinates
- That a specific icon renders (tests library internals, not your code)
- Internal state values directly — test observable output instead
