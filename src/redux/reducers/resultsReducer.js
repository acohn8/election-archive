const initialResultsState = {
  loading: false,
  officeName: 'US President',
  stateName: null,
  shortName: null,
  stateFips: null,
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
        // officeName: 'US President',
        // stateName: null,
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
        officeName: action.officeName,
        stateName: action.stateName,
        shortName: action.shortName,
        stateFips: action.stateFips,
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
        officeName: 'US President',
        shortName: null,
        stateFips: null,
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
