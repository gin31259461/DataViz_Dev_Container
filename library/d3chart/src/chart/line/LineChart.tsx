import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { ChartStyle, MapDataProps } from '../style';
import { createTooltip } from '@/components/tooltip';
import { createLegend } from '@/components/legend';
import { groupData } from '@/utils/data';
import { getElementHeight, getElementWidth } from '@/utils/dom';
import { RemoveChart } from '@/components/chart';
import { createTitle } from '@/components/text';

export default function LineChart(props: ChartStyle) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	const handleLoad = () => {
		RemoveChart(svgRef);
		CreateLineChart(svgRef, props);
	};

	React.useEffect(() => {
		handleLoad();
	}, [props]);

	return <svg width={'100%'} ref={svgRef} />;
}

function CreateLineChart(element: React.RefObject<SVGElement>, props: ChartStyle) {
	let { data, mapper, base, margin, xAxis, yAxis, stroke, node, parser, time, tooltip, animation, legend, font } =
		props;

	if (data.length == 0) return;
	if (base.width === undefined) base.width = getElementWidth(element);
	if (base.height === undefined) base.height = getElementHeight(element);
	xAxis.range = [margin.left, base.width - margin.right];
	yAxis.range = [base.height - margin.bottom, margin.top];
	xAxis.type = d3.scaleTime;
	yAxis.type = d3.scaleLinear;

	const x = d3.map(d3.map(data, mapper.getX), (d) => time.type(parser.time)(d));

	let rowKeys: string[] = [];
	mapper.keys.forEach((key) => rowKeys.push(key));

	const newData = groupData(rowKeys, data, x);

	if (xAxis.domain === undefined) xAxis.domain = d3.extent(x);
	if (yAxis.domain === undefined) {
		const domain2 = d3.max(newData, (obj) => d3.max(obj.value, (obj) => obj.y * 1.1));
		yAxis.domain = ['0', domain2 !== undefined ? domain2.toString() : '0'];
	}

	const xScale = xAxis.type(xAxis.domain, xAxis.range);
	const yScale = yAxis.type(yAxis.domain, yAxis.range);

	if (font.size === undefined) font.size = Math.min(base.width, base.height) / 25 + 'px';

	const xAxisType = d3
		.axisBottom(xScale)
		.ticks(base.width / 80)
		.tickSizeOuter(0);
	const yAxisType = d3.axisLeft(yScale).ticks(base.height / 40);

	// d: newData -> value
	const line = d3
		.line<MapDataProps>()
		.defined((d) => d.defined)
		.curve(stroke.type)
		.x((d) => xScale(d.x))
		.y((d) => yScale(d.y));

	if (tooltip.mapper === undefined)
		tooltip.mapper = (d: MapDataProps) => {
			return `Group : ${d.key}\nx : ${d3.timeFormat('%Y-%m-%d')(d.x as Date)}\ny : ${d.y}`;
		};

	const svg = d3
		.select(element.current)
		.attr('width', base.width)
		.attr('height', base.height)
		.attr('viewBox', [0, 0, base.width, base.height])
		.attr('font-family', 'Source Sans Pro, sans-serif')
		.attr('overflow', 'visible');

	if (yAxis.enabled) {
		const YAxis = svg.append('g').attr('transform', `translate(${margin.left}, 0)`);
		YAxis.call(yAxisType)
			.call((g) => g.select('.domain').remove())
			.call((g) =>
				g
					.selectAll('.tick line')
					.clone()
					.attr('x2', base.width - margin.left - margin.right)
					.attr('stroke-opacity', 0.1)
			)
			.call((g) =>
				g
					.append('text')
					.attr('x', 0)
					.attr('y', margin.top - 12)
					.attr('font-size', '12px')
					.attr('text-anchor', 'end')
					.attr('fill', 'currentColor')
					.text(yAxis.title)
			);
	}

	if (xAxis.enabled) {
		const XAxis = svg.append('g').attr('transform', `translate(0, ${base.height - margin.bottom})`);
		XAxis.call(xAxisType).call((g) =>
			g
				.append('text')
				.attr('x', base.width - margin.right + 12)
				.attr('y', 0)
				.attr('font-size', '12px')
				.attr('text-anchor', 'start')
				.attr('fill', 'currentColor')
				.text(xAxis.title)
		);
	}

	createTitle(svg, props);

	if (stroke.color === undefined) stroke.color = d3.schemeAccent as Iterable<string>;
	const strokeColorScale = d3.scaleOrdinal(rowKeys, stroke.color);

	const linePath = svg.append('g');
	const lineNode = svg.append('g');

	if (stroke.enabled) {
		linePath
			.selectAll('path')
			.data(newData)
			.join('path')
			.attr('class', (_, i) => 'svg-line line_' + i)
			.attr('fill', 'none')
			.attr('stroke', (d) => strokeColorScale(d.group))
			.attr('stroke-base.width', stroke.width)
			.attr('stroke-linecap', stroke.linecap)
			.attr('stroke-linejoin', stroke.linejoin)
			.attr('stroke-opacity', stroke.opacity)
			.attr('d', (d) => line(d.value));
	}

	if (node.enabled) {
		const createNode = lineNode.selectAll('circle');
		newData.forEach((d, i) => {
			createNode
				.data(d.value)
				.join('circle')
				.attr('class', 'svg-node node_' + i)
				.attr('cx', (d) => xScale(d.x))
				.attr('cy', (d) => yScale(d.y))
				.attr('r', node.radius)
				.attr('fill', strokeColorScale(d.group))
				.attr('stroke', strokeColorScale(d.group))
				.attr('stroke-base.width', stroke.width);
		});
	}

	if (animation.enabled) {
		if (stroke.enabled) {
			const pathLength = linePath
				.selectAll('path')
				.nodes()
				.map((node) => {
					return node === null ? 0 : (node as SVGGeometryElement).getTotalLength();
				});
			linePath
				.selectAll('path')
				.data(pathLength)
				.attr('stroke-dasharray', (d) => d + ' ' + d)
				.attr('stroke-dashoffset', (d) => d)
				.transition()
				.ease(d3.easeLinear)
				.attr('stroke-dashoffset', 0)
				.duration(animation.duration)
				.ease(d3.easeExpInOut);
		}
		if (node.enabled) {
			lineNode
				.selectAll('circle')
				.style('opacity', 0)
				.transition()
				.ease(d3.easeLinear)
				.style('opacity', 1)
				.duration(animation.duration)
				.ease(d3.easeExpInOut);
		}
	}

	const onHover = (_: unknown, i: number) => {
		linePath.selectAll('.svg-line').style('opacity', 0.1);
		lineNode.selectAll('.svg-node').style('opacity', 0.1);
		linePath.selectAll('.line_' + i).style('opacity', stroke.opacity);
		lineNode.selectAll('.node_' + i).style('opacity', stroke.opacity);
	};
	const noHover = () => {
		linePath.selectAll('.svg-line').style('opacity', stroke.opacity);
		lineNode.selectAll('.svg-node').style('opacity', stroke.opacity);
	};

	// legend
	if (legend.enabled) {
		createLegend(svg, rowKeys, strokeColorScale, props, onHover, noHover);
	}

	if (tooltip.enabled) {
		const { showTooltip, moveTooltip, hideTooltip } = createTooltip(svg, props);
		lineNode
			.selectAll('circle')
			.on('mouseover', showTooltip)
			.on('mousemove', moveTooltip)
			.on('mouseleave', hideTooltip);
	}
}

