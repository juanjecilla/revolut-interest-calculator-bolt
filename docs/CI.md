# CI / CD Workflows

All automation runs via GitHub Actions. Workflows are in `.github/workflows/`.

---

## Workflow Overview

| File             | Trigger                              | Purpose                  |
| ---------------- | ------------------------------------ | ------------------------ |
| `ci.yml`         | push to `main`, pull_request         | Full quality gate        |
| `deploy.yml`     | push to `main`                       | Deploy to GitHub Pages   |
| `codeql.yml`     | push to `main`, pull_request, weekly | Static security analysis |
| `lighthouse.yml` | pull_request                         | Performance budgets      |

---

## `ci.yml` — Quality Gate

Runs on every push to `main` and every pull request. All steps must pass before merge.

| Step               | Command                            | What it checks                            |
| ------------------ | ---------------------------------- | ----------------------------------------- |
| Audit dependencies | `npm audit --audit-level=high`     | High/critical vulnerabilities in dep tree |
| Type check         | `npm run type-check`               | TypeScript strict mode                    |
| Lint               | `npm run lint -- --max-warnings=0` | ESLint zero-warning tolerance             |
| Format check       | `npm run format:check`             | Prettier consistency                      |
| Test with coverage | `npm run test:coverage`            | Unit tests + lcov output                  |
| Upload coverage    | `codecov/codecov-action@v4`        | Coverage report to Codecov                |
| Build              | `npm run build`                    | Vite production build                     |
| E2E tests          | `npm run test:e2e`                 | Playwright Chromium tests                 |

**npm audit level:** `--audit-level=high` skips the two known dev-only moderate vulnerabilities (Vite/esbuild, eslint ReDoS) documented in `docs/SECURITY.md`. Only high or critical severities fail CI.

**Coverage upload:** `fail_ci_if_error: false` — Codecov service outages do not break CI. The test run itself (and its exit code) is the gate; Codecov is informational.

---

## `deploy.yml` — GitHub Pages Deployment

Runs only on push to `main`. Requires CI to pass first (via branch protection).

**Build-time environment variables injected:**

| Variable           | Source                | Purpose                            |
| ------------------ | --------------------- | ---------------------------------- |
| `VITE_SENTRY_DSN`  | GitHub Actions secret | Enables Sentry in production build |
| `VITE_APP_VERSION` | `${{ github.sha }}`   | Release tracking in Sentry         |

If `VITE_SENTRY_DSN` secret is not set, the build succeeds and Sentry is silently disabled. See `docs/MONITORING.md` for setup instructions.

---

## `codeql.yml` — Static Security Analysis

Runs on push to `main`, all pull requests, and weekly (Sunday 02:00 UTC).

Uses the `security-extended` query suite — security-focused rules only, no style warnings. Results appear in the Security tab → Code scanning alerts. New issues introduced by a PR are annotated inline.

**Weekly cron:** CodeQL's vulnerability rule database updates independently of the codebase. Weekly rescans catch new rules against unchanged code.

**First-time:** The initial scan establishes a baseline. Existing code findings appear in the Security tab but do not retroactively fail past CI runs. Only net-new findings in future PRs trigger check failures.

---

## `lighthouse.yml` — Performance Budgets

Runs on every pull request only (not on push to `main` — builds are already tested by CI).

Builds the app, runs Lighthouse 3 times against `dist/`, and uploads the report to Google temporary public storage (7-day retention, no account needed).

**Accessibility failures block merge** (score < 0.95). Performance, SEO, and best-practices warnings are informational.

See `.lighthouserc.json` for full threshold configuration and `docs/MONITORING.md` for score details.

---

## Branch Protection (recommended settings)

Navigate to: Settings → Branches → Add branch protection rule for `main`

Recommended:

- Require status checks to pass before merging:
  - `CI / Type-check / Lint / Format / Test / Build`
  - `CodeQL / Analyze (javascript-typescript)`
  - `Lighthouse / Lighthouse`
- Require branches to be up to date before merging
- Require pull request reviews before merging (1 reviewer)

---

## Dependabot

Configured in `.github/dependabot.yml`. Opens weekly PRs on Monday at 09:00 Europe/Madrid:

- **npm:** minor/patch dev dependencies grouped into one PR; production deps (react, react-dom, lucide-react) opened individually
- **github-actions:** major action version bumps (e.g., `actions/checkout@v4 → v5`)

Security alerts are enabled automatically for public repos. Verify: Settings → Security → Dependabot alerts.

The `eslint-plugin-react-hooks` major version is ignored by Dependabot (see `AGENTS.md` — requires manual evaluation when it reaches stable).
