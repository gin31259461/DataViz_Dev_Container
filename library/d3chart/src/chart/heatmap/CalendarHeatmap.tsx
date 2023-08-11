import React from 'react';
import * as d3 from 'd3';
import { ChartStyle, HeatmapProps } from '@/chart/style';
import { createSVG } from '@/components/svg';
import { RemoveChart } from '@/components/chart';
import { createTooltip } from '@/components/tooltip';
import { getElementHeight, getElementWidth } from '@/utils/dom';
import { createTitle } from '@/components/text';
import PropTypes from 'prop-types';
import { createSequentialLegend } from '@/components/legend';

export default function CalendarHeatmap(props: ChartStyle & HeatmapProps) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	const handleLoad = () => {
		RemoveChart(svgRef);
		CreateCalendarHeatmap(svgRef, props);
	};

	React.useEffect(() => {
		handleLoad();
	}, [props]);

	return <svg width={'100%'} ref={svgRef} />;
}

function CreateCalendarHeatmap(element: React.RefObject<SVGElement>, props: ChartStyle & HeatmapProps) {
	let { data, mapper, base, margin, animation, heatmap, tooltip, fill, font, event, legend } = props;

	if (data.length === 0) return;
	if (base.width === undefined) base.width = getElementWidth(element);
	if (base.height === undefined) base.height = getElementHeight(element);

	const x = d3.map(d3.map(data, mapper.getX) as [], (d: string) => d3.utcParse(heatmap.utcParse)(d)) as Date[],
		y = d3.map(data, mapper.getY),
		I = d3.range(x.length);

	/**
    utc day
    Sun-Sat
    0-7
  */

	const cellSize = (base.width - margin.top - margin.right) / 53;

	if (tooltip.mapper === undefined)
		tooltip.mapper = (i: number) => `date: ${d3.utcFormat(heatmap.formatUTCTip)(x[i])}\nvalue: ${y[i]}`;

	if (font.size === undefined) font.size = Math.min(base.width, base.height) / 25 + 'px';

	const // if sun position no change, mon (weekday also) position fix eg. Mon = 1 => 0
		countDay = heatmap.weekday === 'sunday' ? (i: number) => i : (i: number) => (i + 6) % 7,
		timeWeek = heatmap.weekday === 'sunday' ? d3.utcSunday : d3.utcMonday,
		weekDays = heatmap.weekday === 'weekday' ? 5 : 7,
		height = cellSize * (weekDays + 2),
		years = d3.groups(I, (i: number) => x[i].getFullYear()).reverse();

	let colorScale: d3.ScaleSequential<unknown, string>;

	const max = d3.quantile(y, 0.9975, Math.abs) as number;
	const formatMonth = d3.utcFormat(heatmap.monthParse);

	if (fill.color === undefined) {
		colorScale = d3.scaleSequential([-max, max], d3.interpolateBuGn).unknown('none');
	} else {
		const interpolator = d3.interpolate((fill.color as string[])[0], (fill.color as string[])[1]);
		colorScale = d3.scaleSequential([-max, max], interpolator).unknown('none');
	}

	const svg = createSVG(element, base.width, height * years.length + margin.top + margin.bottom);

	// create year group object
	const year = svg
		.selectAll('g')
		.data(years)
		.join('g')
		.attr('transform', (_, i) => `translate(${margin.left}, ${margin.top + height * i + cellSize * 1.5})`);

	// year group title
	year
		.append('text')
		.attr('x', -5)
		.attr('y', -5)
		.attr('font-size', font.size)
		.attr('font-weight', 'bold')
		.attr('text-anchor', 'end')
		.attr('fill', 'currentColor')
		.text(([key]) => key);

	// year group month
	year
		.append('g')
		.attr('text-anchor', 'end')
		.attr('font-size', font.size)
		.selectAll('text')
		.data(heatmap.weekday === 'weekday' ? d3.range(1, 6) : d3.range(7))
		.join('text')
		.attr('x', -5)
		.attr('y', (i) => (countDay(i) + 0.5) * cellSize)
		.attr('dy', '0.31em')
		.attr('fill', 'currentColor')
		.text(heatmap.formatDay);

	// year group cell
	const cell = year.append('g');
	cell
		.selectAll('rect')
		.data(
			heatmap.weekday === 'weekday'
				? ([, I]) => I.filter((i) => ![0, 6].includes(x[i].getUTCDay())) // filter Sun Sat
				: ([, I]) => I
		)
		.join('rect')
		.attr(
			'class',
			(i) => 'cell_' + x[i].getFullYear() + ' ' + x[i].getFullYear() + '-' + x[i].getMonth() + '-' + x[i].getDate()
		)
		.attr('width', cellSize - 1)
		.attr('height', cellSize - 1)
		.attr('x', (i) => timeWeek.count(d3.utcYear(x[i]), x[i]) * cellSize + 0.5)
		.attr('y', (i) => countDay(x[i].getUTCDay()) * cellSize + 0.5)
		.attr('rx', 3)
		.attr('fill', (i: number) => (y[i] !== null ? (colorScale(y[i]) as string) : fill.nullColor))
		.on('click', event.onClick);
	// .on('click', (e: MouseEvent, I) => {
	// 	console.log((e.target as HTMLElement).classList[1])
	// });

	// divide each month
	function pathMonth(t: Date) {
		const d = Math.max(0, Math.min(weekDays, countDay(t.getUTCDay())));
		const w = timeWeek.count(d3.utcYear(t), t);
		return `${
			d === 0
				? `M${w * cellSize},0`
				: d === weekDays
				? `M${(w + 1) * cellSize},0`
				: `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
		}V${weekDays * cellSize}`;
	}

	// create month object for each year group
	const month = year
		.append('g')
		.selectAll('g')
		.data(([, I]) => d3.utcMonths(d3.utcMonth(x[I[0]]), x[I[I.length - 1]]))
		.join('g');

	// divide each month
	month
		.filter((d, i) => i as any)
		.append('path')
		.attr('fill', 'none')
		.attr('stroke', 'currentColor')
		.attr('stroke-width', 3)
		.attr('d', pathMonth);

	// append months to each year group
	month
		.append('text')
		.attr('x', (d) => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
		.attr('y', -5)
		.attr('font-size', font.size)
		.attr('fill', 'currentColor')
		.text(formatMonth);

	createTitle(svg, props);

	if (animation.enabled) {
		for (let i = 0; i < 11; i++) {
			cell
				.selectAll('rect')
				.data(
					heatmap.weekday === 'weekday' ? ([, I]) => I.filter((i) => ![0, 6].includes(x[i].getUTCDay())) : ([, I]) => I
				)
				.attr('fill', 'none')
				.attr('width', 0)
				.transition()
				.attr('width', cellSize - 1)
				.attr('fill', (i: number) => (y[i] !== null ? (colorScale(y[i]) as string) : fill.nullColor))
				.duration(animation.duration)
				.ease(d3.easeExpInOut);
		}
	}

	if (legend.enabled) createSequentialLegend(svg, colorScale, props);

	if (tooltip.enabled) {
		years.forEach((y, i) => {
			const { showTooltip, moveTooltip, hideTooltip } = createTooltip(
				svg,
				props,
				margin.left,
				margin.top + cellSize * 1.5 + height * i
			);
			cell
				.selectAll('.cell_' + y[0])
				.on('mouseover', showTooltip)
				.on('mousemove', moveTooltip)
				.on('mouseleave', hideTooltip);
		});
	}
}

CalendarHeatmap.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	mapper: PropTypes.objectOf(PropTypes.any),
	base: PropTypes.objectOf(PropTypes.any),
	margin: PropTypes.objectOf(PropTypes.number),
	tooltip: PropTypes.objectOf(PropTypes.any),
	animation: PropTypes.objectOf(PropTypes.any),
	legend: PropTypes.objectOf(PropTypes.any),
	font: PropTypes.objectOf(PropTypes.any),
	fill: PropTypes.objectOf(PropTypes.any),
	heatmap: PropTypes.objectOf(PropTypes.any),
};

CalendarHeatmap.defaultProps = {
	mapper: {
		getX: (d: any) => d.date,
		getY: (d: any) => d.value,
	},
	base: {
		title: 'CalendarHeatmap',
		width: undefined,
	},
	fill: {
		colors: undefined,
		nullColor: '#808080',
	},
	tooltip: {
		mapper: undefined,
		enabled: true,
	},
	margin: {
		top: 65,
		bottom: 0,
		left: 40,
		right: 0,
	},
	legend: {
		title: 'frequency',
		enabled: true,
	},
	font: {
		size: '12px',
	},
	animation: {
		enabled: true,
		duration: 2000,
	},
	heatmap: {
		utcParse: '%Y-%m-%d',
		monthParse: '%b',
		formatUTCTip: '%Y-%m-%d',
		formatDay: (i: number) => 'SMTWTFS'[i],
		formatTick: undefined,
		weekday: 'sunday',
	},
	event: {
		onClick: undefined,
	},
};
