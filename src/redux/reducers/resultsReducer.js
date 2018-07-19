const initialResultsState = {
  loading: false,
  stateName: '',
  stateFips: '',
  electionResults: [],
};

const resultsReducer = (previousState = initialResultsState, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...previousState, loading: true };
    case 'COUNTY_RESULTS':
      return {
        ...previousState,
        loading: false,
        stateName: action.stateName,
        stateFips: action.stateFips,
        electionResults: action.electionResults,
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
