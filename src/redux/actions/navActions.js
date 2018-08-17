const setActive = name => (dispatch) => {
  dispatch({ type: 'SET_ACTIVE', name });
};

const setWindowWidth = windowWidth => (dispatch) => {
  dispatch({ type: 'SET_WINDOW', windowWidth });
};

export { setActive, setWindowWidth };
