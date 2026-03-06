# AI Usage Documentation

## Tool Used

**Claude Code** (CLI) with **Claude Opus 4.6** model — Anthropic's official agentic coding tool.

## How AI Was Used

### Planning Phase
- Analyzed the task requirements, design mockup, and provided data/API files
- Designed the component architecture and data flow (selection state -> fetch -> chart update)
- Identified technical pitfalls: Lightweight Charts v5 API changes, color stability on deselection, stale fetch handling

### Implementation
- Scaffolded the Vite + React + TypeScript project with Tailwind CSS and Biome
- Built the table component using TanStack Table's `useReactTable` with row selection
- Created a custom `useLightweightChart` hook for chart lifecycle management (create, update series, resize, cleanup)
- Implemented stable color assignment to prevent color shifting when toggling selections
- Added fetch cancellation to handle rapid selection changes during the 3-second mock latency

### Code Review & Verification
- Used Context7 MCP to look up current Lightweight Charts v5 and TanStack Table APIs to ensure correct usage
- Ran TypeScript strict mode checks and fixed all type errors
- Verified the UI in a browser to confirm visual fidelity with the design mockup
- Tested all interactive behaviors: selection, max-4 enforcement, loading states, chart updates

## Approach: Human-Directed AI

I defined the requirements, reviewed all AI output, and made architectural decisions. AI accelerated the implementation (scaffolding, boilerplate, API research) but every design choice — from "no state management library" to "stable color map via useRef" — was a deliberate human decision.

The AI helped me move faster while maintaining the code quality and architecture I would write by hand.
