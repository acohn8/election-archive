import store from '../../redux/store';

const formatTableData = () => {
  const allCountyResults = store.getState().results.countyResults.result.map(county_id => ({
    id: county_id,
    name: store.getState().results.countyResults.entities.results[county_id].name,
  }));
  allCountyResults.forEach((result) => {
    const countyResults = store.getState().results.countyResults.entities.results[result.id]
      .results;
    const countyTotal = Object.values(countyResults).reduce((sum, n) => sum + n);

    const countyWinnerParty = getCountyWinner(countyResults);
    const firstVotes = countyResults[store.getState().results.topTwo[0]];
    const secondVotes = countyResults[store.getState().results.topTwo[1]];
    const otherVotes = countyTotal - (firstVotes + secondVotes);

    const firstPlace = store.getState().results.candidates.entities.candidates[
      store.getState().results.topTwo[0]
    ];
    const secondPlace = store.getState().results.candidates.entities.candidates[
      store.getState().results.topTwo[1]
    ];

    result.winnerParty = countyWinnerParty;
    result.first = {};
    result.first.id = store.getState().results.topTwo[0];
    result.first.name = firstPlace.name;
    result.first.party = firstPlace.party;
    result.first.total = firstVotes;
    result.second = {};
    if (secondVotes > 0) {
      result.second.id = store.getState().results.topTwo[1];
      result.second.name = secondPlace.name;
      result.second.party = secondPlace.party;
      result.second.total = secondVotes;
    }
    if (otherVotes > 0) {
      result.other = {};
      result.other.id = 'other';
      result.other.name = 'Other';
      result.other.party = null;
      result.other.total = otherVotes;
    }
  });
  return allCountyResults;
};

const getCountyWinner = (countyResults) => {
  const winner = Object.keys(countyResults).sort((a, b) => countyResults[b] - countyResults[a])[0];
  return store.getState().results.candidates.entities.candidates[winner].party;
};

export default formatTableData;
