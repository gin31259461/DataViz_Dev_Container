import { ChartStyle } from "@/chart/style";

export function createTitle(svg: d3.Selection<SVGElement | null, unknown, null, undefined>, props: ChartStyle) {
	const title = svg.append('g');
	title.call((g) =>
		g
			.append('text')
			.attr('x', props.margin.left + (props.base.width - props.margin.right - props.margin.left) / 2)
			.attr('y', props.margin.top / 2)
			.style('font-weight', 550)
			.style('font-size', '20px')
			.attr('text-anchor', 'middle')
			.style('fill', 'currentColor')
			.text(props.base.title)
	);
	return title;
}