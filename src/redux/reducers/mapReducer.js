const initialMapState = {
  overlay: {
    hoveredCounty: '',
    hoveredDem: { votes: '', percent: '' },
    hoveredRep: { votes: '', percent: '' },
  },
  mapDetails: {},
};

const resultsReducer = (previousState = initialMapState, action) => {
  switch (action.type) {
    case 'SET_HOVER':
      return {
        ...previousState,
        overlay: {
          hoveredCounty: action.countyName,
          hoveredDem: { votes: action.demVotes, percent: action.demMargin },
          hoveredRep: { votes: action.gopVotes, percent: action.gopMargin },
          isNational: action.isNational,
        },
      };
    case 'SET_MAP_DETAILS':
      return {
        ...previousState,
        mapDetails: action.details,
      };
    case 'RESET_HOVER':
      return {
        ...previousState,
        overlay: {
          hoveredCounty: '',
          hoveredDem: { votes: '', percent: '' },
          hoveredRep: { votes: '', percent: '' },
        },
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
