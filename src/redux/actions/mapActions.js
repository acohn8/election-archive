const getHoverInfo = (countyName, demMargin, demVotes, gopMargin, gopVotes) => dispatch =>
  dispatch({
    type: 'SET_HOVER',
    countyName,
    demMargin,
    demVotes,
    gopMargin,
    gopVotes,
  });

export default getHoverInfo;
