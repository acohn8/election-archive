import axios from 'axios';

import { fetchStateData } from './resultActions';

const fetchStatesList = () => async (dispatch) => {
  const response = await axios.get('https://election-data-2016.herokuapp.com/api/v1');
  dispatch({ type: 'SET_STATES', states: response.data.data });
};

const setActiveState = stateId => (dispatch) => {
  dispatch({ type: 'ACTIVE_STATE', stateId });
  dispatch(fetchStateData(stateId));
};

export { fetchStatesList, setActiveState };
