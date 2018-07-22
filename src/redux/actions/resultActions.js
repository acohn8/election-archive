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
