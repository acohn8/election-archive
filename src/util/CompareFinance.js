import store from '../redux/store';

const colors = {
  democratic: 'rgba(32,133,208,.2)',
  republican: 'rgba(219,40,40,.2)',
  libertarian: 'rgba(251,189,9, .2)',
  other: 'rgba(100,53,201, .2)',
};

function getFinanceCellColor(candidateId, metric) {
  const { candidates } = store.getState().results.candidates.entities;
  const filteredCandidates = store
    .getState()
    .results.candidates.result.filter(id => id !== 'other' && candidates[id].finance_data);
  const filtedFinanceInfo = filteredCandidates.map(id => ({
    id,
    total: candidates[id].finance_data[metric],
  }));
  const topCandidate = filtedFinanceInfo.sort((a, b) => b.total - a.total)[0];
  return topCandidate.id === candidateId ? colors[candidates[candidateId].party] : null;
}
export default getFinanceCellColor;
