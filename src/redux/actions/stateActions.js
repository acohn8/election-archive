import axios from 'axios';
import { push } from 'connected-react-router';

import { fetchStateData, resetResults } from './resultActions';
import { resetHover } from './mapActions';

const fetchStatesList = () => async (dispatch) => {
  const response = await axios.get('https://election-data-2016.herokuapp.com/api/v1/states');
  dispatch({ type: 'SET_STATES', states: response.data.data });
};

const setActiveState = stateId => (dispatch) => {
  dispatch({ type: 'ACTIVE_STATE', stateId });
  dispatch(resetHover());
  dispatch(fetchStateData(stateId));
  dispatch(push(`/states/${stateId}`));
};

const resetActiveState = () => (dispatch) => {
  dispatch({ type: 'RESET_ACTIVE_STATE' });
  dispatch(resetResults());
};

export { fetchStatesList, setActiveState, resetActiveState };
