# AI Agent Tasks

Reference file for future AI agents working on this repository.
Read [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEVELOPMENT.md](./DEVELOPMENT.md) first.

---

## Completed

- [x] Refactored `App.tsx` into module structure (`types/`, `constants/`, `utils/`, `components/`)
- [x] Added Prettier, ESLint-config-prettier, path aliases (`@/`)
- [x] Added Vitest + Testing Library (25 tests, 3 test files)
- [x] Added Husky + lint-staged pre-commit hooks
- [x] Added GitHub Actions CI workflow (`ci.yml`)
- [x] Added GitHub Actions deploy workflow to GitHub Pages (`deploy.yml`)
- [x] Fixed chart data memoization (`useMemo` on `maxAmount` + `chartData`)
- [x] Fixed `findBestPlan` double-calculation (was O(2n), now O(n))
- [x] Fixed input validation (raw string state, clamped number, no cursor jump)
- [x] Fixed SVG chart accessibility (`role="img"`, `aria-labelledby`, `<title>`, `strokeDasharray` patterns)
- [x] Unified currency formatting via `Intl.NumberFormat` (`formatEuro`)
- [x] Added `ErrorBoundary` wrapping root in `main.tsx`
- [x] Created full docs directory

---

## Open Tasks

### HIGH PRIORITY

- [ ] **Add Playwright e2e tests**
  - Verify SVG chart renders `<path>` elements for all 5 plans
  - Verify "Best Choice" badge moves between plan cards when amount changes
  - Verify negative net profit displays in red
  - Setup: `npm install --save-dev @playwright/test && npx playwright install`
  - Config file: `playwright.config.ts` at repo root
  - Test files: `e2e/` directory

- [ ] **Add rate-freshness warning**
  - Store a `RATES_LAST_UPDATED` date constant in `src/constants/plans.tsx`
  - If today's date minus `RATES_LAST_UPDATED` > 90 days, show a dismissible warning banner
  - Warn text: "Interest rates shown may be outdated. Verify at revolut.com."

- [ ] **Update browserslist database**
  - Run: `npx update-browserslist-db@latest`
  - This resolves the build warning about outdated `caniuse-lite`

### MEDIUM PRIORITY

- [ ] **Extract plan data to JSON**
  - Move `PLANS` data (without icons) to `src/data/plans.json`
  - Import JSON in `src/constants/plans.tsx` and merge with icon definitions
  - Benefit: plan data is editable without touching TSX

- [ ] **URL hash state sharing**
  - Encode current amount in URL hash: `#amount=10000`
  - On load, read hash and initialize `rawAmount` state from it
  - Add a "Copy link" button that copies the current URL
  - No router needed — use `window.location.hash` directly

- [ ] **Add OG meta tags to `index.html`**
  - `<meta property="og:title">`, `og:description`, `og:url`
  - Use a static image for `og:image` (screenshot of the app)

- [ ] **Dark mode**
  - Add `prefers-color-scheme` media query support via Tailwind `dark:` classes
  - Toggle button in the header (persisted to `localStorage`)

- [ ] **Interactive chart tooltips**
  - On SVG `mousemove` / `touchmove`, show a tooltip with exact profit for each plan at that investment level
  - Display tooltip as an absolutely-positioned `<div>` over the SVG container

- [ ] **Responsive chart**
  - The SVG uses a fixed `viewBox` of `800×300` but the container is `overflow-x-auto`
  - On mobile (<640px), this causes horizontal scroll
  - Fix: reduce `SVG_WIDTH` or use a responsive approach with `viewBox` + `preserveAspectRatio`

### LOW PRIORITY

- [ ] **Storybook**
  - Add Storybook for `PlanCard` and `ComparisonChart`
  - Allows visual development without running the full app
  - Setup: `npx storybook@latest init`

- [ ] **Internationalisation**
  - Support EUR and GBP variants of the plans
  - Locale-aware number formatting already done via `Intl.NumberFormat`
  - Add a currency selector in the header

- [ ] **Custom favicon**
  - Replace default Vite SVG favicon with a calculator or Revolut-themed icon
  - Add `<link rel="icon">` to `index.html`

- [ ] **SEO meta tags**
  - Update `<title>` in `index.html` to something descriptive
  - Add `<meta name="description">` with the app's purpose

---

## Known Technical Debt

- `eslint-plugin-react-hooks` pinned to `5.1.0-rc.0` — upgrade once stable ships
- `lucide-react@0.344.0` is several versions old — some icon names may have changed; audit before upgrading
- `caniuse-lite` is outdated (build warning) — run `npx update-browserslist-db@latest`
- The chart legend overlaps chart lines at narrow viewport widths — no fix yet
