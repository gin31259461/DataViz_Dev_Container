import { ChartStyle, HeatmapProps } from '@/chart/style';
import { format, range, ScaleSequential, Selection, interpolateRound, quantile, axisBottom } from 'd3';

export function createLegend(
	svg: d3.Selection<SVGElement | null, unknown, null, undefined>,
	keys: string[],
	colorScale: any,
	props: ChartStyle,
	onHover: (this: d3.BaseType, event: unknown, d: unknown | any) => void,
	noHover: (this: d3.BaseType, event: unknown, d: unknown | any) => void
) {
	const I = range(keys.length);
	const legend = svg
		.append('g')
		.attr('cursor', 'pointer')
		.attr('transform', `translate(${props.base.width - props.margin.right + 30}, ${props.margin.top})`);
	legend
		.selectAll('circle')
		.data(I)
		.join('circle')
		.attr('class', 'svg-legend')
		.attr('cx', 0)
		.attr('cy', (_, i) => i * 20 * 1.1)
		.attr('r', 10)
		.attr('fill', (i) => colorScale(keys[i]));
	legend
		.selectAll('text')
		.data(I)
		.join('text')
		.attr('class', 'svg-legend')
		.attr('x', 20)
		.attr('y', (_, i) => i * 20 * 1.1 + 4)
		.attr('text-anchor', 'start')
		.style('fill', 'currentColor')
		.style('font-size', '12px')
		.style('font-weight', 300)
		.text((i) => keys[i]);
	setTimeout(() => {
		legend.selectAll('.svg-legend').on('mouseover', onHover).on('mouseleave', noHover);
	}, props.animation.duration + 1);

	return legend;
}

export function createSequentialLegend(
	svg: Selection<SVGElement | null, unknown, null, undefined>,
	colorScale: ScaleSequential<unknown, string>,
	props: ChartStyle & HeatmapProps
) {
	// color scale => new chart_legend x scale
	const legendX = Object.assign(colorScale.copy().interpolator(interpolateRound(0, 200)), {
		range() {
			return [0, 200];
		},
	});

	// chart_legend rect
	const Legend = svg.append('g').attr('transform', `translate(10, ${props.margin.top / 3})`);
	Legend.append('image')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', 200)
		.attr('height', 10)
		.attr('preserveAspectRatio', 'none')
		.attr('xlink:href', () => {
			const canvasElement = ramp(colorScale.interpolator());
			if (canvasElement === undefined) return null;
			return canvasElement.toDataURL();
		});

	const ticks = props.base.width / 250,
		n = Math.round(ticks + 1),
		tickValues = range(n).map((i) => quantile(colorScale.domain(), i / (n - 1)));

	const tickFormat = format(props.heatmap.formatTick === undefined ? ',.0f' : props.heatmap.formatTick);

	// chart_legend axis and title
	Legend.append('g')
		.attr('transform', `translate(0, 10)`)
		.call(
			axisBottom(legendX as any)
				.ticks(ticks, props.heatmap.formatTick)
				.tickFormat(tickFormat as any)
				.tickSize(6)
				.tickValues(tickValues as any)
		)
		.call((g) => g.selectAll('.tick line').attr('y1', -10))
		.call((g) => g.select('.domain').remove())
		.call((g) =>
			g
				.append('text')
				.attr('x', 0)
				.attr('y', -16)
				.attr('fill', 'currentColor')
				.attr('text-anchor', 'start')
				.attr('font-weight', 'bold')
				.text(props.legend.title)
		);
}

function ramp(color: any, n = 256) {
	const canvas = document.createElement('canvas');
	canvas.width = n;
	canvas.height = 1;
	const context = canvas.getContext('2d', { willReadFrequently: true });
	if (context === null) return;
	for (let i = 0; i < n; i++) {
		context.fillStyle = color(i / (n - 1));
		context.fillRect(i, 0, 1, 1);
	}
	return canvas;
}
