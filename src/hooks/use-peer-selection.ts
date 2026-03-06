import { useColorMap } from "@/hooks/use-color-map";
import type { RowSelectionState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

export function usePeerSelection() {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const { colorMap, syncColors } = useColorMap();

	const selectedSymbols = useMemo(() => {
		return Object.keys(rowSelection).filter((key) => rowSelection[key]);
	}, [rowSelection]);

	useEffect(() => {
		syncColors(selectedSymbols);
	}, [selectedSymbols, syncColors]);

	return { rowSelection, setRowSelection, selectedSymbols, colorMap } as const;
}
