import type { ColorMap } from "../../lib/colors.ts";
import type { Company } from "../../types/company.ts";

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
		<div className="absolute top-3 left-3 flex flex-col gap-1 rounded-lg bg-white/80 px-3 py-2 text-xs backdrop-blur-sm">
			{symbols.map((sym) => {
				const company = companies.find((c) => c.symbolCode === sym);
				const color = colorMap.get(sym) ?? "#94a3b8";
				return (
					<div key={sym} className="flex items-center gap-2">
						<span
							className="size-2.5 shrink-0 rounded-full"
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
