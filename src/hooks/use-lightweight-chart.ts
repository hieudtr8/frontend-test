import {
	type IChartApi,
	type ISeriesApi,
	LineSeries,
	LineStyle,
	type SeriesType,
	createChart,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { SymbolTimeseries } from "../api/mock-api.ts";
import type { ColorMap } from "../lib/colors.ts";

interface UseLightweightChartOptions {
	timeseries: SymbolTimeseries[];
	colorMap: ColorMap;
}

export function useLightweightChart({
	timeseries,
	colorMap,
}: UseLightweightChartOptions) {
	const containerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi | null>(null);
	const seriesListRef = useRef<ISeriesApi<SeriesType>[]>([]);

	// Create / destroy chart
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const chart = createChart(container, {
			layout: {
				background: { color: "transparent" },
				textColor: "#64748b",
				fontFamily: "'Inter', sans-serif",
			},
			grid: {
				vertLines: { color: "#f1f5f9" },
				horzLines: { color: "#f1f5f9" },
			},
			rightPriceScale: {
				borderVisible: false,
			},
			timeScale: {
				borderVisible: false,
			},
			crosshair: {
				horzLine: { labelBackgroundColor: "#475569" },
				vertLine: { labelBackgroundColor: "#475569" },
			},
			width: container.clientWidth,
			height: 350,
		});

		chartRef.current = chart;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width } = entry.contentRect;
				chart.applyOptions({ width });
			}
		});
		observer.observe(container);

		return () => {
			observer.disconnect();
			chart.remove();
			chartRef.current = null;
		};
	}, []);

	// Update series data
	useEffect(() => {
		const chart = chartRef.current;
		if (!chart) return;

		// Remove all existing series
		for (const s of seriesListRef.current) {
			chart.removeSeries(s);
		}
		seriesListRef.current = [];

		// Add new series
		for (let i = 0; i < timeseries.length; i++) {
			const ts = timeseries[i];
			const color = colorMap.get(ts.symbolCode) ?? "#94a3b8";
			const series = chart.addSeries(LineSeries, {
				color,
				lineWidth: 2,
				lineStyle: i % 2 === 0 ? LineStyle.Solid : LineStyle.Dashed,
				priceFormat: {
					type: "custom",
					formatter: (price: number) => `${price.toFixed(2)}%`,
				},
			});
			series.setData(
				ts.data.map((d) => ({
					time: d.t.slice(0, 10),
					value: d.v,
				})),
			);
			seriesListRef.current.push(series);
		}

		chart.timeScale().fitContent();
	}, [timeseries, colorMap]);

	return containerRef;
}
