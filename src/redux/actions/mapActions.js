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

const resetHover = () => ({ type: 'RESET_HOVER' });

const showHeader = () => ({ type: 'SHOW_HEADER' });
const hideHeader = () => ({ type: 'HIDE_HEADER' });

const setMapDetails = details => ({ type: 'SET_MAP_DETAILS', details });
const resetMapDetails = () => ({ type: 'RESET_MAP_DETAILS' });

export { getHoverInfo, setMapDetails, resetHover, hideHeader, showHeader, resetMapDetails };
