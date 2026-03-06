import { createColumnHelper } from "@tanstack/react-table";
import { formatMarketCap, formatPe, formatPercent } from "../../lib/format.ts";
import type { Company } from "../../types/company.ts";

const MAX_SELECTION = 4;

const col = createColumnHelper<Company>();

export const columns = [
	col.display({
		id: "select",
		header: ({ table }) => {
			const count = Object.keys(table.getState().rowSelection).length;
			return (
				<span className="text-slate-400">
					({count}/{MAX_SELECTION})
				</span>
			);
		},
		size: 30,
		cell: ({ row }) => {
			const checked = row.getIsSelected();
			const disabled = !row.getCanSelect();
			return (
				<label
					className={`flex size-5 items-center justify-center rounded border-2 transition-colors ${
						checked
							? "border-blue-600 bg-blue-600 text-white"
							: disabled
								? "cursor-not-allowed border-slate-200 opacity-40"
								: "cursor-pointer border-slate-300 hover:border-blue-400"
					}`}
				>
					<input
						type="checkbox"
						checked={checked}
						disabled={disabled}
						onChange={row.getToggleSelectedHandler()}
						className="sr-only"
					/>
					{checked && (
						<svg
							viewBox="0 0 12 12"
							className="size-3"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M2.5 6l2.5 2.5 4.5-5"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</label>
			);
		},
	}),
	col.accessor("companyName", {
		header: "Company",
		size: 200,
		cell: ({ row }) => (
			<div className="flex items-center gap-2.5">
				<img
					src={row.original.logo}
					alt={row.original.companyName}
					className="size-6 shrink-0 rounded-full"
					onError={(e) => {
						const target = e.currentTarget;
						target.style.display = "none";
						const fallback = target.nextElementSibling as HTMLElement | null;
						if (fallback) fallback.style.display = "flex";
					}}
				/>
				<span
					className="hidden size-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600"
					aria-hidden
				>
					{row.original.symbolCode.slice(0, 2)}
				</span>
				<div className="min-w-0">
					<div className="truncate font-medium text-slate-900">
						{row.original.companyName}
					</div>
					<div className="text-xs text-slate-400">
						{row.original.symbolCode}
					</div>
				</div>
			</div>
		),
	}),
	col.accessor("marketCapitalization", {
		header: "Market Cap",
		size: 120,
		cell: ({ getValue }) => (
			<span className="tabular-nums">{formatMarketCap(getValue())}</span>
		),
	}),
	col.accessor("peTtm", {
		header: "PE TTM",
		size: 100,
		cell: ({ getValue }) => (
			<span className="tabular-nums">{formatPe(getValue())}</span>
		),
	}),
	col.accessor("revenueGrowthTtmYoy", {
		header: "Rev Growth TTM",
		size: 130,
		cell: ({ getValue }) => {
			const v = getValue();
			const color =
				v > 0 ? "text-green-600" : v < 0 ? "text-red-500" : "text-slate-500";
			return (
				<span className={`tabular-nums ${color}`}>{formatPercent(v)}</span>
			);
		},
	}),
	col.accessor("currentDividendYieldTtm", {
		header: "Div Yield TTM",
		size: 120,
		cell: ({ getValue }) => {
			const v = getValue();
			return <span className="tabular-nums">{formatPercent(v)}</span>;
		},
	}),
];
