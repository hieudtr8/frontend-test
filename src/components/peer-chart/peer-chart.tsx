import type { SymbolTimeseries } from "@/api/mock-api";
import { Spinner } from "@/components/ui/spinner";
import { useLightweightChart } from "@/hooks/use-lightweight-chart";
import type { ColorMap } from "@/lib/colors";
import type { Company } from "@/types/company";
import { ChartLegend } from "./chart-legend.tsx";

interface PeerChartProps {
	timeseries: SymbolTimeseries[];
	selectedSymbols: string[];
	companies: Company[];
	colorMap: ColorMap;
	isLoading: boolean;
	error: string | null;
}

export function PeerChart({
	timeseries,
	selectedSymbols,
	companies,
	colorMap,
	isLoading,
	error,
}: PeerChartProps) {
	const containerRef = useLightweightChart({ timeseries, colorMap });

	return (
		<div className="relative">
			<div ref={containerRef} className="w-full" />
			<span className="pointer-events-none absolute top-1/2 -right-14 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs text-slate-400">
				Performance (%)
			</span>

			<ChartLegend
				symbols={selectedSymbols}
				companies={companies}
				colorMap={colorMap}
			/>

			{isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
					<div className="flex items-center gap-2 text-base font-medium text-slate-600">
						<Spinner />
						Loading...
					</div>
				</div>
			)}

			{error && !isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
					<p className="text-sm text-red-500">{error}</p>
				</div>
			)}

			{selectedSymbols.length === 0 && !isLoading && !error && (
				<div className="absolute inset-0 flex items-center justify-center">
					<p className="text-sm text-slate-400">
						Select companies above to view performance
					</p>
				</div>
			)}
		</div>
	);
}
