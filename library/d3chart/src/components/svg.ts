import { select } from 'd3';
import { RefObject } from 'react';

export function createSVG(element: RefObject<SVGElement>, width: number, height: number) {
	const svg = select(element.current)
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [0, 0, width, height])
		.attr('font-family', 'Source Sans Pro, sans-serif')
		.attr('overflow', 'visible');
	return svg;
}
