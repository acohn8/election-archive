import axios from 'axios';
import { push } from 'connected-react-router';

import { fetchStateData, resetResults } from './resultActions';
import { fetchStateOffices } from './officeActions';
import { resetHover } from './mapActions';

const fetchStatesList = () => async (dispatch) => {
  const response = await axios.get('http://localhost:3000/api/v1/states');
  dispatch({ type: 'SET_STATES', states: response.data.data });
};

const setActiveState = (stateId, fetch = true) => (dispatch, getState) => {
  dispatch({ type: 'ACTIVE_STATE', stateId });
  dispatch(resetHover());
  dispatch(fetchStateOffices(stateId));
  if (!fetch) {
    dispatch(push(`/states/${getState()
      .states.states.find(state => state.id === stateId)
      .attributes.name.split(' ')
      .join('-')
      .toLowerCase()}`));
  }
  if (fetch) {
    dispatch(fetchStateData(stateId));
  }
};

const resetActiveState = () => (dispatch) => {
  dispatch({ type: 'RESET_ACTIVE_STATE' });
  dispatch(resetResults());
  dispatch(resetHover());
};

export { fetchStatesList, setActiveState, resetActiveState };
