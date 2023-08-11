export const convertCsvToFile = (csvString: string) => {
  const csvBlob = new Blob([csvString], { type: 'text/csv' });
  const csvFile = new File([csvBlob], 'data.csv', { type: 'text/csv' });
  return csvFile;
};