LineChart.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	mapper: PropTypes.objectOf(PropTypes.any),
	base: PropTypes.objectOf(PropTypes.any),
	margin: PropTypes.objectOf(PropTypes.number),
	xAxis: PropTypes.objectOf(PropTypes.any),
	yAxis: PropTypes.objectOf(PropTypes.any),
	stroke: PropTypes.objectOf(PropTypes.any),
	node: PropTypes.objectOf(PropTypes.any),
	parser: PropTypes.objectOf(PropTypes.any),
	time: PropTypes.objectOf(PropTypes.any),
	tooltip: PropTypes.objectOf(PropTypes.any),
	font: PropTypes.objectOf(PropTypes.any),
	animation: PropTypes.objectOf(PropTypes.any),
	legend: PropTypes.objectOf(PropTypes.any),
};

LineChart.defaultProps = {
	mapper: {
		getX: (d: any) => d.x,
		keys: ['y'],
	},
	base: {
		width: undefined,
		height: 300,
		title: '',
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
		enabled: true,
	},
	yAxis: {
		title: 'y',
		type: d3.scaleLinear,
		domain: undefined,
		range: undefined,
		enabled: true,
	},
	parser: {
		time: '%Y-%m-%d',
	},
	time: {
		type: d3.timeParse,
	},
	stroke: {
		color: undefined,
		type: d3.curveMonotoneX,
		linecap: 'round',
		linejoin: 'round',
		width: 1.5,
		opacity: 1,
		enabled: true,
	},
	margin: {
		top: 40,
		right: 80,
		bottom: 60,
		left: 60,
	},
	node: {
		radius: 5,
		enabled: true,
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
