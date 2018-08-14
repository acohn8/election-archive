const initialResultsState = {
  loading: false,
  geography: {},
  candidates: [],
  stateResults: {},
  countyResults: [],
  precinctResults: {},
};

const resultsReducer = (previousState = initialResultsState, action) => {
  switch (action.type) {
    case 'START_FETCH':
      return {
        ...previousState,
        loading: true,
        geography: {},
        candidates: [],
        stateResults: {},
        countyResults: [],
        precinctResults: {},
      };
    case 'SET_STATE_DATA':
      return {
        ...previousState,
        loading: false,
        geography: action.geography,
        candidates: action.candidates,
        stateResults: action.stateResults,
        countyResults: action.countyResults,
      };
    case 'START_PRECINCT_FETCH':
      return {
        ...previousState,
        precinctResults: {},
      };
    case 'SET_PRECINCTS':
      return {
        ...previousState,
        precinctResults: { county_id: action.county, precincts: action.precincts },
      };
    case 'RESET_RESULTS':
      return {
        loading: false,
        geography: {},
        candidates: [],
        stateResults: {},
        countyResults: [],
        precinctResults: {},
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
