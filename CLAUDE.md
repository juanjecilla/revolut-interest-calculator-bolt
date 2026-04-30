# Claude Code — Project Rules

## CI checks (all must pass on every PR)

- **Type-check**: `npm run type-check` (tsc --noEmit)
- **Lint**: `npm run lint -- --max-warnings=0` (zero warnings allowed)
- **Format**: `npm run format:check` (Prettier)
- **Unit tests + coverage**: `npm run test:coverage`
- **E2E tests**: `npm run test:e2e` (Playwright, Chromium)
- **Build**: `npm run build`
- **Lighthouse CI**: performance/a11y gates on built app
- **CodeQL**: static security analysis
- **Codecov**: patch ≥70% coverage, project drop ≤2%

Run locally before pushing: `npm run type-check && npm run lint -- --max-warnings=0 && npm run format:check && npm run test:coverage`

## Codecov rules

- **Patch target**: 70% — every PR diff must have ≥70% line coverage.
- **Project threshold**: 2% — overall coverage cannot drop more than 2%.
- **Ignore list** (`.codecov.yml`): pure config/entry files and UI-only pages/components that have no testable logic. When adding a new file to ignore, it must be genuinely UI-only with no business logic.
- **New utility/logic files** (`src/utils/**`, `src/hooks/**`) **must have a corresponding `*.test.ts`** before merging. Pure functions are easy to cover 100%.
- **New UI-heavy components** (complex pages, chart wrappers) should be added to the `.codecov.yml` ignore list rather than left uncovered — add the glob to `ignore:` and commit `.codecov.yml` in the same PR.
- **Do not lower thresholds** to fix a coverage failure — add tests or add to ignore.

## E2E test locators

- Use semantic/data attributes (`data-plan`, `data-negative`, `data-testid`) for E2E selectors — not Tailwind/CSS class names.
- When CSS classes change (e.g. migrating to CSS variables), update `data-*` attributes on elements and keep E2E selectors pointing at those attributes.
- `data-negative="true"` on the net-profit span in `PlanCard` is the canonical locator for the negative-profit E2E assertion.

## Design tokens

- All colors, spacing, and shadows use CSS custom properties from `src/index.css` (`--text-1`, `--brand-ink`, `--positive`, `--negative`, etc.).
- Never add raw hex/rgb colors or Tailwind color utilities to components — use `style={{ color: 'var(--token)' }}`.
- When removing a Tailwind color class, add a `data-*` attribute if any E2E test was using that class as a locator.

## Branch / PR conventions

- PRs target `main`. Rebase (not merge) to resolve conflicts.
- If a commit in the PR is already merged to `main` (e.g. a shared foundation commit landed via another PR), use `git rebase --skip` to drop the duplicate — do not force-resolve it as a conflict.
- Keep `feat/compound-calculator` and similar feature branches rebased on `main` before requesting review.
