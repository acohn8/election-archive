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
    default:
      return previousState;
  }
};

export default officesReducer;
