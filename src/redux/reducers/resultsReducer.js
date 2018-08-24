const initialResultsState = {
  loading: false,
  name: 'US President',
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
        name: 'US President',
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
        name: action.name,
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
        name: 'US President',
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
