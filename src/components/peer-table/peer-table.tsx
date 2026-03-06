import {
	type RowSelectionState,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { Company } from "../../types/company.ts";
import { columns } from "./columns.tsx";

const MAX_SELECTION = 4;

interface PeerTableProps {
	data: Company[];
	rowSelection: RowSelectionState;
	onRowSelectionChange: (updater: RowSelectionState) => void;
}

export function PeerTable({
	data,
	rowSelection,
	onRowSelectionChange,
}: PeerTableProps) {
	const selectedCount = Object.keys(rowSelection).length;

	const table = useReactTable({
		data,
		columns,
		state: { rowSelection },
		onRowSelectionChange: (updaterOrValue) => {
			const next =
				typeof updaterOrValue === "function"
					? updaterOrValue(rowSelection)
					: updaterOrValue;
			if (Object.keys(next).length > MAX_SELECTION) return;
			onRowSelectionChange(next);
		},
		enableRowSelection: (row) => {
			if (row.getIsSelected()) return true;
			return selectedCount < MAX_SELECTION;
		},
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.symbolCode,
	});

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					{table.getHeaderGroups().map((hg) => (
						<tr key={hg.id} className="border-b border-slate-100">
							{hg.headers.map((header) => (
								<th
									key={header.id}
									className={`px-4 py-3 text-xs font-medium tracking-wide text-slate-400 uppercase ${
										header.id === "companyName" || header.id === "select"
											? "text-left"
											: "text-right"
									}`}
									style={{ width: header.getSize() }}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr
							key={row.id}
							className={`border-b border-slate-50 transition-colors ${
								row.getIsSelected() ? "bg-blue-50/60" : "hover:bg-slate-50/80"
							}`}
						>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className={`px-4 py-3 ${
										cell.column.id === "companyName" ||
										cell.column.id === "select"
											? "text-left"
											: "text-right"
									}`}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
