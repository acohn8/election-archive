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
  layer,
  isNational,
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
    layer,
    isNational,
  });

const resetHover = () => ({ type: 'RESET_HOVER' });

const showHeader = () => ({ type: 'SHOW_HEADER' });
const hideHeader = () => ({ type: 'HIDE_HEADER' });

const addLayer = layer => dispatch => dispatch({ type: 'ADD_LAYER', layer });
const removeLayer = layer => (dispatch, getState) =>
  dispatch({ type: 'REMOVE_LAYER', layer: getState().maps.layers.indexOf(layer) });
const removeSource = source => (dispatch, getState) =>
  dispatch({ type: 'REMOVE_SOURCE', source: getState().maps.sources.indexOf(source) });
const addSource = source => dispatch => dispatch({ type: 'ADD_SOURCE', source });
const resetMapData = () => dispatch => dispatch({ type: 'RESET_MAP_DATA' });

export {
  addLayer,
  addSource,
  removeSource,
  removeLayer,
  resetMapData,
  getHoverInfo,
  resetHover,
  hideHeader,
  showHeader,
};
