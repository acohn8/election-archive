const initialStatesState = {
  allOffices: [],
  stateOffices: [],
  selectedOfficeId: '308',
};

const officesReducer = (previousState = initialStatesState, action) => {
  switch (action.type) {
    case 'SET_OFFICES':
      return {
        ...previousState,
        allOffices: action.allOffices,
      };
    case 'SET_STATE_OFFICES':
      console.log(action.stateOffices);
      return {
        ...previousState,
        stateOffices: action.stateOffices,
      };
    case 'SET_ACTIVE_OFFICE':
      return {
        ...previousState,
        selectedOfficeId: action.officeId,
      };
    case 'RESET_OFFICE':
      return {
        ...previousState,
        selectedOfficeId: '308',
      };
    default:
      return previousState;
  }
};

export default officesReducer;
