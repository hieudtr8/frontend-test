import {
	type SymbolTimeseries,
	fetchTimeseriesBySymbols,
} from "@/api/mock-api";
import { useEffect, useRef, useState } from "react";

export function usePeerTimeseries(selectedSymbols: string[]) {
	const cache = useRef<Map<string, SymbolTimeseries>>(new Map());
	const inFlightRef = useRef<Set<string>>(new Set());
	const [pendingSymbols, setPendingSymbols] = useState<Set<string>>(new Set());
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (selectedSymbols.length === 0) {
			setError(null);
			return;
		}

		const toFetch = selectedSymbols.filter(
			(s) => !cache.current.has(s) && !inFlightRef.current.has(s),
		);

		if (toFetch.length === 0) return;

		for (const s of toFetch) {
			inFlightRef.current.add(s);
		}
		setPendingSymbols(new Set(inFlightRef.current));
		setError(null);

		fetchTimeseriesBySymbols(toFetch)
			.then((data) => {
				for (const ts of data) {
					cache.current.set(ts.symbolCode, ts);
					inFlightRef.current.delete(ts.symbolCode);
				}
				setPendingSymbols(new Set(inFlightRef.current));
			})
			.catch((err: unknown) => {
				for (const s of toFetch) {
					inFlightRef.current.delete(s);
				}
				setPendingSymbols(new Set(inFlightRef.current));
				setError(
					err instanceof Error ? err.message : "Failed to fetch timeseries",
				);
			});
	}, [selectedSymbols]);

	const timeseries = selectedSymbols
		.map((s) => cache.current.get(s))
		.filter((ts): ts is SymbolTimeseries => ts !== undefined);

	const isLoading = selectedSymbols.some((s) => pendingSymbols.has(s));

	return { timeseries, isLoading, error } as const;
}
