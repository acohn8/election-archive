import axios from 'axios';
import { normalize } from 'normalizr';

import { stateCounties, candidateListSchema, resultListSchema } from './schema';

const fetchStateData = stateId => async (dispatch) => {
  dispatch({ type: 'LOADING' });
  const url = 'https://election-data-2016.herokuapp.com';
  const response = await Promise.all([
    axios.get(`${url}/states/${stateId}/counties`),
    axios.get(`${url}/states/${stateId}/candidates`),
    axios.get(`${url}/states/${stateId}/results`),
  ]);

  const geography = normalize(response[0].data, stateCounties);
  const electionResults = normalize(response[2].data.results, resultListSchema);
  const candidates = normalize(response[1].data.data, candidateListSchema);

  dispatch({
    type: 'SET_STATE_DATA',
    geography,
    candidates,
    electionResults,
  });
};

export { fetchStateData };
