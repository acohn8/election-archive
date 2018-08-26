const initialStatesState = {
  allOffices: [],
  stateOffices: [],
  selectedOfficeId: 308,
  selectedDistrictId: null,
};

const officesReducer = (previousState = initialStatesState, action) => {
  switch (action.type) {
    case 'SET_OFFICES':
      return {
        ...previousState,
        allOffices: action.allOffices,
      };
    case 'SET_STATE_OFFICES':
      return {
        ...previousState,
        stateOffices: action.stateOffices,
      };
    case 'SET_ACTIVE_OFFICE':
      return {
        ...previousState,
        selectedOfficeId: action.officeId,
        selectedDistrictId: action.districtId,
      };
    case 'RESET_OFFICE':
      return {
        ...previousState,
        stateOffices: [],
        selectedOfficeId: '308',
        selectedDistrictId: null,
      };
    default:
      return previousState;
  }
};

export default officesReducer;
