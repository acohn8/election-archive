const initialResultsState = {
  loading: false,
  candidates: [],
  stateOffices: [],
  stateInfo: {},
  officeInfo: {},
  topTwo: [],
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
        candidates: [],
        stateOffices: [],
        stateResults: {},
        countyResults: [],
        topTwo: [],
        precinctResults: {},
        officeInfo: {},
        stateInfo: {},
      };
    case 'SET_STATE_DATA':
      return {
        ...previousState,
        loading: false,
        candidates: action.candidates,
        stateResults: action.stateResults,
        stateOffices: action.stateOffices,
        officeInfo: action.officeInfo,
        countyResults: action.countyResults,
        stateInfo: action.stateInfo,
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
    case 'SET_TOP_TWO':
      return { ...previousState, topTwo: action.candidates };
    case 'RESET_TOP_TWO':
      return { ...previousState, topTwo: [] };
    case 'SET_SORTED_COUNTY_RESULTS':
      return {
        ...previousState,
        countyResults: { ...previousState.countyResults, result: action.results },
      };
    case 'RESET_RESULTS':
      return {
        loading: false,
        candidates: [],
        stateOffices: [],
        stateInfo: {},
        officeInfo: {},
        topTwo: [],
        stateResults: {},
        countyResults: [],
        precinctResults: {},
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
