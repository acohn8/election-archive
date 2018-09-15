const resultTotals = (data, total) => {
  const candidates = Object.keys(data[0].results);
  const totals = {};
  candidates.forEach((candidate) => {
    const candidateResults = data.map(subGeo => subGeo.results[candidate]);
    const voteTotal = candidateResults.map(result => result.total).reduce((sum, n) => sum + n);
    totals[candidate] = {};
    totals[candidate].votes = voteTotal;
    totals[candidate].percent = voteTotal / total;
  });
  return totals;
};

export default resultTotals;
