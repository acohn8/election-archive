import store from '../redux/store';

const formatTableData = (type) => {
  const formattedResults = [];
  const candidates = store.getState().results.candidates.entities.candidates;
  const resultEntities = store.getState().results[type].entities.results;

  const candidateIds = store.getState().results.candidates.result.slice();
  const allGeographyResults = store
    .getState()
    .results[type].result.slice()
    .map(geoId => ({
      id: geoId,
      name: resultEntities[geoId].name.replace(/County/g, ''),
    }));
  allGeographyResults.forEach((result) => {
    const geoInfo = {};
    const geoResults = resultEntities[result.id].results;
    const winnerParty = getWinner(geoResults);
    const geoTotal = Object.values(geoResults).reduce((sum, n) => sum + n);
    geoInfo.id = result.id;
    geoInfo.name = result.name;
    geoInfo.winnerParty = winnerParty;
    geoInfo.results = {};
    candidateIds.forEach((candidateId) => {
      geoInfo.results[candidateId] = {};
      geoInfo.results[candidateId].name = candidates[candidateId].name;
      geoInfo.results[candidateId].party = candidates[candidateId].party;
      geoInfo.results[candidateId].total = geoResults[candidateId];
      geoInfo.results[candidateId].percent = geoResults[candidateId] / geoTotal;
    });
    formattedResults.push(geoInfo);
  });
  return formattedResults;
};

const getWinner = (results) => {
  const winner = Object.keys(results).sort((a, b) => results[b] - results[a])[0];
  if (winner === 'other') {
    return 'Other';
  } else if (store.getState().results.candidates.entities.candidates[winner] !== undefined) {
    return store.getState().results.candidates.entities.candidates[winner].party;
  }
  return 'Other';
};

export default formatTableData;
