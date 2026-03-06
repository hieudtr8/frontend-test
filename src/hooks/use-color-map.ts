import { type ColorMap, updateColorMap } from "@/lib/colors";
import { useCallback, useRef, useState } from "react";

export function useColorMap() {
	const ref = useRef<ColorMap>(new Map());
	const [colorMap, setColorMap] = useState<ColorMap>(new Map());

	const syncColors = useCallback((symbols: string[]) => {
		const next = updateColorMap(ref.current, symbols);
		ref.current = next;
		setColorMap(next);
	}, []);

	return { colorMap, syncColors } as const;
}
