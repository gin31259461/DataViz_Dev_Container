import { CurveFactory, CurveFactoryLineOnly, NumberValue } from "d3";
import { Word } from "d3-cloud";

export type MapDataProps = {
	x: string | number | Date;
	y: number;
	key: string;
	stackedY: number;
	defined: any;
};

type D3Function = (value: any, index: number, iterable: Iterable<any>) => any;

type BaseType = {
	width: number;
	height: number;
	title: string;
	color: Iterable<string> | string[];
};

type MapProps = {
	getX: D3Function;
	getY: D3Function;
	getR: D3Function;
	keys: Array<string>;
	getGroup: D3Function;
	getDes: D3Function;
};

type MarginProps = {
	top: number;
	bottom: number;
	left: number;
	right: number;
};

type AnimationProps = {
	duration: number;
	enabled: boolean;
};

type LegendProps = {
	title: string;
	enabled: boolean;
};

type XAxisProps = {
	title: string;
	domain:
		| [undefined, undefined]
		| [string, string]
		| string[]
		| Iterable<string>
		| [number, number];
	range: Array<number>;
	type: any;
	enabled: boolean;
	tickRotation: number;
	tickXOffset: number;
	tickYOffset: number;
	padding: number;
};

type YAxisProps = {
	title: string;
	domain:
		| [undefined, undefined]
		| [string, string]
		| [number, number]
		| Iterable<NumberValue>;
	range: Array<number>;
	type: any;
	enabled: boolean;
};

type ZAxisProps = {
	domain:
		| [undefined, undefined]
		| [string, string]
		| [number, number]
		| Iterable<NumberValue>;
	range: Array<number>;
	zMax: number;
};

type StrokeProps = {
	color: Iterable<string>;
	opacity: number;
	width: number;
	linecap: string;
	linejoin: string;
	enabled: boolean;
	type: CurveFactory | CurveFactoryLineOnly;
};

type NodeProps = {
	color: Iterable<string>;
	radius: number;
	enabled: boolean;
};

type ParserProps = {
	time: string;
};

type FillProps = {
	color: Iterable<string>;
	nullColor: string;
	opacity: number;
	type: CurveFactory;
	value: {
		color: string;
		enabled: boolean;
	};
	radius: {
		x: number;
		y: number;
	};
};

type TooltipProps = {
	mapper: Function;
	enabled: boolean;
};

type TimeProps = {
	type: Function;
};

type FontProps = {
	family: string;
	size: string;
};

export interface PieProps {
	pie: {
		radius: {
			outer: number;
			inner: number;
			corner: number;
			label: number;
		};
		value: {
			color: string;
			enabled: boolean;
		};
		padAngle: number;
		enableLabel: boolean;
	};
}

export type HeatmapProps = {
	heatmap: {
		cellSize: number;
		utcParse: string;
		monthParse: string;
		formatUTCTip: string;
		formatDay: any;
		formatTick: string;
		weekday: string;
	};
};

export type WordProps = {
	wordData: string;
	word: {
		size: {
			range: [number, number];
			domain: [number, number];
		};
		color: {
			range: [string, string];
			domain: [number, number];
		};
		padding: number;
		mapper: {
			getWord: Function;
			getSize: Function;
			rotation: (datum: Word, index: number) => number;
		};
	};
};

type EventHandler = {
	onClick: (event: Event) => void;
};

export interface ChartStyle {
	data: Array<object>;
	base: BaseType;
	mapper: MapProps;
	margin: MarginProps;
	colors: any;
	animation: AnimationProps;
	legend: LegendProps;
	xAxis: XAxisProps;
	yAxis: YAxisProps;
	zAxis: ZAxisProps;
	stroke: StrokeProps;
	node: NodeProps;
	parser: ParserProps;
	fill: FillProps;
	tooltip: TooltipProps;
	time: TimeProps;
	font: FontProps;
	event: EventHandler;
	ref?: React.MutableRefObject<SVGSVGElement | null>;
}
