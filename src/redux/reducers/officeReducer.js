const initialStatesState = {
  offices: [],
  selectedOfficeId: '308',
};

const officesReducer = (previousState = initialStatesState, action) => {
  switch (action.type) {
    case 'SET_OFFICES':
      return {
        ...previousState,
        offices: action.offices,
      };
    case 'SET_ACTIVE_OFFICE':
      return {
        ...previousState,
        selectedOfficeId: action.officeId,
      };
    case 'RESET_OFFICE':
      return {
        ...previousState,
        selectedOfficeId: 308,
      };
    default:
      return previousState;
  }
};

export default officesReducer;
