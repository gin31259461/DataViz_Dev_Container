import { RefObject } from 'react';
import { sum } from 'd3';

export function getElementWidth(element: RefObject<SVGElement>): number {
	if (element.current == null) return 0;
	return element.current.getBoundingClientRect().width;
}

export function getElementHeight(element: RefObject<SVGElement>): number {
	if (element.current == null) return 0;
	return element.current.getBoundingClientRect().height;
}

export function getTextWidth(text: string, font: string) {
	let canvas: HTMLCanvasElement = document.createElement('canvas');
	let context: CanvasRenderingContext2D | null = canvas.getContext('2d');
	let metrics: TextMetrics;
	if (context !== null) {
		context.font = font;
		metrics = context.measureText(text);
		return metrics.width;
	}
	return 0;
}

export function getTextWidthSum(texts: Iterable<string>, fontFamily: string) {
	let textWidthSum = sum(texts, (k) => getTextWidth(k, fontFamily));
	return textWidthSum !== undefined ? textWidthSum : 0;
}
