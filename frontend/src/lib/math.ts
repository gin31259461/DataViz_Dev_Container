export const roundNumberToDecimalPlaces = (value: number, place: number): number => {
  return Math.round(value * Math.pow(10, place)) / Math.pow(10, place);
};
