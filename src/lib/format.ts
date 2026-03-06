/**
 * Format market cap from millions to human-readable string.
 * Input is in millions (e.g., 4445349.5 = $4.45T).
 */
export function formatMarketCap(valueInMillions: number): string {
	if (valueInMillions >= 1_000_000) {
		return `$${(valueInMillions / 1_000_000).toFixed(2)}T`;
	}
	if (valueInMillions >= 1_000) {
		return `$${(valueInMillions / 1_000).toFixed(2)}B`;
	}
	return `$${valueInMillions.toFixed(2)}M`;
}

export function formatPercent(value: number | undefined): string {
	if (value === undefined) return "-";
	const formatted = `${value.toFixed(1)}%`;
	return value > 0
		? `+${formatted}`
		: value === 0
			? `+${formatted}`
			: formatted;
}

export function formatPe(value: number | undefined): string {
	if (value === undefined) return "-";
	return value.toFixed(2);
}
