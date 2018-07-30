const getHoverInfo = (countyName, demMargin, demVotes, gopMargin, gopVotes) => dispatch =>
  dispatch({
    type: 'SET_HOVER',
    countyName,
    demMargin,
    demVotes,
    gopMargin,
    gopVotes,
  });

const setMapDetails = details => (dispatch) => {
  dispatch({ type: 'SET_MAP_DETAILS', details });
};

export { getHoverInfo, setMapDetails };
