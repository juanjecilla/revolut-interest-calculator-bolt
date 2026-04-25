# AI Agent Tasks

Reference file for future AI agents working on this repository.
Read [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEVELOPMENT.md](./DEVELOPMENT.md) first.

---

## Completed

- [x] Refactored `App.tsx` into module structure (`types/`, `constants/`, `utils/`, `components/`)
- [x] Added Prettier, ESLint-config-prettier, path aliases (`@/`)
- [x] Added Vitest + Testing Library (25 unit/component/integration tests)
- [x] Added Husky + lint-staged pre-commit hooks
- [x] Added GitHub Actions CI workflow (`ci.yml`) — type-check, lint, format, test, build, e2e
- [x] Added GitHub Actions deploy workflow to GitHub Pages (`deploy.yml`)
- [x] Fixed chart data memoization (`useMemo` on `maxAmount` + `chartData`)
- [x] Fixed `findBestPlan` double-calculation (was O(2n), now O(n))
- [x] Fixed input validation (raw string state, clamped number, no cursor jump)
- [x] Fixed SVG chart accessibility (`role="img"`, `aria-labelledby`, `<title>`, `strokeDasharray` patterns)
- [x] Unified currency formatting via `Intl.NumberFormat` (`formatEuro`)
- [x] Added `ErrorBoundary` wrapping root in `main.tsx`
- [x] Created full docs directory
- [x] Added Playwright e2e tests (`e2e/app.spec.ts`, 9 tests, chromium) — PR #8
- [x] URL hash state sharing (`useHashAmount` hook, `CopyLinkButton`) — PR #1 (open)
- [x] Dark mode with system preference + localStorage persistence — PR #2 (open)
- [x] Stale rates warning banner (90-day threshold) — PR #3 (open)
- [x] Interactive chart tooltips on hover/touch — PR #4 (open)
- [x] SEO meta tags, OG/Twitter tags, custom favicon SVG — PR #5 (open)
- [x] Responsive SVG chart (viewBox, HTML legend) — PR #6 (open)
- [x] Security hardening: npm audit fix, CSP meta tag, SECURITY.md — PR #7 (open)

---

## Open Tasks

### HIGH PRIORITY

- [ ] **Update browserslist database**
  - Run: `npx update-browserslist-db@latest`
  - This resolves the build warning about outdated `caniuse-lite`
  - One-liner: no code changes, just updates `package-lock.json`

### MEDIUM PRIORITY

- [ ] **Extract plan data to JSON**
  - Move `PLANS` data (without icons) to `src/data/plans.json`
  - Import JSON in `src/constants/plans.tsx` and merge with icon definitions
  - Benefit: plan data is editable without touching TSX

- [ ] **Add `og:image` to OG meta tags**
  - Current OG tags in `index.html` are missing `og:image`
  - Take a screenshot of the app, commit to `public/og-image.png`
  - Add `<meta property="og:image" content="...">` pointing to the image

### LOW PRIORITY

- [ ] **Storybook**
  - Add Storybook for `PlanCard` and `ComparisonChart`
  - Allows visual development without running the full app
  - Setup: `npx storybook@latest init`

- [ ] **Internationalisation**
  - Support EUR and GBP variants of the plans
  - Locale-aware number formatting already done via `Intl.NumberFormat`
  - Add a currency selector in the header

---

## Known Technical Debt

- `eslint-plugin-react-hooks` pinned to `5.1.0-rc.0` — upgrade once stable ships
- `lucide-react@0.344.0` is several versions old — some icon names may have changed; audit before upgrading
- `caniuse-lite` is outdated (build warning) — run `npx update-browserslist-db@latest`
- The chart legend overlaps chart lines at narrow viewport widths — no fix yet
