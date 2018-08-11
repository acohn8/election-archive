import axios from 'axios';

const fetchPrecinctData = countyId => async (dispatch, getState) => {
  console.log(getState().offices.selectedOfficeId);
  const url = 'http://localhost:3000/api/v1';
  dispatch({ type: 'START_PRECINCT_FETCH' });
  const fetchedPrecincts = await axios.get(`${url}/states/${getState().states.activeStateId}/offices/${
    getState().offices.selectedOfficeId
  }/results/precinct/${countyId}`);
  const precincts = fetchedPrecincts.data.results;
  dispatch({ type: 'SET_PRECINCTS', county: countyId, precincts });
};

export { fetchPrecinctData };
