const initialStatesState = {
  offices: [],
  selectedOfficeId: 308,
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
    default:
      return previousState;
  }
};

export default officesReducer;
