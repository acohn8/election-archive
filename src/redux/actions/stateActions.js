import axios from 'axios';

const fetchStatesList = () => async (dispatch) => {
  const response = await axios.get('http://localhost:3000/api/v1/states');
  dispatch({ type: 'SET_STATES', states: response.data.data });
};

const setActiveState = stateId => (dispatch) => {
  dispatch({ type: 'ACTIVE_STATE', stateId });
};

export { fetchStatesList, setActiveState };
