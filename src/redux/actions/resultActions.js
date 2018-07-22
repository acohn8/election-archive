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

  // merge counties with results?
  const geoToMerge = response[0].data;
  const resToMerge = response[2].data.results;
  resToMerge.forEach(res =>
    (geoToMerge.counties.find(county => county.id === res.county_id).results = res.results[0]));
  console.log(normalize(geoToMerge, stateCounties));

  const geography = normalize(response[0].data, stateCounties);
  const candidates = normalize(response[1].data.data, candidateListSchema);
  const countyResults = response[2].data;

  dispatch({
    type: 'SET_STATE_DATA',
    geography,
    candidates,
    countyResults,
  });
};

export { fetchStateData };
