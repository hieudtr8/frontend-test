import { PeerChart } from "@/components/peer-chart/peer-chart";
import { PeerTable } from "@/components/peer-table/peer-table";
import { Card } from "@/components/ui/card";
import companiesData from "@/data/companies.json";
import { usePeerSelection } from "@/hooks/use-peer-selection";
import { usePeerTimeseries } from "@/hooks/use-peer-timeseries";
import type { Company } from "@/types/company";

const companies = companiesData as Company[];

export function PeerComparisonPage() {
	const { rowSelection, setRowSelection, selectedSymbols, colorMap } =
		usePeerSelection();
	const { timeseries, isLoading, error } = usePeerTimeseries(selectedSymbols);

	return (
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
				<div className="pl-5 pr-14 pb-2">
					<PeerChart
						timeseries={timeseries}
						selectedSymbols={selectedSymbols}
						companies={companies}
						colorMap={colorMap}
						isLoading={isLoading}
						error={error}
					/>
				</div>
				<p className="pb-4 text-center text-xs text-slate-400">
					Select up to 4 companies in the table above to customize the chart
					view.
				</p>
			</Card>
		</div>
	);
}
