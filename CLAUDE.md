# Fanvia Frontend Test

## Project Overview

Take-home frontend coding test for Fanvia. Single-page React + TypeScript app with a **Peer Comparison Table** (TanStack Table) and **Peer Performance Chart** (Lightweight Charts).

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 6** — build tool + dev server
- **TanStack Table v8** — headless table with row selection
- **Lightweight Charts v5** — TradingView financial charting
- **Tailwind CSS v4** — utility-first styling
- **Biome** — linting + formatting (replaces ESLint/Prettier)
- **pnpm** — package manager

## Commands

```bash
pnpm dev          # Start dev server (localhost:5173)
pnpm build        # Type-check + production build
pnpm preview      # Preview production build
pnpm check        # Run Biome lint + format check
pnpm check:fix    # Auto-fix Biome issues
```

## Architecture

- State lives in `App` — `rowSelection` (TanStack Table state) and `timeseries` (fetched chart data)
- No state management library — `useState` only (intentional for this scope)
- `useLightweightChart` hook manages chart lifecycle via refs (create/update/destroy)
- Stable color assignment via `useRef<Map>` — prevents color shifting on deselection
- Mock API has 3s latency — fetch cancellation via boolean flag in `useEffect` cleanup

## Key Files

- `src/app.tsx` — Main page, state owner, data flow orchestrator
- `src/components/peer-table/` — Table with TanStack Table
- `src/components/peer-chart/` — Chart with Lightweight Charts
- `src/hooks/use-lightweight-chart.ts` — Chart lifecycle hook
- `src/api/mock-api.ts` — Provided mock API (do not modify)
- `src/data/companies.json` — Provided company data

## Conventions

- Biome formatter: tabs, double quotes
- File naming: kebab-case
- Component exports: named exports (no default)
- Lightweight Charts v5 API: `chart.addSeries(LineSeries, opts)` not `addLineSeries()`

## Deployment

Deploy to Vercel. No special config needed — Vite auto-detected.
