import store from '../redux/store';

const formatTableData = () => {
  const formattedResults = [];
  const candidates = store.getState().results.candidates.entities.candidates;
  const candidateIds = store.getState().results.candidates.result;
  const allCountyResults = store.getState().results.countyResults.result.map(countyId => ({
    id: countyId,
    name: store.getState().results.countyResults.entities.results[countyId].name,
  }));
  allCountyResults.forEach((result) => {
    const countyInfo = {};
    const countyResults = store.getState().results.countyResults.entities.results[result.id]
      .results;
    const winnerParty = getCountyWinner(countyResults);
    countyInfo.id = result.id;
    countyInfo.name = result.name;
    countyInfo.winnerParty = winnerParty;
    countyInfo.results = {};
    candidateIds.forEach((candidateId) => {
      countyInfo.results[candidateId] = {};
      countyInfo.results[candidateId].name = candidates[candidateId].name;
      countyInfo.results[candidateId].party = candidates[candidateId].party;
      countyInfo.results[candidateId].total = countyResults[candidateId];
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
