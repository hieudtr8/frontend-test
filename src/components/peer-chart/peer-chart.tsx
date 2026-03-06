import type { SymbolTimeseries } from "../../api/mock-api.ts";
import { useLightweightChart } from "../../hooks/use-lightweight-chart.ts";
import type { ColorMap } from "../../lib/colors.ts";
import type { Company } from "../../types/company.ts";
import { ChartLegend } from "./chart-legend.tsx";

interface PeerChartProps {
	timeseries: SymbolTimeseries[];
	selectedSymbols: string[];
	companies: Company[];
	colorMap: ColorMap;
	isLoading: boolean;
}

export function PeerChart({
	timeseries,
	selectedSymbols,
	companies,
	colorMap,
	isLoading,
}: PeerChartProps) {
	const containerRef = useLightweightChart({ timeseries, colorMap });

	return (
		<div className="relative">
			<div ref={containerRef} className="w-full" />
			<span className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 -rotate-90 text-xs text-slate-400">
				Performance (%)
			</span>

			<ChartLegend
				symbols={selectedSymbols}
				companies={companies}
				colorMap={colorMap}
			/>

			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
					<div className="flex items-center gap-2 text-sm text-slate-500">
						<svg
							className="size-4 animate-spin"
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
						Loading...
					</div>
				</div>
			)}

			{selectedSymbols.length === 0 && !isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<p className="text-sm text-slate-400">
						Select companies above to view performance
					</p>
				</div>
			)}
		</div>
	);
}
