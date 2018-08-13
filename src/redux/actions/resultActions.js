import axios from 'axios';
import { normalize } from 'normalizr';

import { stateCounties, candidateListSchema, resultListSchema } from './schema';

const fetchStateData = stateId => async (dispatch, getState) => {
  console.log(stateId);
  const url = 'http://localhost:3000/api/v1';
  dispatch({ type: 'START_FETCH' });
  const response = await Promise.all([
    axios.get(`${url}/states/${stateId}/counties`),
    axios.get(`${url}/states/${stateId}/offices/${getState().offices.selectedOfficeId}/candidates`),
    axios.get(`${url}/states/${stateId}/offices/${getState().offices.selectedOfficeId}/results/county`),
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

const resetResults = () => ({ type: 'RESET_RESULTS' });

export { fetchStateData, resetResults };
