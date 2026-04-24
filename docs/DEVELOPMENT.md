# Development Guide

## Prerequisites

- Node.js 22+ — use `nvm use` if you have [nvm](https://github.com/nvm-sh/nvm)
- npm 10+

## Setup

```bash
nvm use          # switches to Node 22 per .nvmrc
npm install      # installs deps + sets up husky git hooks via `prepare`
npm run dev      # starts dev server at http://localhost:5173
```

## Available Scripts

| Script                  | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Dev server at `localhost:5173` (HMR enabled) |
| `npm run build`         | Production build → `dist/`                   |
| `npm run preview`       | Serve `dist/` locally to verify build        |
| `npm run type-check`    | TypeScript type check (no emit)              |
| `npm run lint`          | ESLint on all `.ts/.tsx` files               |
| `npm run format`        | Prettier — write all source files            |
| `npm run format:check`  | Prettier — check only (used in CI)           |
| `npm test`              | Vitest — run all tests once                  |
| `npm run test:watch`    | Vitest — watch mode                          |
| `npm run test:coverage` | Vitest — coverage report in `coverage/`      |

## Path Aliases

`@/` maps to `src/`. Use it for all non-relative imports:

```ts
import { PLANS } from '@/constants/plans';
import { calculateNetProfit } from '@/utils/calculator';
```

## Updating Plan Data

Plan rates and fees live in `src/constants/plans.tsx`. Edit the `PLANS` array:

```ts
// src/constants/plans.tsx
export const PLANS: Plan[] = [
  {
    name: 'Standard',
    monthlyFee: 0,       // ← euros per month
    interestRate: 1.25,  // ← annual percentage
    ...
  },
  ...
];
```

Always verify current rates at [revolut.com/legal/fees](https://www.revolut.com/legal/fees) before updating.

## Updating the Ko-fi URL

Change `KOFI_URL` in `src/constants/plans.tsx`:

```ts
export const KOFI_URL = 'https://ko-fi.com/your-handle';
```

## Pre-commit Hooks

Husky runs `lint-staged` before each commit:

- Prettier formats staged `.ts/.tsx` files
- ESLint checks staged `.ts/.tsx` files (zero warnings allowed)
- Prettier formats staged `.js/.json/.md` files

If the hook fails, fix the reported issues and re-stage.
