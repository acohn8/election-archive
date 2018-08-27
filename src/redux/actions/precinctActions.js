import axios from 'axios';

const fetchPrecinctData = countyId => async (dispatch, getState) => {
  const url = 'https://election-data-2016.herokuapp.com/api/v1';
  dispatch({ type: 'START_PRECINCT_FETCH' });
  const fetchedPrecincts = await axios.get(`${url}/states/${getState().states.activeStateId}/offices/${
    getState().offices.selectedOfficeId
  }/results/precinct/${countyId}`);
  const precincts = fetchedPrecincts.data.results;
  dispatch({ type: 'SET_PRECINCTS', county: countyId, precincts });
};

export { fetchPrecinctData };
