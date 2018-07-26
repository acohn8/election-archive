const initialResultsState = {
  loading: false,
  geography: {},
  candidates: [],
  electionResults: [],
  precinctResults: {},
  boundingBox: [],
};

const resultsReducer = (previousState = initialResultsState, action) => {
  switch (action.type) {
    case 'START_FETCH':
      return {
        ...previousState,
        loading: true,
        geography: {},
        candidates: [],
        electionResults: [],
        precinctResults: {},
        boundingBox: [],
      };
    case 'SET_STATE_DATA':
      return {
        ...previousState,
        loading: false,
        geography: action.geography,
        candidates: action.candidates,
        electionResults: action.electionResults,
      };
    case 'SET_PRECINCTS':
      return {
        ...previousState,
        precinctResults: { county_id: action.county, precincts: action.precincts },
      };
    case 'SET_STATE_BOUNDS':
      return {
        ...previousState,
        boundingBox: action.bounds,
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
