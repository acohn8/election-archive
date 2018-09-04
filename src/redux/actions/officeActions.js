import axios from 'axios';
import { normalize } from 'normalizr';

import { officeListSchema } from './schema';
import { updateOfficeData } from './resultActions';
import { resetHover } from './mapActions';

const fetchOfficesList = () => async (dispatch) => {
  const response = await axios.get('https://election-data-2016.herokuapp.com/api/v1/offices');
  dispatch({ type: 'SET_OFFICES', allOffices: normalize(response.data.data, officeListSchema) });
};

const setActiveOffice = (officeId, districtId = null) => (dispatch) => {
  dispatch({ type: 'SET_ACTIVE_OFFICE', officeId: officeId.toString(), districtId });
};

const updateOffices = (officeId, districtName = null) => (dispatch) => {
  dispatch(setActiveOffice(officeId, districtName));
  dispatch(resetHover());
  dispatch(updateOfficeData(officeId, districtName));
};

const setActiveDistrict = districtId => dispatch =>
  dispatch({ type: 'SET_ACTIVE_DISTRICT', districtId });

const resetOffice = () => dispatch => dispatch({ type: 'RESET_OFFICE' });

export { fetchOfficesList, setActiveOffice, resetOffice, setActiveDistrict, updateOffices };
