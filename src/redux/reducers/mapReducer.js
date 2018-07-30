const initialMapState = {
  overlay: {
    hoveredCounty: '',
    hoveredDem: { votes: '', percent: '' },
    hoveredRep: { votes: '', percent: '' },
  },
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
        },
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
