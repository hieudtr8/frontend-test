# AI Usage — Development Journal

## Tool

**Claude Code** (CLI) with **Claude Opus** model — Anthropic's agentic coding tool.

Used for: scaffolding, API documentation lookup (Context7 MCP), implementation, code review, browser testing (Playwright MCP).

Not used for: architectural decisions, design choices, UX tradeoffs. Every structural decision below was mine — the AI accelerated execution, it didn't drive direction.

---

## Phase 1: Analysis & Architecture

Before writing any code, I read through `design.png`, `companies.json`, and `mock-api.ts` to identify the three core problems:

1. **Table with constrained selection state** — select up to 4 rows, enforce the limit, sync visual feedback
2. **Chart lifecycle management** — Lightweight Charts is imperative (no React wrapper), so I need a clean bridge between imperative chart APIs and React's declarative model
3. **Data synchronization** — selection changes trigger fetches with 3s latency; the UI needs to stay consistent during async gaps

**Key decision: no state management library.** The entire app has two pieces of shared state: `rowSelection` (which rows are checked) and `timeseries` (fetched chart data). Adding Zustand or Redux would be over-engineering — `useState` lifted to the page component is the right tool for this scope.

**Key decision: ref-based chart hook.** Lightweight Charts v5 has no official React binding. A custom hook using `useRef` for the chart instance plus `ResizeObserver` for responsive sizing is the cleanest imperative-to-declarative bridge. I used Context7 MCP to verify the v5 API — there are breaking changes from v4: `chart.addSeries(LineSeries, opts)` replaces the old `addLineSeries()`.

## Phase 2: Build Table & Chart Independently

I built `PeerTable` and `PeerChart` as independent components before wiring them together.

**Table — selection enforcement at the source.** In `src/components/peer-table/peer-table.tsx`, I use TanStack Table's `enableRowSelection` callback to disable checkboxes when 4 rows are already selected (`enableRowSelection: (row) => row.getIsSelected() || selectedCount < MAX_PEER_SELECTION`). This is better than just rejecting state changes in `onRowSelectionChange` — it prevents the confusing UX where a user clicks a checkbox but nothing happens. The checkbox appears visually disabled with `opacity-40` and `cursor-not-allowed`, communicating the constraint before the click.

**Chart — split creation from updates.** In `src/hooks/use-lightweight-chart.ts`, I split the chart into two `useEffect`s:
- **Creation/destruction** (empty dependency array) — runs once, creates the chart instance, attaches `ResizeObserver`, returns cleanup
- **Data updates** (depends on `timeseries` and `colorMap`) — removes existing series and adds new ones

Chart creation is expensive. If I put everything in one effect that depends on `timeseries`, every selection change would teardown and rebuild the entire chart. Separating concerns means only the series data gets swapped.

**Line style hierarchy.** First 2 series render as `LineStyle.Solid`, 3rd and 4th as `LineStyle.Dashed` (`src/hooks/use-lightweight-chart.ts:91`). This keeps the chart readable at 4 overlapping series — the eye naturally groups solid vs dashed lines.

**Three-state chart overlay.** `PeerChart` (`src/components/peer-chart/peer-chart.tsx:40-61`) manages three mutually exclusive states as absolute-positioned overlays: loading (semi-opaque backdrop with blur + spinner), error (same overlay, red message), and empty (centered placeholder, no overlay). Conditional rendering order matters — error only renders when `!isLoading`, preventing both states from showing simultaneously.

## Phase 3: Integration & Color Stability

Connected the flow: table selection -> fetch timeseries -> render chart. This is where the non-obvious problem surfaced.

**The color shifting problem.** If you assign colors by array index, deselecting the middle item causes remaining items to shift colors. Example: select [AAPL=blue, GOOG=red, MSFT=teal], then deselect GOOG — without stable assignment, MSFT jumps from teal to red. The user loses their mental model of which line is which.

**Solution: `updateColorMap()` in `src/lib/colors.ts`.** This function takes the previous color map and the current active symbols. It preserves existing color assignments for still-active symbols, frees colors from removed symbols, and assigns available colors from the palette to new symbols. The result is a new `Map<string, string>` — immutable update, no mutation.

