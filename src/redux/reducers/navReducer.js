const initialNavState = {
  activePage: '',
};

const navReducer = (previousState = initialNavState, action) => {
  switch (action.type) {
    case 'SET_ACTIVE':
      return {
        ...previousState,
        activePage: action.name,
      };
    default:
      return previousState;
  }
};

export default navReducer;
