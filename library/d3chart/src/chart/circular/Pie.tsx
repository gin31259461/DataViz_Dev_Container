import { RemoveChart } from "@/components/chart";
import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { ChartStyle, PieProps } from "../style";
import { createSVG } from "@/components/svg";
import { getElementHeight, getElementWidth } from "@/utils/dom";
import { createTitle } from "@/components/text";
import { createTooltip } from "@/components/tooltip";
import { createLegend } from "@/components/legend";

export default function Pie(props: ChartStyle & PieProps) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	const handleLoad = () => {
		RemoveChart(svgRef);
		createPie(svgRef, props);
	};

	React.useEffect(() => {
		handleLoad();
	}, [props]);

	return <svg width={"100%"} ref={svgRef} />;
}

function createPie(
	element: React.RefObject<SVGElement>,
	props: ChartStyle & PieProps,
) {
	let {
		data,
		mapper,
		base,
		margin,
		tooltip,
		animation,
		legend,
		font,
		pie,
		stroke,
		fill,
	} = props;

	if (data.length === 0) return;
	if (base.width === undefined) base.width = getElementWidth(element);
	if (base.height === undefined) base.height = getElementHeight(element);
	if (pie.radius.outer === undefined)
		pie.radius.outer =
			Math.max(
				base.width - margin.left - margin.right,
				base.height - margin.top - margin.bottom,
			) / 4;
	if (pie.radius.inner === undefined) pie.radius.inner = 0;
	if (pie.radius.label === undefined) pie.radius.label = pie.radius.outer * 1.2;
	if (pie.radius.corner === undefined) pie.radius.corner = 8;
	if (pie.padAngle === undefined) pie.padAngle = 0.01;

	const label = d3.map(data, mapper.getX);
	const distinctLabel = new d3.InternSet(label.filter((d) => d != ""));
	const value = d3.map(data, mapper.getY);
	const valueSum = d3.sum(value);
	const I = d3
		.range(label.length)
		.filter((i) => !isNaN(value[i]) && distinctLabel.has(label[i]));

	if (font.size === undefined)
		font.size = Math.min(base.width, base.height) / 25 + "px";

	tooltip.mapper = (i: number) => {
		return `label : ${label[i]}\nvalue : ${value[i]}`;
	};

	if (fill.color === undefined) {
		fill.color = d3.schemeAccent;
	}

	const colorScale = d3.scaleOrdinal(fill.color);

	// create arcs.
	// d3.pie()(data); -> divide data to each part
	const divData = d3
		.pie<number>()
		.padAngle(pie.padAngle)
		.sort(null)
		.value((i) => value[i])(I);

	const arcs = d3
		.arc<d3.PieArcDatum<number>>()
		.innerRadius(pie.radius.inner)
		.outerRadius(pie.radius.outer)
		.cornerRadius(pie.radius.corner);
	const arcsOuterTimes = d3
		.arc<d3.PieArcDatum<number>>()
		.innerRadius(0)
		.outerRadius(pie.radius.outer * 2);
	const arcLabel = d3
		.arc<d3.PieArcDatum<number>>()
		.innerRadius(pie.radius.label)
		.outerRadius(pie.radius.label);
	const arcValue = d3
		.arc<d3.PieArcDatum<number>>()
		.innerRadius(pie.radius.outer * 0.7)
		.outerRadius(pie.radius.outer * 0.7);
	const arcLabelTimes = d3
		.arc<d3.PieArcDatum<number>>()
		.innerRadius(pie.radius.label * 1.2)
		.outerRadius(pie.radius.label * 1.2);
	const pieCentroid = [
		margin.left + (base.width - margin.left - margin.right) / 2,
		margin.top + (base.height - margin.top - margin.bottom) / 2,
	];

	const svg = createSVG(element, base.width, base.height);
	createTitle(svg, props);

	const pieLabel = svg
		.append("g")
		.attr("text-anchor", "middle")
		.attr("transform", `translate(${pieCentroid})`);
	const Pie = svg.append("g").attr("transform", `translate(${pieCentroid})`);
	const pieValue = svg
		.append("g")
		.attr("text-anchor", "middle")
		.attr("transform", `translate(${pieCentroid})`);

	Pie.selectAll("path")
		.data(divData)
		.join("path")
		.attr("class", (_, i) => "svg-pie pie_" + i)
		.attr("fill", (d) => colorScale(label[d.data]))
		.attr("d", (d) => arcs(d));

	if (pie.enableLabel) {
		// label lines
		pieLabel
			.selectAll("polyline")
			.data(divData)
			.join("polyline")
			.transition()
			.attr("stroke", "currentColor")
			.attr("fill", "none")
			.attr("stroke-width", stroke.width)
			.attr("points", (d) => {
				if (
					d.endAngle - d.startAngle <
					(Number(font.size.slice(0, -2)) * 4) / 100
				)
					return "";
				const p1 = arcsOuterTimes.centroid(d);
				const p2 = arcLabel.centroid(d);
				let p3 = arcLabel.centroid(d);
				p3[0] = arcLabelTimes.centroid(d)[0];
				return [p1, p2, p3].join(",");
			});

		// label
		pieLabel
			.selectAll("text")
			.data(divData)
			.join("text")
			.style("font-size", font.size)
			.style("fill", "currentColor")
			.attr("text-anchor", (d) => {
				const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
				return midAngle < Math.PI ? "start" : "end";
			})
			.attr("transform", (d) => {
				let p = arcLabel.centroid(d);
				const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
				p[0] = arcLabelTimes.centroid(d)[0] + (midAngle < Math.PI ? 1 : -1) * 5;
				return `translate(${p})`;
			});

		pieLabel
			.selectAll("text")
			.data(divData)
			.selectAll("tspan")
			.data((d) => {
				const lines = `${label[d.data]}`.split(/\n/);
				return d.endAngle - d.startAngle >
					(Number(font.size.slice(0, -2)) * 4) / 100
					? lines
					: lines.slice(0, 0);
			})
			.join("tspan")
			.attr("x", 0)
			.attr("y", (_, i) => `${i * 1.1}em`)
			.attr("font-weight", (_, i) => (i ? null : "bold"))
			.text((d) => d);
	}

	if (pie.value.enabled) {
		pieValue
			.selectAll("text")
			.data(divData)
			.join("text")
			.attr("class", (d) => "pieValue pieValue_" + d.data)
			.attr("font-size", font.size)
			.attr("fill", pie.value.color)
			.attr("text-anchor", "middle")
			.attr("transform", (d) => {
				const p = arcValue.centroid(d);
				return `translate(${p})`;
			});

		pieValue
			.selectAll("text")
			.data(divData)
			.selectAll("tspan")
			.data((d) => {
				const lines = `${value[d.data]}`.split(/\n/);
				return d.endAngle - d.startAngle >
					(Number(font.size.slice(0, -2)) * 4) / 100
					? lines
					: "";
			})
			.join("tspan")
			.attr("x", 0)
			.attr("y", (_, i) => `${i * 1.1}em`)
			.attr("font-weight", (_, i) => (i ? null : "bold"))
			.text((d) => d);
	}

	const onHover = (_: unknown, i: number) => {
		const arcScale = 0.2;
		const hoverArc = d3
			.arc<d3.PieArcDatum<number>>()
			.innerRadius(pie.radius.inner * arcScale)
			.outerRadius(pie.radius.outer * arcScale);
		const hoverValue = d3
			.arc<d3.PieArcDatum<number>>()
			.innerRadius(pie.radius.outer * 0.7 * (1 + arcScale))
			.outerRadius(pie.radius.outer * 0.7 * (1 + arcScale));
		Pie.select(".pie_" + i)
			.transition()
			.attr("transform", `translate(${hoverArc.centroid(divData[i])})`)
			.duration(500)
			.ease(d3.easeElasticOut.amplitude(1).period(0.3));
		pieValue
			.select(".pieValue_" + i)
			.transition()
			.attr("transform", `translate(${hoverValue.centroid(divData[i])})`)
			.duration(500)
			.ease(d3.easeElasticOut.amplitude(1).period(0.3));
	};

	const noHover = () => {
		Pie.selectAll(".svg-pie")
			.transition()
			.attr("transform", `translate(0, 0)`)
			.duration(500)
			.ease(d3.easeElasticOut.amplitude(1).period(0.3));
		pieValue
			.selectAll(".pieValue")
			.data(divData)
			.transition()
			.attr("transform", (d) => {
				const p = arcValue.centroid(d);
				return `translate(${p})`;
			})
			.duration(500)
			.ease(d3.easeElasticOut.amplitude(1).period(0.3));
	};

	// Notice: attrTween will catch current data -> so here use I as data
	if (animation.enabled) {
		Pie.selectAll("path")
			.data(I)
			.attr("fill", "none")
			.transition()
			.attrTween("d", (i) => {
				const interpolate = d3.interpolate(
					{ startAngle: 0, endAngle: 0 },
					divData[i],
				);
				return (t: number) => {
					return arcs(interpolate(t)) as string;
				};
			})
			.attr("fill", (i) => colorScale(label[i]))
			.duration(animation.duration)
			.ease(d3.easeExpInOut);

		if (pie.value.enabled) {
			pieValue
				.selectAll("text")
				.data(divData)
				.selectAll("tspan")
				.data((d) => {
					const lines = `${value[d.data] / valueSum}`.split(/\n/);
					return d.endAngle - d.startAngle >
						(Number(font.size.slice(0, -2)) * 4) / 100
						? lines
						: "";
				})
				.transition()
				.textTween((d) => {
					const formatValue = d3.format(".1%");
					const f = d3.interpolate(0, Number(d));
					return (t) => {
						return formatValue(f(t));
					};
				})
				.duration(animation.duration)
				.ease(d3.easeExpInOut);
		}
	}

	if (legend.enabled) {
		createLegend(
			svg,
			Array.from(distinctLabel),
			colorScale,
			props,
			onHover,
			noHover,
		);
	}

	if (tooltip.enabled) {
		const { showTooltip, moveTooltip, hideTooltip } = createTooltip(
			svg,
			props,
			pieCentroid[0],
			pieCentroid[1],
		);
		Pie.selectAll("path")
			.data(I)
			.on("mouseover", showTooltip)
			.on("mousemove", moveTooltip)
			.on("mouseleave", hideTooltip);
	}
}

