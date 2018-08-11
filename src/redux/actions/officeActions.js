import axios from 'axios';

import { fetchStateData } from './resultActions';

const fetchOfficesList = () => async (dispatch) => {
  const response = await axios.get('http://localhost:3000/api/v1/offices');
  dispatch({ type: 'SET_OFFICES', offices: response.data.data });
};

const fetchStateOffices = () => async (dispatch, getState) => {
  const response = await axios.get(`http://localhost:3000/api/v1/states/${getState().states.activeStateId}/offices`);
  console.log(getState().states.activeStateId);
  dispatch({ type: 'SET_OFFICES', offices: response.data.data });
};

const setActiveOffice = officeId => async (dispatch, getState) => {
  dispatch({ type: 'SET_ACTIVE_OFFICE', officeId });
  dispatch(fetchStateData(getState().states.activeStateId));
};

export { fetchOfficesList, setActiveOffice, fetchStateOffices };
