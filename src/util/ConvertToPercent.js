export default function convertToPercent(countyResultEntities, countyResultKeys) {
  const convertedObject = JSON.parse(JSON.stringify(countyResultEntities));
  countyResultKeys.forEach((key) => {
    const countyResults = convertedObject[key].results;
    const countyTotal = Object.values(countyResults).reduce((sum, num) => sum + num);
    const candidateIds = Object.keys(countyResults);
    candidateIds.forEach((candidateId) => {
      const candidatePercent = countyResults[candidateId] / countyTotal;
      convertedObject[key].results[candidateId] = candidatePercent;
    });
  });
  return convertedObject;
}
