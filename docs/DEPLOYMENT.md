# Deployment

## Platform: GitHub Pages

The app deploys automatically to GitHub Pages on every push to `main`.

**Live URL:** `https://<your-github-username>.github.io/revolut-interest-calculator-bolt/`

## How It Works

1. Push commits to `main`
2. `.github/workflows/deploy.yml` triggers automatically
3. GitHub Actions runs `npm ci && npm run build`
4. `dist/` is uploaded as a Pages artifact
5. Pages deploys the artifact to the live URL

The `ci.yml` workflow (type-check, lint, format, test, build) also runs on push to `main`. Both workflows are independent — use branch protection rules to require CI to pass before merging PRs (see [MANUAL_SETUP.md](./MANUAL_SETUP.md)).

## Base URL Requirement

Vite is configured with `base: '/revolut-interest-calculator-bolt/'` in `vite.config.ts`. This is required because GitHub Pages serves project repos at `/<repo-name>/` — without it, assets 404.

If the repository is **renamed**, update `base` in `vite.config.ts` to match the new repo name.

## Rollback

1. Go to the repository on GitHub
2. Click **Actions** → **Deploy to GitHub Pages**
3. Find a previous successful run
4. Click **Re-run jobs** — this re-deploys that exact build artifact

Alternatively, use the GitHub Pages dashboard (Settings → Pages) to see deployment history.

## Manual Deployment

To deploy manually without GitHub Actions:

```bash
npm run build
# Upload the dist/ directory to any static host
```

Or use the GitHub CLI:

```bash
npm run build
gh pages deploy dist --branch gh-pages
```
