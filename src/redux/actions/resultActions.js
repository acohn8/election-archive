import axios from 'axios';
import { normalize } from 'normalizr';

import { stateCounties, candidateListSchema } from './schema';

const fetchStateData = () => async (dispatch) => {
  dispatch({ type: 'LOADING' });
  const url = 'http://localhost:3000/api/v1';
  const response = await Promise.all([
    axios.get(`${url}/states/3/counties`),
    axios.get(`${url}/states/3/candidates`),
    axios.get(`${url}/states/3/results`),
  ]);

  const geoResponse = response[0].data;
  const resToMerge = response[2].data.results;
  resToMerge.forEach(res =>
    (geoResponse.counties.find(county => county.id === res.county_id).results = res.results[0]));
  const geography = normalize(geoResponse, stateCounties);
  const candidates = normalize(response[1].data.data, candidateListSchema);

  dispatch({
    type: 'SET_STATE_DATA',
    geography,
    candidates,
  });
};

export { fetchStateData };
