import axios from 'axios';
import { push } from 'connected-react-router';

import { fetchStateData, resetResults } from './resultActions';
import { fetchStateOffices } from './officeActions';
import { resetHover } from './mapActions';

const fetchStatesList = () => async (dispatch) => {
  const response = await axios.get('http://localhost:3000/api/v1/states');
  dispatch({ type: 'SET_STATES', states: response.data.data });
};

const setActiveState = stateId => (dispatch) => {
  dispatch(setStateId(stateId));
  dispatch(resetHover());
  dispatch(fetchStateOffices(stateId));
  dispatch(fetchStateData(stateId));
};

const setStateId = stateId => dispatch => dispatch({ type: 'ACTIVE_STATE', stateId });

const pushToNewState = stateId => (dispatch, getState) =>
  dispatch(push(`/states/${getState()
    .states.states.find(state => state.id === stateId)
    .attributes.name.split(' ')
    .join('-')
    .toLowerCase()}`));

const resetActiveState = () => (dispatch) => {
  dispatch({ type: 'RESET_ACTIVE_STATE' });
  dispatch(resetResults());
  dispatch(resetHover());
};

export { fetchStatesList, setActiveState, resetActiveState, pushToNewState, setStateId };
