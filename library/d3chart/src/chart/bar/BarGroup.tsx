import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { ChartStyle, MapDataProps } from '../style';
import { RemoveChart } from '@/components/chart';
import { getElementHeight, getElementWidth } from '@/utils/dom';
import { groupData } from '@/utils/data';
import { easeExpInOut, easeExpOut, NumberValue } from 'd3';
import { createTooltip } from '@/components/tooltip';
import { createLegend } from '@/components/legend';
import { createSVG } from '@/components/svg';
import { createXAxis, createYAxis } from '@/components/axis';
import { createTitle } from '@/components/text';

export default function BarGroup(props: ChartStyle) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	const handleLoad = () => {
		RemoveChart(svgRef);
		CreateBarGroup(svgRef, props);
	};

	React.useEffect(() => {
		handleLoad();
	}, [props]);

	return <svg width={'100%'} ref={svgRef} />;
}

function CreateBarGroup(element: React.RefObject<SVGElement>, props: ChartStyle) {
	let { data, mapper, base, margin, xAxis, yAxis, tooltip, animation, legend, font, fill } = props;

	if (data.length === 0) return;

	const x = d3.map<object, string>(data, mapper.getX);
	let rowKeys: string[] = [];
	mapper.keys.forEach((key) => rowKeys.push(key));
	const newData = groupData(rowKeys, data, x);

	if (base.width === undefined) base.width = getElementWidth(element);
	if (base.height === undefined) base.height = getElementHeight(element);

	const svg = createSVG(element, base.width, base.height);

	xAxis.range = [margin.left, base.width - margin.right];
	yAxis.range = [base.height - margin.bottom, margin.top];
	if (xAxis.domain === undefined) xAxis.domain = x.filter((d) => d !== '');
	if (yAxis.domain === undefined) {
		const domain2 = d3.max(newData, (obj) => d3.max(obj.value, (obj) => obj.y * 1.1));
		yAxis.domain = [0, domain2 !== undefined ? domain2 : 0];
	}
	xAxis.domain = new d3.InternSet<string>(xAxis.domain as Iterable<string>);

	const xScale = d3.scaleBand<string>(xAxis.domain as Iterable<string>, xAxis.range).padding(xAxis.padding);
	const yScale = d3.scaleLinear(yAxis.domain as Iterable<NumberValue>, yAxis.range);

	if (base.color === undefined) base.color = d3.schemeAccent as Iterable<string>;
	const colorScale = d3.scaleOrdinal(rowKeys, base.color);

	const xAxisGenerator = d3
		.axisBottom(xScale)
		.ticks(base.width / 80)
		.tickSizeOuter(0);
	const yAxisGenerator = d3.axisLeft(yScale).ticks(base.height / 40);

	if (tooltip.mapper === undefined)
		tooltip.mapper = (d: MapDataProps) => {
			return `Group : ${d.key}\nx : ${d.x}\ny : ${d.y}`;
		};

	const barGap = 3;
	const barWidth = xScale.bandwidth() / 3 - (rowKeys.length - 1) * barGap;

	if (font.size === undefined) font.size = Math.min(base.width, base.height) / barWidth + 'px';

	if (xAxis.enabled) {
		createXAxis(
			svg,
			xAxisGenerator,
			props,
			false,
			barWidth * x.length * rowKeys.length + barGap * x.length * (rowKeys.length - 1),
			x
		);
	}

	if (yAxis.enabled) {
		createYAxis(svg, yAxisGenerator, props);
	}

	const Bar = svg.append('g');
	const createBar = Bar.selectAll('rect');
	newData.forEach((d, i) => {
		createBar
			.data(d.value)
			.join('rect')
			.attr('class', 'bar_' + i)
			.attr('fill', (d) => colorScale(d.key))
			.attr('stroke', (d) => colorScale(d.key))
			.attr('stroke-width', '1px')
			.attr('fill-opacity', fill.opacity)
			.attr('rx', fill.radius.x)
			.attr('width', barWidth < 0 ? barWidth * -1 : barWidth)
			.attr('height', (d) => Math.abs(yScale(0) - yScale(d.y)))
			.attr('x', (d) => {
				const x = xScale(d.x.toString());
				return (x !== undefined ? x : 0) + xScale.bandwidth() / 6 + i * barWidth + i * barGap;
			})
			.attr('y', (d) => yScale(d.y));
	});

	createTitle(svg, props);

	const barValue = svg.append('g');
	const createBarValue = barValue.selectAll('text');

	if (fill.value.enabled) {
		newData.forEach((d, i) => {
			createBarValue
				.data(d.value)
				.join('text')
				.text((d) => d.y)
				.attr('class', 'barValue_' + i)
				.attr('font-size', font.size)
				.attr('fill', fill.value.color)
				.attr('font-weight', 600)
				.attr('text-anchor', 'middle')
				.attr('x', (d) => {
					const x = xScale(d.x.toString());
					return (x !== undefined ? x : 0) + xScale.bandwidth() / 6 + i * barWidth + i * barGap + barWidth / 2;
				})
				.attr('y', (d) => yScale(d.y) + 15);
		});
	}

	if (animation.enabled) {
		newData.forEach((d, i) => {
			Bar.selectAll('.bar_' + i)
				.data(d.value)
				.attr('y', base.height - margin.bottom)
				.attr('height', 0)
				.attr('fill', 'rgba(0, 0, 0, 0)')
				.transition()
				.attr('y', (d) => yScale(d.y))
				.attr('height', (d) => Math.abs(yScale(0) - yScale(d.y)))
				.attr('fill', (d) => colorScale(d.key))
				.duration(animation.duration)
				.ease(easeExpInOut);

			if (fill.value.enabled) {
				barValue
					.selectAll('.barValue_' + i)
					.data(d.value)
					.attr('y', base.height - margin.bottom)
					.transition()
					.attr('y', (d) => yScale(d.y) + 15)
					.textTween((d) => {
						const f = d3.interpolate(0, d.y);
						return (t) => {
							return `${d3.format('.0f')(f(t))}`;
						};
					})
					.duration(animation.duration)
					.ease(easeExpInOut);
			}
		});
	}

	const onHover = (event: unknown, index: unknown) => {
		newData.forEach((data, i) => {
			if (i === index) {
				Bar.selectAll('.bar_' + i)
					.data(data.value)
					.transition()
					.attr('height', (d) => yScale(0) - yScale(d.y))
					.attr('width', xScale.bandwidth() / 2)
					.attr('x', (d) => {
						const x = xScale(d.x.toString());
						return (x !== undefined ? x : 0) + xScale.bandwidth() / 4;
					})
					.attr('y', (d) => yScale(d.y))
					.attr('fill', (d) => colorScale(d.key))
					.duration(500)
					.ease(easeExpOut);
				barValue
					.selectAll('.barValue_' + i)
					.data(data.value)
					.transition()
					.attr('opacity', 1)
					.attr('x', (d) => {
						const x = xScale(d.x.toString());
						return (x !== undefined ? x : 0) + xScale.bandwidth() / 2;
					})
					.attr('y', (d) => yScale(d.y) + 15)
					.duration(500)
					.ease(easeExpOut);
			} else {
				Bar.selectAll('.bar_' + i)
					.data(data.value)
					.transition()
					.attr('height', 0)
					.attr('width', xScale.bandwidth() / 2)
					.attr('x', (d) => {
						const x = xScale(d.x.toString());
						return (x !== undefined ? x : 0) + xScale.bandwidth() / 4;
					})
					.attr('y', base.height - margin.bottom)
					.attr('fill', 'rgba(0, 0, 0, 0)')
					.duration(500)
					.ease(easeExpOut);
				barValue
					.selectAll('.barValue_' + i)
					.data(data.value)
					.transition()
					.attr('opacity', 0)
					.attr('x', (d) => {
						const x = xScale(d.x.toString());
						return (x !== undefined ? x : 0) + xScale.bandwidth() / 2;
					})
					.attr('y', yScale(0))
					.duration(500)
					.ease(easeExpOut);
			}
		});
	};

	const noHover = () => {
		newData.forEach((data, i) => {
			Bar.selectAll('.bar_' + i)
				.data(data.value)
				.transition()
				.attr('height', (d) => yScale(0) - yScale(d.y))
				.attr('width', barWidth)
				.attr('x', (d) => {
					const x = xScale(d.x.toString());
					return (x !== undefined ? x : 0) + xScale.bandwidth() / 6 + i * barWidth + i * barGap;
				})
				.attr('y', (d) => yScale(d.y))
				.attr('fill', (d) => colorScale(d.key))
				.duration(500)
				.ease(easeExpOut);
			barValue
				.selectAll('.barValue_' + i)
				.data(data.value)
				.transition()
				.attr('opacity', 1)
				.attr('x', (d) => {
					const x = xScale(d.x.toString());
					return (x !== undefined ? x : 0) + xScale.bandwidth() / 6 + i * barWidth + i * barGap + barWidth / 2;
				})
				.attr('y', (d) => yScale(d.y) + 15)
				.duration(500)
				.ease(easeExpOut);
		});
	};

	if (legend.enabled) {
		createLegend(svg, rowKeys, colorScale, props, onHover, noHover);
	}

	if (tooltip.enabled) {
		const { showTooltip, moveTooltip, hideTooltip } = createTooltip(svg, props);
		Bar.selectAll('rect').on('mouseover', showTooltip).on('mousemove', moveTooltip).on('mouseleave', hideTooltip);
	}
}

BarGroup.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	mapper: PropTypes.objectOf(PropTypes.any),
	base: PropTypes.objectOf(PropTypes.any),
	margin: PropTypes.objectOf(PropTypes.number),
	xAxis: PropTypes.objectOf(PropTypes.any),
	yAxis: PropTypes.objectOf(PropTypes.any),
	tooltip: PropTypes.objectOf(PropTypes.any),
	animation: PropTypes.objectOf(PropTypes.any),
	legend: PropTypes.objectOf(PropTypes.any),
	font: PropTypes.objectOf(PropTypes.any),
	fill: PropTypes.objectOf(PropTypes.any),
};

BarGroup.defaultProps = {
	mapper: {
		getX: (d: any) => d.x,
		keys: ['y'],
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
	margin: {
		top: 40,
		right: 80,
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
	fill: {
		opacity: 0.4,
		value: {
			// color: '#f2f0f0',
			color: 'currentColor',
			enabled: true,
		},
		radius: {
			x: 3,
			y: 0,
		},
	},
};