Pie.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	mapper: PropTypes.objectOf(PropTypes.any),
	base: PropTypes.objectOf(PropTypes.any),
	margin: PropTypes.objectOf(PropTypes.number),
	tooltip: PropTypes.objectOf(PropTypes.any),
	animation: PropTypes.objectOf(PropTypes.any),
	legend: PropTypes.objectOf(PropTypes.any),
	stroke: PropTypes.objectOf(PropTypes.any),
	fill: PropTypes.objectOf(PropTypes.any),
	font: PropTypes.objectOf(PropTypes.any),
	pie: PropTypes.objectOf(PropTypes.any),
};

Pie.defaultProps = {
	map: {
		getX: (d: any) => d.x,
		getY: (d: any) => d.y,
	},
	base: {
		width: undefined,
		height: 300,
		title: "",
		color: undefined,
	},
	tooltip: {
		map: undefined,
		enabled: true,
	},
	stroke: { width: 1 },
	fill: {},
	margin: {
		top: 40,
		right: 150,
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
		size: "12px",
	},
	pie: {
		radius: {
			outer: undefined,
			inner: undefined,
			label: undefined,
			corner: undefined,
		},
		value: {
			color: "rgb(114, 95, 78)",
			enabled: true,
		},
		padAngle: undefined,
		enableLabel: true,
	},
};
