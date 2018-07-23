const initialStatesState = {
  states: [],
  activeStateId: '',
};

const resultsReducer = (previousState = initialStatesState, action) => {
  switch (action.type) {
    case 'SET_STATES':
      return {
        ...previousState,
        states: action.states,
      };
    case 'ACTIVE_STATE':
      return { ...previousState, activeStateId: action.stateId };
    default:
      return previousState;
  }
};

export default resultsReducer;
