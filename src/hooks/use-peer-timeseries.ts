import {
	type SymbolTimeseries,
	fetchTimeseriesBySymbols,
} from "@/api/mock-api";
import { useEffect, useState } from "react";

export function usePeerTimeseries(selectedSymbols: string[]) {
	const [timeseries, setTimeseries] = useState<SymbolTimeseries[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (selectedSymbols.length === 0) {
			setTimeseries([]);
			setIsLoading(false);
			setError(null);
			return;
		}

		let cancelled = false;
		setIsLoading(true);
		setError(null);

		fetchTimeseriesBySymbols([...selectedSymbols])
			.then((data) => {
				if (!cancelled) {
					setTimeseries(data);
					setIsLoading(false);
				}
			})
			.catch((err: unknown) => {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to fetch timeseries",
					);
					setIsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [selectedSymbols]);

	return { timeseries, isLoading, error } as const;
}
