const initialResultsState = {
  loading: false,
  geography: {},
  candidates: [],
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
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
