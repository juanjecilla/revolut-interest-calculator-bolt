# Manual Setup Steps

These are one-time actions that must be performed by a human in the GitHub UI. They cannot be automated by code or GitHub Actions.

---

## 1. Enable GitHub Pages

GitHub Pages must be enabled before the deploy workflow can run.

1. Go to the repository on GitHub
2. Click **Settings** (top tab)
3. In the left sidebar, click **Pages**
4. Under **Build and deployment** → **Source**, select **GitHub Actions**
5. Click **Save**

The first deployment will trigger automatically on the next push to `main`.

---

## 2. Set Branch Protection Rules on `main`

Prevents broken code from being merged or deployed.

1. Go to **Settings** → **Branches**
2. Click **Add branch ruleset** (or **Add classic branch protection rule**)
3. Set **Branch name pattern** to `main`
4. Enable:
   - **Require a pull request before merging**
   - **Require status checks to pass before merging**
     - Add required check: `Type-check / Lint / Format / Test / Build` (this is the job name from `ci.yml`)
   - **Require branches to be up to date before merging**
   - **Do not allow bypassing the above settings** (recommended)
5. Click **Save changes**

> Note: The exact job name to add as a required check is `Type-check / Lint / Format / Test / Build` (matches the `jobs.ci.name` field in `.github/workflows/ci.yml`).

---

## 3. Verify the Live URL

After the first push to `main` with Pages enabled:

1. Go to **Actions** tab → **Deploy to GitHub Pages**
2. Wait for the workflow to complete (usually < 2 minutes)
3. Click the **deploy** job → expand the **Deploy to GitHub Pages** step
4. The live URL is shown in the step output

The URL format is: `https://<your-github-username>.github.io/revolut-interest-calculator-bolt/`

---

## 4. Update `README.md` Live URL

Once the live URL is confirmed:

1. Open `README.md`
2. Replace the placeholder `https://<your-github-username>.github.io/revolut-interest-calculator-bolt/` with the actual URL
3. Commit and push

---

## 5. If the Repository Is Renamed

GitHub Pages URLs and Vite's base URL are tied to the repository name.

If the repository is renamed:

1. Update `base` in `vite.config.ts`:
   ```ts
   base: '/<new-repo-name>/',
   ```
2. Commit and push — the deploy workflow will rebuild with the correct base path
3. Update any links in `README.md` and `docs/DEPLOYMENT.md`

---

## 7. Set Up Sentry Error Tracking

Required for error monitoring in production. The build succeeds without this secret, but Sentry will be silently disabled.

1. Go to [sentry.io](https://sentry.io) → sign up with GitHub
2. Create a new project → select **React** platform
3. Copy the **DSN** from the project settings (format: `https://xxx@oYYY.ingest.sentry.io/ZZZ`)
4. In the GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `VITE_SENTRY_DSN`
   - Value: your DSN string
5. In Sentry → **Alerts** → create an alert rule:
   - Condition: first occurrence of a new issue
   - Action: send email notification
6. Trigger a test deploy and verify: open DevTools → Network → filter `ingest.sentry.io`

> See `docs/MONITORING.md` for full Sentry configuration details and verification steps.

---

## 8. Set Up Codecov Coverage Reporting

Required for PR coverage diff comments. CI uploads coverage but comments only appear after Codecov is connected.

1. Go to [codecov.io](https://codecov.io) → **Sign in with GitHub**
2. Click **Add repository** → select `revolut-interest-calculator-bolt`
3. No token is needed for public repos — the GitHub App handles authentication
4. Push any commit to trigger the first coverage upload
5. Add the coverage badge to `README.md`:

```markdown
[![codecov](https://codecov.io/gh/juanjecilla/revolut-interest-calculator-bolt/graph/badge.svg)](https://codecov.io/gh/juanjecilla/revolut-interest-calculator-bolt)
```

---

## 9. Set Up Freshping Uptime Monitoring

External uptime monitoring. No code changes required.

1. Go to [freshping.io](https://freshping.io) → sign up (GitHub or email)
2. Create a new check:
   - **URL:** `https://juanjecilla.github.io/revolut-interest-calculator-bolt/`
   - **Type:** HTTP(S)
   - **Interval:** 1 minute
   - **Alert conditions:** non-200 status, SSL certificate expiry < 30 days
   - **Notification:** email to your address
3. Verify the monitor shows green in the Freshping dashboard
4. Optional: create a public status page

---

## 10. Update Branch Protection Rules (post-integrations)

After adding CodeQL and Lighthouse CI, add their checks to branch protection:

1. Go to **Settings → Branches** → edit the rule for `main`
2. Under **Require status checks to pass**, add:
   - `Type-check / Lint / Format / Test / Build`
   - `CodeQL / Analyze (javascript-typescript)`
   - `Lighthouse / Lighthouse`
3. Save changes

---

## 6. (Optional) Configure GitHub Environment Protection

To add manual approval before production deployments:

1. Go to **Settings** → **Environments**
2. Click **github-pages** (created automatically when Pages is enabled)
3. Under **Deployment protection rules**, add **Required reviewers**
4. Add yourself or a team as required reviewer

With this enabled, the deploy job will pause and wait for approval before going live.
