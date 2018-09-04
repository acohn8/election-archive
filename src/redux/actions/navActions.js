const setActive = name => (dispatch) => {
  dispatch({ type: 'SET_ACTIVE', name });
};

export { setActive };
