const initialResultsState = {
  stateName: '',
  stateFips: '',
  electionResults: [],
};

const resultsReducer = (previousState = initialResultsState, action) => {
  switch (action.type) {
    case 'COUNTY_RESULTS':
      return {
        ...previousState,
        stateName: action.stateName,
        stateFips: action.stateFips,
        electionResults: action.electionResults,
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
