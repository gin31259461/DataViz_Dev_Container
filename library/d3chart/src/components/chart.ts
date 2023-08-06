import { select } from "d3";

export function RemoveChart(element: React.RefObject<SVGElement>) {
	select(element.current).selectAll("*").remove();
}
