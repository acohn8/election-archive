const initialStatesState = {
  allOffices: [],
  selectedOfficeId: '308',
  selectedDistrictId: null,
};

const officesReducer = (previousState = initialStatesState, action) => {
  switch (action.type) {
    case 'SET_OFFICES':
      return {
        ...previousState,
        allOffices: action.allOffices,
      };
    case 'SET_ACTIVE_OFFICE':
      return {
        ...previousState,
        selectedOfficeId: action.officeId,
        selectedDistrictId: action.districtId,
      };
    case 'SET_ACTIVE_DISTRICT':
      return {
        ...previousState,
        selectedDistrictId: action.districtId,
      };
    case 'RESET_OFFICE':
      return {
        ...previousState,
        selectedOfficeId: '308',
        selectedDistrictId: null,
      };
    default:
      return previousState;
  }
};

export default officesReducer;
