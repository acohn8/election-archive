import axios from 'axios';

const fetchCountyDetails = countyId => async (dispatch, getState) => {
  const response = await axios.get(`localhost:3000/api/v1/states/${getState().states.activeStateId}/counties/${countyId}`);
  dispatch({ type: 'SET_STATES', states: response.data.data });
};

export default fetchCountyDetails;
