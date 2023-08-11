import { roundNumberToDecimalPlaces } from './math';

export const bigIntToString = (obj: any): unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => bigIntToString(item));
  }

  const convertedObj: any = {};

  for (const key in obj) {
    if (typeof obj[key] === 'bigint') {
      convertedObj[key] = obj[key].toString();
    } else if (typeof obj[key] === 'object') {
      convertedObj[key] = bigIntToString(obj[key]);
    } else {
      convertedObj[key] = obj[key];
    }
  }

  return convertedObj;
};

export const numberToStringPercentage = (percentage: number | undefined) => {
  if (!percentage) return '';
  return (roundNumberToDecimalPlaces(percentage, 2) * 100).toFixed(0).toString() + '%';
};