**Dual ref+state pattern in `src/hooks/use-color-map.ts`.** The color map lives in both a `useRef` (source of truth that survives re-renders without triggering them) and `useState` (triggers re-renders when the map actually changes). `syncColors()` updates both — the ref ensures the latest map is always available synchronously, the state ensures React knows to re-render.

## Phase 4: Caching & Edge Cases

**The latency problem.** The mock API has 3s latency. Without caching, deselecting and reselecting a company means waiting another 3 seconds for data we already have.

**Solution: `usePeerTimeseries` in `src/hooks/use-peer-timeseries.ts`.** Two refs work together:
- `cache` (`Map<string, SymbolTimeseries>`) — stores fetched data permanently
- `inFlightRef` (`Set<string>`) — tracks symbols currently being fetched

On each selection change, the hook filters `selectedSymbols` to only fetch symbols not in cache AND not already in-flight. This prevents duplicate requests when a user rapidly clicks multiple rows. Cached data is served instantly on reselect — no loading spinner, no network request.

**Partial loading, not binary.** `pendingSymbols` (`useState<Set>`, `src/hooks/use-peer-timeseries.ts:10`) syncs from `inFlightRef` after each fetch start/complete. `isLoading` is computed as `selectedSymbols.some(s => pendingSymbols.has(s))` — so if 2 of 4 symbols are cached and 2 are fetching, the chart renders cached data immediately while showing the loading overlay for the in-flight ones. The ref-to-state sync pattern: the ref handles dedup logic (no re-renders), state triggers the UI update for the overlay.

Error handling cleans up `inFlightRef` entries on failure so the symbol can be retried, and surfaces the error message without corrupting cached data for other symbols.

**Image fallback.** Company logos use external URLs that may break. The `onError` handler in `src/components/peer-table/columns.tsx:69-74` hides the broken image and shows an initials badge (first 2 characters of the symbol code) — degrades gracefully instead of showing a broken image icon.

## Phase 5: Architecture Extraction

After everything worked end-to-end, I extracted the monolithic structure into clean separation:

- `src/pages/peer-comparison.tsx` — page orchestrator, imports hooks, passes props down
- `src/hooks/use-peer-selection.ts` — row selection state + color synchronization
- `src/hooks/use-peer-timeseries.ts` — data fetching with caching and in-flight dedup
- `src/hooks/use-color-map.ts` — stable color assignment logic
- `src/lib/colors.ts` — pure function `updateColorMap()`, easily unit-testable
- `src/config/constants.ts` — `MAX_PEER_SELECTION` and `DEFAULT_SERIES_COLOR`

Added `ErrorBoundary` wrapper in `src/main.tsx` and path aliases (`@/`) for clean imports.

This extraction was intentionally deferred — "make it work, then make it right." Extracting too early means guessing at boundaries; extracting after integration means the boundaries reveal themselves.

## Testing

Browser-tested all interactive behaviors via Playwright MCP:

- **Selection flow**: 1 -> 2 -> 3 -> 4 rows, verified counter updates `(n/4)` in header
- **Max enforcement**: at 4/4, remaining checkboxes visually disabled, 5th click rejected
- **Deselection**: counter, legend, row highlight, and chart series all update correctly
- **Color stability**: deselect middle row, remaining series keep their assigned colors
- **Caching**: reselect a previously fetched company = instant render, no loading spinner
- **Rapid interaction**: select 2 rows before first fetch completes — both load correctly, no race conditions
- **Design fidelity**: compared rendered UI against `design.png`

## What I'd Do With More Time

- **AbortController** for fetch cancellation — the current approach works but `AbortController` is the idiomatic way to cancel in-flight requests on unmount
- **Unit tests** for `updateColorMap()` (pure function, easy to test) and `usePeerTimeseries` (mock the API, verify cache behavior)
- **Virtualized rows** if the dataset grew beyond ~50 companies — current DOM rendering is fine for 15 rows
- **Keyboard navigation** — arrow keys + Enter for row selection, improving accessibility
