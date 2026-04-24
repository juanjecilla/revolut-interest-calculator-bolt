# Architecture Decisions

Lightweight ADR (Architecture Decision Records) table. Each row captures a choice, the alternative considered, and the rationale.

| Decision             | Choice                               | Alternative                      | Rationale                                                                              |
| -------------------- | ------------------------------------ | -------------------------------- | -------------------------------------------------------------------------------------- |
| Test framework       | Vitest                               | Jest                             | Native Vite integration — no Babel transform config needed; `globals: true` just works |
| Deployment           | GitHub Pages                         | Vercel, Netlify                  | Free, no external account needed, fully controlled via GitHub Actions                  |
| Formatter            | Prettier                             | Biome, dprint                    | Widest editor support; `eslint-config-prettier` disables conflicts cleanly             |
| Chart library        | None (raw SVG)                       | Recharts, Chart.js               | 5 static lines don't justify 50+ kB; SVG is readable and fully controlled              |
| Error boundary       | Class component                      | Hook-based wrapper lib           | React only supports class components for render-error boundaries                       |
| Calculator functions | Pure fns in `utils/`                 | Methods on Plan class            | Pure functions are trivially testable with no React dependency                         |
| `PlanData` vs `Plan` | Separate interfaces                  | Single `Plan` with optional icon | Calculator tests use `PlanData` — no React import needed in test file                  |
| Currency format      | `Intl.NumberFormat`                  | `toFixed(2)` strings             | Locale-aware, standard API — replaces inconsistent `toFixed`/`toLocaleString` mix      |
| Input state          | Raw string `rawAmount`               | Numeric state                    | Preserves cursor position during typing; avoids NaN flicker on partial input           |
| Chart memoization    | `useMemo` on `chartData`             | Compute on every render          | 500 float calculations (100 points × 5 plans) per keystroke is wasteful                |
| Pre-commit hooks     | Husky + lint-staged                  | Lefthook, simple-git-hooks       | Husky is most widely adopted; lint-staged limits scope to staged files                 |
| Path aliases         | `@/` → `src/`                        | Relative imports                 | Eliminates `../../` chains; consistent across all files                                |
| Base URL             | `/revolut-interest-calculator-bolt/` | `/`                              | GitHub Pages project repos are served at `/<repo-name>/` — base must match             |
