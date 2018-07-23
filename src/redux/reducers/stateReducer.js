const initialStatesState = {
  states: [],
};

const resultsReducer = (previousState = initialStatesState, action) => {
  switch (action.type) {
    case 'SET_STATES':
      return {
        ...previousState,
        states: action.states,
      };
    default:
      return previousState;
  }
};

export default resultsReducer;
