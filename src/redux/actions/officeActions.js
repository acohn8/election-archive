import axios from 'axios';
import { normalize } from 'normalizr';

import { fetchStateData } from './resultActions';
import { officeListSchema } from './schema';

const fetchOfficesList = () => async (dispatch) => {
  const response = await axios.get('http://localhost:3000/api/v1/offices');
  console.log(normalize(response.data.data, officeListSchema));
  dispatch({ type: 'SET_OFFICES', allOffices: response.data.data });
};

const fetchStateOffices = stateId => async (dispatch) => {
  const response = await axios.get(`http://localhost:3000/api/v1/states/${stateId}/offices`);
  console.log(normalize(response.data, officeListSchema));
  dispatch({ type: 'SET_STATE_OFFICES', stateOffices: response.data });
};

const setActiveOffice = (officeId = '308', districtId = null) => async (dispatch, getState) => {
  dispatch({ type: 'SET_ACTIVE_OFFICE', officeId: officeId.toString(), districtId });
  if (getState().states.activeStateId && districtId) {
    dispatch(fetchStateData(getState().states.activeStateId, districtId));
  } else if (getState().states.activeStateId) {
    dispatch(fetchStateData(getState().states.activeStateId));
  }
};

const resetOffice = () => dispatch => dispatch({ type: 'RESET_OFFICE' });

export { fetchOfficesList, setActiveOffice, fetchStateOffices, resetOffice };
