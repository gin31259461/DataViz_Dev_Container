import { MapDataProps } from '@/chart/style';
import * as d3 from 'd3';

export function groupData(keys: string[], data: object[], xData: number[] | string[]) {
	return keys.map((k: string) => {
		const newData: MapDataProps[] = [];
		d3.map(data, (d, i) => {
			const keyValue = (d as { [k: string]: number })[k];
			newData.push({
				x: xData[i],
				y: keyValue,
				stackedY: keyValue,
				key: k,
				defined: typeof xData === 'number' ? !isNaN(xData[i]) && !isNaN(keyValue) : !isNaN(keyValue),
			});
		});
		return { group: k, value: newData };
	});
}
