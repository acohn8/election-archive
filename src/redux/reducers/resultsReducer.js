const initialResultsState = {
  loading: false,
  candidates: [],
  stateOffices: [],
  stateInfo: {},
  officeInfo: { id: 308, name: 'US President' },
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
        loading: false,
      };
    case 'START_PRECINCT_FETCH':
      return {
        ...previousState,
        precinctResults: {},
      };
    case 'SET_PRECINCTS':
      return {
        ...previousState,
        precinctResults: action.precincts,
      };
    case 'FETCHING':
      return {
        ...previousState,
        loading: true,
      };
    case 'SET_SORTED_COUNTY_RESULTS':
      return {
        ...previousState,
        countyResults: { ...previousState.countyResults, result: action.results },
      };
    case 'SET_SORTED_PRECINCT_RESULTS':
      return {
        ...previousState,
        precinctResults: { ...previousState.precinctResults, result: action.results },
      };
    case 'RESET_PRECINCT_RESULTS':
      return {
        ...previousState,
        precinctResults: {},
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
