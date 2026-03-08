# Fanvia Frontend Test — Peer Comparison

A React + TypeScript page with a **Peer Comparison Table** (TanStack Table) and **Peer Performance Chart** (Lightweight Charts) that updates based on row selection (max 4).

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 6** — build tool
- **TanStack Table v8** — headless table with row selection
- **Lightweight Charts v5** — financial charting (TradingView)
- **Tailwind CSS v4** — styling
- **Biome** — linting and formatting

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production Build

```bash
pnpm build
pnpm preview
```

## Features

- **Peer Comparison Table**: 10 semiconductor companies with Market Cap, PE TTM, Revenue Growth, and Dividend Yield
- **Row Selection**: Click circular checkboxes to select up to 4 companies
- **Dynamic Chart**: Selected companies' normalized performance (% change from start) rendered as line series
- **Loading State**: 3-second mock API latency with loading spinner overlay
- **Stable Colors**: Color assignments persist when toggling selections (no color shifting)
- **Responsive**: Chart resizes with window, table scrolls horizontally on small screens
- **Missing Data**: Gracefully shows em dash (—) for undefined fields

## Project Structure

```
src/
├── api/mock-api.ts                # Provided mock API (3s latency, random walk timeseries)
├── main.tsx                       # Entry point, ErrorBoundary wrapper
├── app.tsx                        # Root layout shell
├── pages/
│   └── peer-comparison.tsx        # Page orchestrator — imports hooks, passes props down
├── components/
│   ├── peer-table/
│   │   ├── peer-table.tsx         # TanStack Table with row selection + max enforcement
│   │   └── columns.tsx            # Column definitions, image fallback, formatting
│   ├── peer-chart/
│   │   ├── peer-chart.tsx         # Chart container with loading/error/empty states
│   │   └── chart-legend.tsx       # Color-coded legend synced with selection
│   └── ui/
│       ├── card.tsx               # Shared card wrapper
│       ├── spinner.tsx            # Loading spinner
│       └── error-boundary.tsx     # React error boundary
├── hooks/
│   ├── use-lightweight-chart.ts   # Chart lifecycle (create/resize/destroy + series updates)
│   ├── use-peer-selection.ts      # Row selection state + color synchronization
│   ├── use-peer-timeseries.ts     # Data fetching with caching and in-flight dedup
│   └── use-color-map.ts           # Stable color assignment (ref+state pattern)
├── lib/
│   ├── colors.ts                  # Pure function: updateColorMap()
│   └── format.ts                  # Number formatting (market cap, percentages)
├── config/constants.ts            # MAX_PEER_SELECTION, DEFAULT_SERIES_COLOR
├── types/company.ts               # Company interface
└── data/companies.json            # 10 semiconductor companies
```

## Design Decisions

- **No state management library**: Only `useState` needed — two pieces of shared state (selection + timeseries) don't warrant Zustand/Redux
- **Custom chart hook**: No official React wrapper for Lightweight Charts — a ref-based hook is the cleanest integration
- **Stable color map via `useRef`**: Prevents color shifting when middle rows are deselected
- **Fetch cancellation**: Boolean flag in `useEffect` cleanup prevents stale data from overwriting newer selections
- **`enableRowSelection` callback**: Disables checkboxes at the source rather than just rejecting state changes

## AI Usage

See [AI_USAGE.md](./AI_USAGE.md) for a detailed development journal covering tools used, architectural decisions, and implementation approach.
