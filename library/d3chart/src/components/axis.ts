import { ChartStyle } from '@/chart/style';
import { getTextWidthSum } from '@/utils/dom';
import { Axis, easeExpOut, NumberValue, Selection } from 'd3';

export function createXAxis(
	svg: d3.Selection<SVGElement | null, unknown, null, undefined>,
	xAxisGenerator: Axis<string> | Axis<NumberValue>,
	props: ChartStyle,
	enableTickLine: boolean = false,
	ticksWidthLimit?: number,
	xData?: Iterable<string>
) {
	if (props.xAxis.tickRotation === undefined && ticksWidthLimit !== undefined && xData !== undefined) {
		const textWidthSum = getTextWidthSum(xData, props.font.family);
		if (textWidthSum > ticksWidthLimit * 20) {
			props.xAxis.tickRotation = 90;
			props.xAxis.tickXOffset = 6;
			props.xAxis.tickYOffset = -3;
		} else if (textWidthSum > ticksWidthLimit * 10) {
			props.xAxis.tickRotation = 45;
			props.xAxis.tickXOffset = 6;
			props.xAxis.tickYOffset = 6;
		}
	}

	const xAxis = svg.append('g').attr('transform', `translate(0, ${props.base.height - props.margin.bottom})`);
	xAxis.call(xAxisGenerator);
	if (props.xAxis.tickRotation !== undefined)
		xAxis
			.selectAll('text')
			.attr('text-anchor', 'start')
			.attr('x', props.xAxis.tickXOffset)
			.attr('y', props.xAxis.tickYOffset)
			.attr('transform', `rotate(${props.xAxis.tickRotation})`);
	if (enableTickLine) {
		xAxis.call((g) => {
			g.selectAll('.tick line')
				.clone()
				.attr('y2', -(props.base.height - props.margin.top - props.margin.bottom))
				.attr('stroke-opacity', 0.1);
		});
	}
	xAxis.call((g) =>
		g
			.append('text')
			.attr('x', props.base.width - props.margin.right + 12)
			.attr('y', 0)
			.attr('font-size', '12px')
			.attr('text-anchor', 'start')
			.attr('fill', 'currentColor')
			.text(props.xAxis.title)
	);
	return xAxis;
}

export function createYAxis(
	svg: d3.Selection<SVGElement | null, unknown, null, undefined>,
	yAxisGenerator: Axis<NumberValue>,
	props: ChartStyle
) {
	const yAxis = svg.append('g').attr('transform', `translate(${props.margin.left}, 0)`);
	yAxis
		.call(yAxisGenerator)
		.call((g) => g.select('.domain').remove())
		.call((g) =>
			g
				.selectAll('.tick line')
				.clone()
				.attr('x2', props.base.width - props.margin.left - props.margin.right)
				.attr('stroke-opacity', 0.1)
		)
		.call((g) =>
			g
				.append('text')
				.attr('x', 0)
				.attr('y', props.margin.top - 12)
				.attr('font-size', '12px')
				.attr('text-anchor', 'end')
				.attr('fill', 'currentColor')
				.text(props.yAxis.title)
		);

	const YAxis = {
		element: yAxis,
		recreate: (generator: Axis<NumberValue>) => reCreateYAxis(yAxis, generator, props),
	};

	return YAxis;
}

export type YAxisType = {
	element: Selection<SVGGElement, unknown, null, undefined>;
	recreate: (generator: Axis<NumberValue>) => void;
};

function reCreateYAxis(
	yAxis: d3.Selection<SVGGElement, unknown, null, undefined>,
	yAxisGenerator: Axis<NumberValue>,
	props: ChartStyle
) {
	yAxis.selectAll('.tick').remove();
	yAxis.selectAll('text').remove();
	yAxis.transition().call(yAxisGenerator).duration(500).ease(easeExpOut);
	yAxis
		.call((g) => g.select('.domain').remove())
		.call((g) =>
			g
				.selectAll('.tick line')
				.clone()
				.attr('x2', props.base.width - props.margin.left - props.margin.right)
				.attr('stroke-opacity', 0.1)
		)
		.call((g) =>
			g
				.append('text')
				.attr('x', 0)
				.attr('y', props.margin.top - 12)
				.attr('font-size', '12px')
				.attr('text-anchor', 'end')
				.attr('fill', 'currentColor')
				.text(props.yAxis.title)
		);
}
