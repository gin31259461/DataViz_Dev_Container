import AreaChart from './chart/area/AreaChart';
import AreaStacked from './chart/area/AreaStacked';
import BarGroup from './chart/bar/BarGroup';
import BarStacked from './chart/bar/BarStacked';
import BubbleChart from './chart/bubble/BubbleChart';
import Pie from './chart/circular/Pie';
import Doughnut from './chart/circular/Doughnut';
import CalendarHeatmap from './chart/heatmap/CalendarHeatmap';
import LineChart from './chart/line/LineChart';
import ScatterChart from './chart/scatter/ScatterChart';
import WordCloud from './chart/word/WordCloud';

export type D3_CHART_PROPS =
	| 'AreaChart'
	| 'AreaStacked'
	| 'BarGroup'
	| 'BarStacked'
	| 'BubbleChart'
	| 'Pie'
	| 'Doughnut'
	| 'LineChart'
	| 'CalendarHeatmap'
	| 'ScatterChart'
	| 'WordCloud';

export const ChartComponentsList = [
	'AreaChart',
	'AreaStacked',
	'BarGroup',
	'BarStacked',
	'BubbleChart',
	'Pie',
	'Doughnut',
	'LineChart',
	'CalendarHeatmap',
	'ScatterChart',
	'WordCloud',
];

export const D3_CHART = {
	AreaChart,
	AreaStacked,
	BarGroup,
	BarStacked,
	BubbleChart,
	Pie,
	Doughnut,
	LineChart,
	ScatterChart,
	WordCloud,
	CalendarHeatmap,
};

export {
	AreaChart,
	AreaStacked,
	BarGroup,
	BarStacked,
	BubbleChart,
	Pie,
	Doughnut,
	LineChart,
	ScatterChart,
	WordCloud,
	CalendarHeatmap,
};
