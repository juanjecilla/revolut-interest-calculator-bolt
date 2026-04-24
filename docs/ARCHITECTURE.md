# Architecture

## Purpose

Single-page static React app that compares 5 Revolut subscription plans and calculates the optimal plan for a given savings balance. No backend, no auth, no routing.

## File Structure

```
src/
  App.tsx                    # Root component — state + orchestration only
  main.tsx                   # React root mount + ErrorBoundary wrapper
  index.css                  # Tailwind directives
  vite-env.d.ts              # Vite type shims

  types/
    index.ts                 # PlanData (pure data) + Plan (data + icon)

  constants/
    plans.tsx                # PLANS array, KOFI_URL, CHART_COLORS, CHART_DASH_PATTERNS

  utils/
    calculator.ts            # Pure functions: calculateNetProfit, findBestPlan, formatEuro, generateChartData
    calculator.test.ts       # Unit tests for calculator utils

  components/
    ErrorBoundary.tsx        # Class component — catches render errors, shows fallback UI
    PlanCard.tsx             # Single plan display card
    PlanCard.test.tsx        # Component tests
    ComparisonChart.tsx      # SVG chart comparing all plans across investment levels
    BestPlanBanner.tsx       # Highlighted best-plan summary banner

  test/
    setup.ts                 # Vitest + jest-dom setup

App.test.tsx                 # Integration tests for App
```

## Data Flow

```
User types amount
  → rawAmount (string state in App)
  → amount (number, memoized — clamped 0..999_999_999)
    → findBestPlan(amount, PLANS) → bestPlan
    → BestPlanBanner(amount, bestPlan)
    → PlanCard × 5 (amount, isBest)
    → ComparisonChart(amount)
        → maxAmount (memoized)
        → generateChartData(maxAmount, 100, PLANS) (memoized)
        → SVG render
```

## Key Design Decisions

See [DECISIONS.md](./DECISIONS.md) for the full ADR table.

- **`PlanData` vs `Plan` split** — calculator utils only need `PlanData` (no JSX), enabling tests with zero React dependency.
- **Pure functions in `utils/calculator.ts`** — fully testable without rendering.
- **`ErrorBoundary` as class component** — React hooks cannot catch render errors; class is the required pattern.
- **SVG chart (no library)** — app is simple enough; avoids a 50+ kB bundle dependency.
- **`useMemo` for chart data** — 500 float calculations deferred until `amount` changes.
