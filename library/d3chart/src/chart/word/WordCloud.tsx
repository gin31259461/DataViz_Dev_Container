import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { ChartStyle, WordProps } from '../style';
import { RemoveChart } from '@/components/chart';
import { createSVG } from '@/components/svg';
import { getElementHeight, getElementWidth } from '@/utils/dom';

export default function WordCloud(props: ChartStyle & WordProps) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	const handleLoad = () => {
		RemoveChart(svgRef);
		createWordCloud(svgRef, props);
	};

	React.useEffect(() => {
		handleLoad();
	}, [props]);

	return <svg ref={svgRef} />;
}

function createWordCloud(element: React.RefObject<SVGElement>, props: ChartStyle & WordProps) {
	let { wordData, margin, base, animation, word } = props;

	if (wordData.length === 0) return;
	if (base.width === undefined) base.width = getElementWidth(element);
	if (base.height === undefined) base.height = getElementHeight(element);

	const wordList = wordData
		.split(/[\s.]+/g)
		.map((w) => w.replace(/^[“‘"\-—()\[\]{}]+/g, ''))
		.map((w) => w.replace(/[;:.!?()\[\]{},"'’”\-—]+$/g, ''))
		.map((w) => w.replace(/['’]s$/g, ''))
		.map((w) => w.substring(0, 30))
		.map((w) => w.toLowerCase());

	const contentWidth = base.width - margin.left - margin.right;
	const contentHeight = base.height - margin.top - margin.bottom;

	const svg = createSVG(element, base.width, base.height);

	let wordMap = new Map<string, number>();
	wordList.forEach((d) => {
		if (wordMap.get(d) === undefined) wordMap.set(d, 1);
		else wordMap.set(d, (wordMap.get(d) as number) + 1);
	});

	let data: { text: string; size: number }[] = [];
	wordMap.forEach((v, k) => {
		data.push({
			text: k,
			size: v,
		});
	});

	if (word.size.range === undefined) word.size.range = [15, 75];
	if (word.size.domain === undefined) word.size.domain = [0, d3.max(data, (d) => d.size) as number];
	if (word.color.range === undefined) word.color.range = ['#ace', '#0f0'];
	if (word.color.domain === undefined) word.color.domain = [0, 100];

	const interpolator = d3.interpolate(word.color.range[0], word.color.range[1]);
	const wordScale = d3.scaleLinear().range(word.size.range).domain(word.size.domain);
	const colorScale = d3.scaleSequential().interpolator(interpolator).domain(word.color.domain);

	svg.append('g').attr(
		'transform',
		`translate(
      ${margin.left + contentWidth / 2},
      ${margin.top + contentHeight / 2})`
	);

	const render = (word: cloud.Word[]) => {
		svg
			.select('g')
			.append('g')
			.selectAll('text')
			.data(word)
			.join('text')
			.attr('font-size', (d) => d.size as number)
			.attr('fill', (d) => colorScale(d.size as number))
			.attr('text-anchor', 'middle')
			.attr('transform', (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
			.text((d) => d.text as string);
	};

	const wordLayout = cloud()
		.size([base.width, base.height])
		.words(data)
		.rotate(word.mapper.rotation)
		.padding(word.padding)
		.fontSize((d) => wordScale(d.size as number))
		.on('end', render);

	const wordRender = Promise.resolve(wordLayout.start());

	if (animation.enabled) {
		wordRender.then(() => {
			svg
				.selectAll('text')
				.attr('opacity', 0)
				.transition()
				.attr('opacity', 1)
				.duration(animation.duration)
				.ease(d3.easeExpInOut);
		});
	} else wordRender;
}

WordCloud.propTypes = {
	wordData: PropTypes.string.isRequired,
	base: PropTypes.objectOf(PropTypes.any),
	margin: PropTypes.objectOf(PropTypes.any),
	word: PropTypes.objectOf(PropTypes.any),
	animation: PropTypes.objectOf(PropTypes.any),
};

WordCloud.defaultProps = {
	base: {
		width: undefined,
		height: undefined,
	},
	margin: {
		top: 50,
		bottom: 50,
		right: 50,
		left: 50,
	},
	word: {
		mapper: {
			getWord: (d: any) => d.text,
			getSize: () => 0.3 + Math.random(),
			rotation: () => (~~(Math.random() * 6) - 3) * 30,
		},
		size: {
			range: undefined,
			domain: undefined,
		},
		color: {
			range: undefined,
			domain: undefined,
		},
		padding: 3,
	},
	animation: {
		duration: 3000,
		enabled: true,
	},
};
