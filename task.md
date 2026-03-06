# Frontend Code Test

Please build a React page in **TypeScript** that replicates the supplied design.

## What you need to build

- A table populated using the provided `data.json`
- A chart showing time series data for selected table rows
- Row selection limited to **4 rows maximum**

## Rules

- Use **TanStack Table** to build the table
- Use **Lightweight Charts** to render the chart
- Use the provided `mock_api.ts` to generate the chart time series data
- The chart should render one series per selected row

## Behaviour

- When a user selects a row, its time series should be added to the chart
- When a user deselects a row, its time series should be removed
- Users cannot select more than 4 rows at the same time

## Tech stack

- React
- TypeScript
- TanStack Table
- Lightweight Charts

## References

- TanStack Table: https://tanstack.com/table
- Lightweight Charts: https://tradingview.github.io/lightweight-charts/