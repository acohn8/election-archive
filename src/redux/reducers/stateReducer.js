const initialStatesState = {
  states: [],
  stateInfo: null,
  activeStateId: null,
};

const resultsReducer = (previousState = initialStatesState, action) => {
  switch (action.type) {
    case 'SET_STATES':
      return {
        ...previousState,
        states: action.states,
      };
    case 'STATE_DATA':
      return { ...previousState, stateInfo: action.stateInfo };
    case 'ACTIVE_STATE':
      return { ...previousState, activeStateId: action.stateId };
    case 'RESET_ACTIVE_STATE':
      return { ...previousState, activeStateId: null, stateInfo: null };
    default:
      return previousState;
  }
};

export default resultsReducer;
