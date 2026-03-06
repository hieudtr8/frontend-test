import type { RowSelectionState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	type SymbolTimeseries,
	fetchTimeseriesBySymbols,
} from "./api/mock-api.ts";
import { PeerChart } from "./components/peer-chart/peer-chart.tsx";
import { PeerTable } from "./components/peer-table/peer-table.tsx";
import { Card } from "./components/ui/card.tsx";
import companiesData from "./data/companies.json";
import { type ColorMap, updateColorMap } from "./lib/colors.ts";
import type { Company } from "./types/company.ts";

const companies = companiesData as Company[];

export function App() {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [timeseries, setTimeseries] = useState<SymbolTimeseries[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const colorMapRef = useRef<ColorMap>(new Map());
	const [colorMap, setColorMap] = useState<ColorMap>(new Map());

	const selectedSymbols = useMemo(() => {
		return Object.keys(rowSelection).filter((key) => rowSelection[key]);
	}, [rowSelection]);

	const updateColors = useCallback((symbols: string[]) => {
		const next = updateColorMap(colorMapRef.current, symbols);
		colorMapRef.current = next;
		setColorMap(next);
	}, []);

	// Update color map when selection changes
	useEffect(() => {
		updateColors(selectedSymbols);
	}, [selectedSymbols, updateColors]);

	// Fetch timeseries data when selection changes
	useEffect(() => {
		if (selectedSymbols.length === 0) {
			setTimeseries([]);
			setIsLoading(false);
			return;
		}

		let cancelled = false;
		setIsLoading(true);

		const symbols = [...selectedSymbols];
		fetchTimeseriesBySymbols(symbols).then((data) => {
			if (!cancelled) {
				setTimeseries(data);
				setIsLoading(false);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [selectedSymbols]);

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl space-y-6">
				<Card>
					<div className="px-5 pt-5 pb-1">
						<h2 className="text-base font-semibold text-slate-900">
							Peer Comparison Table
						</h2>
					</div>
					<PeerTable
						data={companies}
						rowSelection={rowSelection}
						onRowSelectionChange={setRowSelection}
					/>
				</Card>

				<Card className="overflow-hidden">
					<div className="px-5 pt-5">
						<h2 className="text-base font-semibold text-slate-900">
							Peer Performance
						</h2>
					</div>
					<div className="px-5 pb-2">
						<PeerChart
							timeseries={timeseries}
							selectedSymbols={selectedSymbols}
							companies={companies}
							colorMap={colorMap}
							isLoading={isLoading}
						/>
					</div>
					<p className="pb-4 text-center text-xs italic text-slate-400">
						Select up to 4 companies in the table above to customize the chart
						view.
					</p>
				</Card>
			</div>
		</div>
	);
}
