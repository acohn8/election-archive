import axios from 'axios';

const fetchCountyDetails = countyId => async (dispatch, getState) => {
  const response = await axios.get(`http://localhost:3000/api/v1/states/${getState().states.activeStateId}/counties/${countyId}`);
  const {
    id, details, name, latitude, longitude, fips,
  } = response.data;
  dispatch({
    type: 'SET_COUNTY_INFO',
    id,
    details,
    name,
    latitude,
    longitude,
    fips,
  });
};

const resetCountyDetails = () => dispatch => dispatch({ type: 'RESET_COUNTY_INFO' });

export { fetchCountyDetails, resetCountyDetails };
