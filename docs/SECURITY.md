# Security

## Threat Model

This is a client-side static SPA with no backend, no auth, no user accounts, and no external API calls. All data is hardcoded. Risk surface is narrow.

## Application Security

### What is protected

| Risk                              | Status            | Notes                                                                              |
| --------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| XSS via `dangerouslySetInnerHTML` | ✅ Not present    | No usage in codebase                                                               |
| XSS via `eval()` / `Function()`   | ✅ Not present    | No dynamic code execution                                                          |
| Hash injection                    | ✅ Mitigated      | `useHashAmount` validates with regex — only accepts `[0-9.]+`, numeric values only |
| URL injection / open redirect     | ✅ Not applicable | No user-controlled redirects                                                       |
| External link safety              | ✅ Done           | All `target="_blank"` links use `rel="noopener noreferrer"`                        |
| Secrets in source code            | ✅ None           | Only public constants (Ko-fi URL, plan rates)                                      |
| Content Security Policy           | ✅ Added          | `meta http-equiv` in `index.html` (see limitations below)                          |
| `base-uri: 'self'`                | ✅ Set            | Prevents `<base>` tag injection                                                    |
| `object-src: 'none'`              | ✅ Set            | No Flash/plugins                                                                   |
| `form-action: 'none'`             | ✅ Set            | No form submissions                                                                |
| `connect-src: 'none'`             | ✅ Set            | No XHR/fetch/WebSocket to external origins                                         |

### CSP Limitations on GitHub Pages

GitHub Pages does not support custom HTTP response headers. Therefore:

- `Content-Security-Policy` is delivered via `<meta http-equiv>` — this is partial protection only
- **`frame-ancestors`** is NOT enforced via meta tag (clickjacking protection requires the HTTP header)
- `X-Frame-Options` cannot be set on GitHub Pages either

**Clickjacking risk**: Low — this app displays no sensitive personal data and takes no destructive actions. A framed version would show the same public calculator. Still, if migrated to a platform that supports custom headers (Vercel, Cloudflare Pages), add:

```
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
```

### Dependency Vulnerabilities

Run `npm audit` to check current status.

After `npm audit fix`, remaining issues are all **development-only** (never shipped to production):

| Package              | Severity | Context         | Risk                                                                                      |
| -------------------- | -------- | --------------- | ----------------------------------------------------------------------------------------- |
| `@eslint/plugin-kit` | Moderate | ESLint dev tool | ReDoS in lint config parsing — dev machine only                                           |
| `esbuild` (via Vite) | Moderate | Dev server only | Any page can read dev server responses — dev machine only; production serves static files |

The esbuild vulnerability (GHSA-67mh-4wv8-2f99) requires upgrading to Vite 8 (`npm audit fix --force`). This is a breaking change — evaluate before upgrading.

**Production bundle contains no vulnerable packages.**

### GitHub Actions Supply Chain

Actions are pinned to major version tags (`@v4`, `@v3`) rather than commit SHAs. This is standard for official `actions/` org actions. For higher security, pin to SHA:

```yaml
# Current (major version tag — trusted for official actions):
uses: actions/checkout@v4

# Higher security (SHA pinning):
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
```

All workflows run on `ubuntu-latest` with `npm ci` (exact lockfile install). No secrets are used in CI beyond the standard `GITHUB_TOKEN` for Pages deployment.

## Reporting a Vulnerability

Open a [GitHub issue](https://github.com/juanjecilla/revolut-interest-calculator-bolt/issues) with the label `security`. For sensitive reports, email directly (see GitHub profile).
