import axios from 'axios';
import { normalize } from 'normalizr';

import { officeListSchema } from './schema';

const fetchOfficesList = () => async (dispatch) => {
  const response = await axios.get('https://election-data-2016.herokuapp.com/api/v1/offices');
  dispatch({ type: 'SET_OFFICES', allOffices: normalize(response.data.data, officeListSchema) });
};

const fetchStateOffices = stateId => async (dispatch) => {
  const response = await axios.get(`https://election-data-2016.herokuapp.com/api/v1/states/${stateId}/offices`);
  dispatch({ type: 'SET_STATE_OFFICES', stateOffices: normalize(response.data, officeListSchema) });
};

const setActiveOffice = (officeId, districtId) => dispatch =>
  dispatch({ type: 'SET_ACTIVE_OFFICE', officeId: officeId.toString(), districtId });
const setActiveDistrict = districtId => dispatch =>
  dispatch({ type: 'SET_ACTIVE_DISTRICT', districtId });
const resetOffice = () => dispatch => dispatch({ type: 'RESET_OFFICE' });

export { fetchOfficesList, setActiveOffice, fetchStateOffices, resetOffice, setActiveDistrict };
