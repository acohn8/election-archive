const getHoverInfo = (
  geographyName,
  winnerName,
  winnerParty,
  winnerMargin,
  winnerVotes,
  secondName,
  secondParty,
  secondMargin,
  secondVotes,
  isNational = false,
) => dispatch =>
  dispatch({
    type: 'SET_HOVER',
    geographyName,
    winnerName,
    winnerParty,
    winnerMargin,
    winnerVotes,
    secondName,
    secondParty,
    secondMargin,
    secondVotes,
    isNational,
  });

const resetHover = () => ({ type: 'RESET_HOVER' });

const showHeader = () => ({ type: 'SHOW_HEADER' });
const hideHeader = () => ({ type: 'HIDE_HEADER' });

const setMapDetails = details => ({ type: 'SET_MAP_DETAILS', details });
const resetMapDetails = () => ({ type: 'RESET_MAP_DETAILS' });

const addLayer = layer => dispatch => dispatch({ type: 'ADD_LAYER', layer });
const addSource = source => dispatch => dispatch({ type: 'ADD_SOURCE', source });
const resetMapData = () => dispatch => dispatch({ type: 'RESET_MAP_DATA' });

export {
  addLayer,
  addSource,
  resetMapData,
  getHoverInfo,
  setMapDetails,
  resetHover,
  hideHeader,
  showHeader,
  resetMapDetails,
};
