const initialResultsState = {
  loading: false,
  candidates: [],
  stateOffices: [],
  stateInfo: {},
  officeInfo: { id: 308, name: 'US President' },
  stateResults: {},
  countyResults: [],
  precinctResults: {},
  fetching: false,
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
        precinctResults: {},
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
    case 'UPDATE_OFFICE_DATA':
      return {
        ...previousState,
        candidates: action.candidates,
        countyResults: action.countyResults,
        stateResults: action.stateResults,
        officeInfo: action.officeInfo,
        fetching: false,
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
    case 'FETCHING':
      return {
        ...previousState,
        fetching: true,
      };
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
        officeInfo: { id: 308, name: 'US President' },
        stateResults: {},
        countyResults: [],
        precinctResults: {},
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
