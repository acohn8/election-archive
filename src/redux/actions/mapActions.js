const getHoverInfo = (
  geographyName,
  demMargin,
  demVotes,
  gopMargin,
  gopVotes,
  isNational = false,
) => dispatch =>
  dispatch({
    type: 'SET_HOVER',
    geographyName,
    demMargin,
    demVotes,
    gopMargin,
    gopVotes,
    isNational,
  });

const resetHover = () => dispatch => dispatch({ type: 'RESET_HOVER' });

const setMapDetails = details => dispatch => dispatch({ type: 'SET_MAP_DETAILS', details });

export { getHoverInfo, setMapDetails, resetHover };
