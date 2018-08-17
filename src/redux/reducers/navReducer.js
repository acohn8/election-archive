const initialNavState = {
  activePage: '',
  windowWidth: '',
};

const navReducer = (previousState = initialNavState, action) => {
  switch (action.type) {
    case 'SET_ACTIVE':
      return {
        ...previousState,
        activePage: action.name,
      };
    case 'SET_WINDOW':
      return {
        ...previousState,
        windowWidth: action.windowWidth,
      };
    default:
      return previousState;
  }
};

export default navReducer;
