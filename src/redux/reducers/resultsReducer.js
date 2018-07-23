const initialResultsState = {
  loading: false,
  geography: {},
  candidates: [],
  electionResults: [],
};

const resultsReducer = (previousState = initialResultsState, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...previousState, loading: true };
    case 'SET_STATE_DATA':
      return {
        ...previousState,
        loading: false,
        geography: action.geography,
        candidates: action.candidates,
        electionResults: action.electionResults,
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
