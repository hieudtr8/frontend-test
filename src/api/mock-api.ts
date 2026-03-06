export interface TimeseriesPoint {
	t: string;
	v: number;
}

export interface SymbolTimeseries {
	symbolCode: string;
	data: TimeseriesPoint[];
}

/**
 * Generates mock timeseries for each symbol and normalizes values to percent change from the first value.
 * Percent change = ((v - v0) / v0) * 100, where v0 is the initial value.
 */
function generateTimeseriesBySymbols(
	symbolCodes: string[],
): SymbolTimeseries[] {
	return symbolCodes.map((symbolCode) => {
		const raw = generateRawPriceTimeseries();
		const firstValue = raw[0].v;
		const data: TimeseriesPoint[] = raw.map(({ t, v }) => ({
			t,
			v: Math.round(((v - firstValue) / firstValue) * 10000) / 100,
		}));
		return { symbolCode, data };
	});
}

/** Generates raw price-like data (random walk) for normalization. */
function generateRawPriceTimeseries(): TimeseriesPoint[] {
	const data: TimeseriesPoint[] = [];
	const startDate = new Date();
	startDate.setFullYear(startDate.getFullYear() - 1);
	startDate.setHours(0, 0, 0, 0);

	const currentDate = new Date(startDate);
	const endDate = new Date();
	endDate.setHours(0, 0, 0, 0);

	const basePrice = 100;
	const volatility = 0.02;
	let price = basePrice;

	while (currentDate <= endDate) {
		const day = currentDate.getDay();
		if (day !== 0 && day !== 6) {
			price *= 1 + (Math.random() - 0.5) * 2 * volatility;
			data.push({
				t: currentDate.toISOString().replace(/\.\d{3}Z$/, "Z"),
				v: Math.round(price * 100) / 100,
			});
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return data;
}

const MOCK_LATENCY_MS = 3000;

/**
 * Mock API endpoint that fetches timeseries data for the given symbols.
 * Simulates 3 seconds of network latency.
 */
export async function fetchTimeseriesBySymbols(
	symbolCodes: string[],
): Promise<SymbolTimeseries[]> {
	await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
	return generateTimeseriesBySymbols(symbolCodes);
}
