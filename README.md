# Revolut Interest Calculator

Find the optimal Revolut subscription plan based on your savings balance.

**Live:** https://juanjecilla.github.io/revolut-interest-calculator-bolt/

## Features

- Compare all 5 Revolut plans: Standard, Plus, Premium, Metal, Ultra
- Real-time net profit calculation after subscription fees
- Visual comparison chart across investment levels
- Highlights the best plan for your current balance

## Getting Started

### Prerequisites

- Node.js 22+ (use `nvm use` if you have nvm installed)
- npm 10+

### Install and run

```bash
nvm use
npm install
npm run dev
```

## Scripts

| Script                  | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Dev server at `localhost:5173`     |
| `npm run build`         | Production build → `dist/`         |
| `npm run preview`       | Serve `dist/` locally              |
| `npm run type-check`    | TypeScript type check              |
| `npm run lint`          | ESLint                             |
| `npm run format`        | Prettier — format all files        |
| `npm run format:check`  | Prettier — check only (used in CI) |
| `npm test`              | Run unit tests                     |
| `npm run test:watch`    | Tests in watch mode                |
| `npm run test:coverage` | Tests with coverage report         |

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — structure, data flow, key decisions
- [Development Guide](docs/DEVELOPMENT.md) — setup, scripts, how to update data
- [Deployment](docs/DEPLOYMENT.md) — GitHub Pages, how auto-deploy works
- [Manual Setup Steps](docs/MANUAL_SETUP.md) — one-time GitHub UI actions required
- [Testing](docs/TESTING.md) — how to run and write tests
- [AI Agent Tasks](docs/AGENTS.md) — open tasks for future agents
- [Architecture Decisions](docs/DECISIONS.md) — ADR table

## Disclaimer

Interest rates and fees shown are based on publicly available data and may be outdated.
Always verify current rates at [revolut.com](https://www.revolut.com) before making financial decisions.
