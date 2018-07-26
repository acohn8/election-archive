const initialResultsState = {
  loading: false,
  geography: {},
  candidates: [],
  electionResults: [],
  precinctResults: {},
  mapDetails: {},
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
        mapDetails: {},
      };
    case 'SET_STATE_DATA':
      return {
        ...previousState,
        loading: false,
        geography: action.geography,
        candidates: action.candidates,
        electionResults: action.electionResults,
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
    case 'SET_MAP_DETAILS':
      return {
        ...previousState,
        mapDetails: action.details,
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
