import { easeExpOut } from "d3-ease";
import { ChartStyle } from "@/chart/style";
import { pointer } from "d3";

export function createTooltip(
	svg: d3.Selection<SVGElement | null, unknown, null, undefined>,
	props: ChartStyle,
	offsetX: number = 0,
	offsetY: number = 0,
) {
	const Tooltip = svg.append("g").attr("pointer-events", "none");

	const showTooltip = (event: any, d: unknown) => {
		Tooltip.transition()
			.attr(
				"transform",
				`translate(
        ${pointer(event, event.target)[0] + offsetX},
        ${pointer(event, event.target)[1] - 15 + offsetY}
      )`,
			)
			.duration(500)
			.ease(easeExpOut);

		const path = Tooltip.selectAll("path")
			.data([,])
			.join("path")
			.attr("fill", "#ffffffE6")
			.attr("stroke", "rgba(0, 20, 60, .2)")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round");
		// this is not working
		//.attr('box-shadow', '0 4px 20px 4px rgba(0, 20, 60, .1), 0 4px 80px -8px rgba(0, 20, 60, .2)');

		const text = Tooltip.selectAll("text")
			.data([,])
			.join("text")
			.style("font-size", props.font.size)
			.call((text) =>
				text
					.selectAll("tspan")
					.data(`${props.tooltip.mapper(d)}`.split(/\n/))
					.join("tspan")
					.attr("x", 0)
					.attr("y", (_, i) => `${i * 1.5}em`)
					.attr("font-weight", (_, i) => (i ? null : "bold"))
					.attr("fill", "black")
					.text((d) => d),
			);

		Tooltip.selectAll("path").attr("d", null);

		const textNode = text.node();
		const textBox =
			textNode === null
				? { width: 0, height: 0 }
				: (textNode as SVGGeometryElement).getBBox();
		const width = textBox.width;
		const height = textBox.height;

		text.attr("transform", `translate(${-width / 2}, ${-height + 7})`);
		path.attr(
			"d",
			`M${-width / 2 - 5},5
      H-5
      l5,5
      l5,-5
      H${width / 2 + 5}
      v${-height - 15}
      h-${width + 10}
      z
    `,
		);
	};

	const moveTooltip = (event: any) => {
		Tooltip.transition()
			.attr("opacity", 1)
			.attr(
				"transform",
				`translate(
        ${pointer(event, event.target)[0] + offsetX},
        ${pointer(event, event.target)[1] - 15 + offsetY}
      )`,
			)
			.duration(500)
			.ease(easeExpOut);
	};

	const hideTooltip = () => {
		Tooltip.transition().attr("opacity", 0).duration(500).ease(easeExpOut);
	};

	return { showTooltip, moveTooltip, hideTooltip, Tooltip };
}
