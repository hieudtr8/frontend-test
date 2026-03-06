const SERIES_PALETTE = [
	"#2563eb", // blue
	"#dc2626", // red
	"#16a34a", // green
	"#9333ea", // purple
] as const;

export type ColorMap = Map<string, string>;

/**
 * Assigns stable colors to symbol codes.
 * Returns a new map with colors assigned — existing assignments are preserved,
 * removed symbols are freed, and new symbols get the next available color.
 */
export function updateColorMap(
	prev: ColorMap,
	activeSymbols: string[],
): ColorMap {
	const next = new Map<string, string>();
	const usedColors = new Set<string>();

	// Preserve existing assignments for still-active symbols
	for (const symbol of activeSymbols) {
		const existing = prev.get(symbol);
		if (existing) {
			next.set(symbol, existing);
			usedColors.add(existing);
		}
	}

	// Assign new colors to newly selected symbols
	for (const symbol of activeSymbols) {
		if (!next.has(symbol)) {
			const available = SERIES_PALETTE.find((c) => !usedColors.has(c));
			if (available) {
				next.set(symbol, available);
				usedColors.add(available);
			}
		}
	}

	return next;
}
