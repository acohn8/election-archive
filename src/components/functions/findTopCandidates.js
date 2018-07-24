function findTopCandidates(candidateList, resultsList) {
  const statewideResults = {};
  candidateList.result.forEach((candidateId) => {
    statewideResults[candidateId] = 0;
  });
  resultsList.result.forEach((countyId) => {
    candidateList.result.forEach((candidateId) => {
      statewideResults[candidateId] += resultsList.entities.results[countyId].results[candidateId];
    });
  });
  const candidatesWithResults = Object.keys(statewideResults).filter(candidateId =>
    Boolean(statewideResults[candidateId]));
  const sortedIds = candidatesWithResults.sort((a, b) => statewideResults[b] - statewideResults[a]);
  return sortedIds;
}

export default findTopCandidates;
