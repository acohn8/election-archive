const resultTotals = (data, total) => {
  const candidates = Object.keys(data[0].results);
  const totals = {};
  candidates.forEach((candidate) => {
    const candidateResults = data
      .map(subGeo => subGeo.results[candidate])
      .filter(geo => geo.total !== undefined);
    const voteTotal = candidateResults.map(result => result.total).reduce((sum, n) => sum + n);
    totals[candidate] = {};
    totals[candidate].votes = voteTotal;
    totals[candidate].percent = voteTotal / total;
  });
  const totalsWithWinner = getWinner(totals);
  return totalsWithWinner;
};

const getWinner = (results) => {
  const candidates = Object.keys(results);
  const winner = candidates.sort((a, b) => results[b].votes - results[a].votes)[0];
  candidates.forEach((candidate) => {
    const isWinner = candidate === winner;
    results[candidate].winner = isWinner;
  });
  return results;
};

export default resultTotals;
