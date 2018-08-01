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
    case 'RESET_ACTIVE_STATE':
      return { ...previousState, activeStateId: '', selected: false };
    default:
      return previousState;
  }
};

export default resultsReducer;
