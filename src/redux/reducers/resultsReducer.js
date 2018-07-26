const initialResultsState = {
  loading: false,
  geography: {},
  candidates: [],
  electionResults: [],
  precinctResults: {},
};

const resultsReducer = (previousState = initialResultsState, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...previousState, loading: true };
    case 'RESET_PRECINCTS':
      return {
        ...previousState,
        precinctResults: {},
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
    default:
      return previousState;
  }
};

export default resultsReducer;
