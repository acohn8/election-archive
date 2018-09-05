import store from '../redux/store';

const formatTableData = () => {
  const formattedResults = [];
  const candidates = store.getState().results.candidates.entities.candidates;
  const resultEntities = store.getState().results.countyResults.entities.results;

  const candidateIds = store.getState().results.candidates.result.slice();
  const allCountyResults = store
    .getState()
    .results.countyResults.result.slice()
    .map(countyId => ({
      id: countyId,
      name: resultEntities[countyId].name.replace(/County/g, ''),
    }));
  allCountyResults.forEach((result) => {
    const countyInfo = {};
    const countyResults = resultEntities[result.id].results;
    const winnerParty = getCountyWinner(countyResults);
    const countyTotal = Object.values(countyResults).reduce((sum, n) => sum + n);
    countyInfo.id = result.id;
    countyInfo.name = result.name;
    countyInfo.winnerParty = winnerParty;
    countyInfo.results = {};
    candidateIds.forEach((candidateId) => {
      countyInfo.results[candidateId] = {};
      countyInfo.results[candidateId].name = candidates[candidateId].name;
      countyInfo.results[candidateId].party = candidates[candidateId].party;
      countyInfo.results[candidateId].total = countyResults[candidateId];
      countyInfo.results[candidateId].percent = countyResults[candidateId] / countyTotal;
    });
    formattedResults.push(countyInfo);
  });
  return formattedResults;
};

const getCountyWinner = (countyResults) => {
  const winner = Object.keys(countyResults).sort((a, b) => countyResults[b] - countyResults[a])[0];
  return store.getState().results.candidates.entities.candidates[winner].party;
};

export default formatTableData;
