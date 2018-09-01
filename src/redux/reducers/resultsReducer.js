const initialResultsState = {
  loading: false,
  officeName: 'US President',
  stateName: null,
  shortName: null,
  stateFips: null,
  counties: {},
  candidates: [],
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
        counties: {},
        candidates: [],
        stateResults: {},
        countyResults: [],
        topTwo: [],
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
        counties: action.counties,
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
    case 'SET_TOP_TWO':
      console.log(action.candidates);
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
        officeName: 'US President',
        shortName: null,
        stateFips: null,
        counties: {},
        candidates: [],
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
