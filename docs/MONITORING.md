# Monitoring & Observability

Overview of production monitoring tools, configuration, and manual setup steps.

---

## Error Tracking — Sentry

**Tool:** [Sentry](https://sentry.io) — Browser SDK for React  
**Free tier:** 5,000 errors/month, 10,000 performance transactions/month. Resets monthly. No credit card required.

### How it works

The Sentry SDK is initialised in `src/lib/sentry.ts` and called at the top of `src/main.tsx`. It runs only in production (guards on `import.meta.env.DEV` and presence of `VITE_SENTRY_DSN`). Errors that reach `src/components/ErrorBoundary.tsx` are automatically reported via `captureException`.

### Local development

Sentry is **silent** in dev mode — the guard in `initSentry()` returns early when `import.meta.env.DEV` is `true`. No events are sent and no DSN is required locally.

### Environment variable

| Variable           | Where                 | Value                             |
| ------------------ | --------------------- | --------------------------------- |
| `VITE_SENTRY_DSN`  | GitHub Actions secret | DSN from Sentry project settings  |
| `VITE_APP_VERSION` | Injected by CI        | `${{ github.sha }}` (commit hash) |

`VITE_SENTRY_DSN` must be set as a GitHub Actions secret. The `deploy.yml` workflow reads it and injects it at build time. Without it, the build succeeds but Sentry is silently disabled.

### First-time setup (one-time, manual)

1. Go to [sentry.io](https://sentry.io) → sign up with GitHub
2. Create project → Platform: **React**
3. Copy the DSN (format: `https://xxx@oYYY.ingest.sentry.io/ZZZ`)
4. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `VITE_SENTRY_DSN`
   - Value: your DSN string
5. In Sentry project → **Alerts** → create alert rule: notify on first occurrence of a new issue (email notification)

### Verifying Sentry works in production

After deploying:

1. Open the live site in a browser
2. Open DevTools → Network tab
3. Filter for `ingest.sentry.io`
4. Interact with the app — you should see a session initiation request
5. To test error capture: open the browser console and run:
   ```js
   Sentry.captureException(new Error('test from console'));
   ```
   The event should appear in the Sentry dashboard within seconds.

### Content Security Policy

The CSP in `index.html` includes `connect-src 'self' https://ingest.sentry.io` to allow the SDK to send events. Without this directive, the browser blocks all Sentry requests silently (no errors, no events received).

### Configuration reference (`src/lib/sentry.ts`)

| Option             | Value                               | Reason                                         |
| ------------------ | ----------------------------------- | ---------------------------------------------- |
| `tracesSampleRate` | `0.1`                               | 10% of sessions — sufficient for a small app   |
| `allowUrls`        | `/juanjecilla\.github\.io/`         | Filters noise from forks and local testing     |
| `ignoreErrors`     | ResizeObserver, Non-Error rejection | Common browser noise with no actionable signal |
| `beforeSend`       | Strips `ip_address`, `email`        | Privacy — no PII sent                          |

---

## Code Coverage — Codecov

**Tool:** [Codecov](https://codecov.io) — coverage reporting with PR diff comments  
**Free tier:** Unlimited uploads for public repositories. No credit card required.

### How it works

The `ci.yml` workflow runs `npm run test:coverage` (Vitest with v8 provider) which outputs `coverage/lcov.info`. The `codecov/codecov-action@v4` step uploads this file to Codecov. Public repos use GitHub App authentication — no token needed.

### PR workflow

Every PR receives a Codecov comment showing:

- Per-file coverage diff (what changed in the PR)
- Overall project coverage vs base branch
- Patch coverage (coverage of lines changed in the PR)

The `patch` status check warns when new code in a PR is below 70% coverage.

### First-time setup (one-time, manual)

1. Go to [codecov.io](https://codecov.io) → **Sign in with GitHub**
2. Click **Add repository** → select `revolut-interest-calculator-bolt`
3. No token configuration needed for public repos (GitHub App handles auth)
4. Push any commit to trigger the first upload

### Configuration reference (`.codecov.yml`)

| Setting             | Value  | Reason                                 |
| ------------------- | ------ | -------------------------------------- |
| `project.target`    | `auto` | Coverage must not drop below baseline  |
| `project.threshold` | `2%`   | Allows minor variance without flagging |
| `patch.target`      | `70%`  | New code in PRs must be 70% covered    |

---

## Performance Monitoring — Lighthouse CI

**Tool:** [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) via `treosh/lighthouse-ci-action`  
**Cost:** Free. Reports stored on Google temporary public storage (7-day retention).

### How it works

On every PR, the `lighthouse.yml` workflow builds the app and runs Lighthouse 3 times against the static `dist/` folder. Results are uploaded to temporary public storage and linked in the PR checks.

### Score thresholds (`.lighthouserc.json`)

| Category                | Level                    | Threshold |
| ----------------------- | ------------------------ | --------- |
| Accessibility           | **error** (blocks merge) | ≥ 0.95    |
| Performance             | warn                     | ≥ 0.90    |
| Best Practices          | warn                     | ≥ 0.90    |
| SEO                     | warn                     | ≥ 0.90    |
| First Contentful Paint  | warn                     | ≤ 2000 ms |
| Total Blocking Time     | warn                     | ≤ 300 ms  |
| Cumulative Layout Shift | warn                     | ≤ 0.10    |

Accessibility regressions block merges because the app already scores well (semantic HTML, ARIA labels on SVG chart, `role="alert"` on ErrorBoundary).

### Running locally

```bash
npm run build
npx lhci autorun
```

### Persistent history (optional)

For permanent Lighthouse history, create a free account at [lhci.app](https://lhci.app) and configure `serverBaseUrl` in `.lighthouserc.json`.

---

## Uptime Monitoring — Freshping

**Tool:** [Freshping](https://freshping.io)  
**Free tier:** 50 monitors, 1-minute check intervals, 5 email contacts.

### How it works

Freshping sends HTTP requests to the live URL every minute and alerts via email if the site returns a non-200 status or the SSL certificate is about to expire. This is entirely external — no code changes required.

### First-time setup (one-time, manual)

1. Go to [freshping.io](https://freshping.io) → sign up with GitHub
2. Create a new check:
   - **URL:** `https://juanjecilla.github.io/revolut-interest-calculator-bolt/`
   - **Type:** HTTP(S)
   - **Interval:** 1 minute
   - **Alert conditions:** HTTP non-200, SSL cert expiry < 30 days
   - **Notification:** email to `juanje.cilla@gmail.com`
3. Optional: create a public status page at `revolut-calculator.freshstatus.io`

### What it detects

- GitHub Pages outage
- Broken deployment (accidental 404 from wrong `base:` path in `vite.config.ts`)
- SSL certificate expiry
- Unexpected HTTP errors

**Not detected:** JavaScript errors (Sentry), performance regressions (Lighthouse CI).
