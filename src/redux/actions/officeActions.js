import axios from 'axios';
import { normalize } from 'normalizr';

import { fetchStateData } from './resultActions';
import { officeListSchema } from './schema';

const fetchOfficesList = () => async (dispatch) => {
  const response = await axios.get('http://localhost:3000/api/v1/offices');
  dispatch({ type: 'SET_OFFICES', allOffices: normalize(response.data.data, officeListSchema) });
};

const fetchStateOffices = stateId => async (dispatch) => {
  const response = await axios.get(`http://localhost:3000/api/v1/states/${stateId}/offices`);
  dispatch({ type: 'SET_STATE_OFFICES', stateOffices: normalize(response.data, officeListSchema) });
};

const setActiveOffice = (officeId = 308, districtId = null, stateId = null) => async (
  dispatch,
  getState,
) => {
  dispatch({ type: 'SET_ACTIVE_OFFICE', officeId, districtId });
  let state;
  if (stateId === null) {
    state = getState().states.activeStateId;
  } else {
    state = stateId;
  }
  if (getState().states.activeStateId && districtId) {
    dispatch(fetchStateData(state, districtId));
  } else if (getState().states.activeStateId) {
    dispatch(fetchStateData(state));
  }
};

const resetOffice = () => dispatch => dispatch({ type: 'RESET_OFFICE' });

export { fetchOfficesList, setActiveOffice, fetchStateOffices, resetOffice };
