import { DEFAULT_SERIES_COLOR } from "@/config/constants";
import type { ColorMap } from "@/lib/colors";
import type { Company } from "@/types/company";

interface ChartLegendProps {
	symbols: string[];
	companies: Company[];
	colorMap: ColorMap;
}

export function ChartLegend({
	symbols,
	companies,
	colorMap,
}: ChartLegendProps) {
	if (symbols.length === 0) return null;

	return (
		<div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-col gap-1 text-xs">
			{symbols.map((sym) => {
				const company = companies.find((c) => c.symbolCode === sym);
				const color = colorMap.get(sym) ?? DEFAULT_SERIES_COLOR;
				return (
					<div key={sym} className="flex items-center gap-2">
						<span
							className="size-2.5 shrink-0 rounded-xs"
							style={{ backgroundColor: color }}
						/>
						<span className="text-slate-700">
							{company?.companyName ?? sym}
						</span>
					</div>
				);
			})}
		</div>
	);
}
