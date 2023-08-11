import React, { RefObject, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { ChartStyle } from '../style';
import { RemoveChart } from '@/components/chart';
import { getElementHeight, getElementWidth } from '@/utils/dom';
import { NumberValue } from 'd3';
import { createSVG } from '@/components/svg';
import { createXAxis, createYAxis } from '@/components/axis';
import { createTooltip } from '@/components/tooltip';
import { createTitle } from '@/components/text';
import { createLegend } from '@/components/legend';

export default function BubbleChart(props: ChartStyle) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	const handleLoad = () => {
		RemoveChart(svgRef);
		CreateBubbleChart(svgRef, props);
	};

	useEffect(() => {
		handleLoad();
	}, [props]);

	return <svg width={'100%'} ref={svgRef} />;
}

function CreateBubbleChart(element: RefObject<SVGElement>, props: ChartStyle) {
	let { data, mapper, base, margin, xAxis, yAxis, zAxis, tooltip, animation, legend, font } = props;

	if (data.length === 0) return;
	if (base.width === undefined) base.width = getElementWidth(element);
	if (base.height === undefined) base.height = getElementHeight(element);
	xAxis.range = [margin.left, base.width - margin.right];
	yAxis.range = [base.height - margin.bottom, margin.top];
	zAxis.range = [5, zAxis.zMax];
	if (xAxis.type === undefined) xAxis.type = d3.scaleLinear;
	if (yAxis.type === undefined) yAxis.type = d3.scaleLinear;

	const x = d3.map(data, mapper.getX);
	const y = d3.map(data, mapper.getY);
	const r = d3.map(data, mapper.getR);
	const I = d3.range(x.length);

	let des: any[];
	if (mapper.getDes !== undefined) des = d3.map(data, mapper.getDes);

	const group = d3.map(data, mapper.getGroup);
	const distinctGroup = new d3.InternSet<string>(group);

	if (xAxis.domain === undefined) xAxis.domain = [d3.min(x) * 0.9, d3.max(x) * 1.1];
	if (yAxis.domain === undefined) yAxis.domain = [d3.min(y) * 0.9, d3.max(y) * 1.1];
	if (zAxis.domain === undefined) zAxis.domain = [0, d3.max(r)];

	const xScale = d3.scaleLinear(xAxis.domain as Iterable<NumberValue>, xAxis.range);
	const yScale = d3.scaleLinear(yAxis.domain as Iterable<NumberValue>, yAxis.range);
	const rScale = d3.scaleLinear(zAxis.domain as Iterable<NumberValue>, zAxis.range);

	if (font.size === undefined) font.size = Math.min(base.width, base.height) / 25 + 'px';
	if (base.color === undefined) base.color = d3.schemeAccent as Iterable<string>;

	const colorScale = d3.scaleOrdinal(group, base.color);

	if (tooltip.mapper === undefined)
		tooltip.mapper = (i: number) => {
			return `Title : ${des[i]}\nGroup : ${group[i]}\nx : ${x[i]}\ny : ${y[i]}\nr : ${r[i]}`;
		};

	const svg = createSVG(element, base.width, base.height);
	createTitle(svg, props);

	if (xAxis.enabled) {
		createXAxis(svg, d3.axisBottom(xScale).tickSizeOuter(0), props, true);
	}

	if (yAxis.enabled) {
		const yAxisGenerator = d3
			.axisLeft(yScale)
			.ticks(base.height / 40)
			.tickSizeOuter(0);
		createYAxis(svg, yAxisGenerator, props);
	}

	// z circle
	const bubbles = svg.append('g');
	bubbles
		.selectAll('circle')
		.data(I)
		.join('circle')
		.attr('class', (i) => 'bubbles bubble_' + Array.from(distinctGroup).indexOf(group[i]))
		.attr('fill', (i) => colorScale(group[i]))
		.attr('fill-opacity', 0.4)
		.attr('stroke', (i) => colorScale(group[i]))
		.attr('stroke-width', '1px')
		.attr('cx', (i) => xScale(x[i]))
		.attr('cy', (i) => yScale(y[i]))
		.attr('r', (i) => rScale(r[i]));

	// animation
	if (animation.enabled) {
		bubbles
			.selectAll('circle')
			.data(I)
			.attr('r', 0)
			.transition()
			.attr('r', (i) => rScale(r[i]))
			.duration(animation.duration)
			.ease(d3.easeExpInOut);
	}

	// highlight group
	const onHover = (_: unknown, i: number) => {
		bubbles.selectAll('.bubbles').style('opacity', 0.1);
		bubbles.selectAll('.bubble_' + i).style('opacity', 1);
	};
	const noHover = () => {
		bubbles.selectAll('.bubbles').style('opacity', 1);
	};

	if (legend.enabled) {
		createLegend(svg, Array.from(distinctGroup), colorScale, props, onHover, noHover);
	}

	if (tooltip.enabled) {
		const { showTooltip, moveTooltip, hideTooltip } = createTooltip(svg, props);
		bubbles
			.selectAll('.bubbles')
			.on('mouseover', showTooltip)
			.on('mousemove', moveTooltip)
			.on('mouseleave', hideTooltip);
	}
}

BubbleChart.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	map: PropTypes.objectOf(PropTypes.any),
	base: PropTypes.objectOf(PropTypes.any),
	margin: PropTypes.objectOf(PropTypes.number),
	xAxis: PropTypes.objectOf(PropTypes.any),
	yAxis: PropTypes.objectOf(PropTypes.any),
	tooltip: PropTypes.objectOf(PropTypes.any),
	animation: PropTypes.objectOf(PropTypes.any),
	legend: PropTypes.objectOf(PropTypes.any),
	font: PropTypes.objectOf(PropTypes.any),
};

BubbleChart.defaultProps = {
	mapper: {
		getX: (d: any) => d.x,
		getY: (d: any) => d.y,
		getR: (d: any) => d.z,
		getGroup: (d: any) => d.group,
	},
	base: {
		width: undefined,
		height: 300,
		title: '',
		color: undefined,
	},
	tooltip: {
		mapper: undefined,
		enabled: true,
	},
	xAxis: {
		title: 'x',
		type: d3.scaleTime,
		domain: undefined,
		range: undefined,
		padding: 0,
		tickRotation: undefined,
		tickOffset: undefined,
		enabled: true,
	},
	yAxis: {
		title: 'y',
		type: d3.scaleLinear,
		domain: undefined,
		range: undefined,
		enabled: true,
	},
	zAxis: {
		domain: undefined,
		range: undefined,
		zMax: 30,
	},
	margin: {
		top: 40,
		right: 100,
		bottom: 60,
		left: 60,
	},
	animation: {
		duration: 1000,
		enabled: true,
	},
	legend: {
		enabled: true,
	},
	font: {
		size: '12px',
	},
};
