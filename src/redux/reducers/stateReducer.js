const initialStatesState = {
  states: [],
  activeStateId: null,
};

const statesReducer = (previousState = initialStatesState, action) => {
  switch (action.type) {
    case 'SET_STATES':
      return {
        ...previousState,
        states: action.states,
      };
    case 'ACTIVE_STATE':
      return { ...previousState, activeStateId: action.stateId };
    case 'RESET_ACTIVE_STATE':
      return { ...previousState, activeStateId: null };
    default:
      return previousState;
  }
};

export default statesReducer;
