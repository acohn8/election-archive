import axios from 'axios';
import { normalize } from 'normalizr';

import { stateCounties, candidateListSchema, resultListSchema } from './schema';

const fetchStateData = stateId => async (dispatch, getState) => {
  const url = 'http://localhost:3000/api/v1';
  dispatch({ type: 'START_FETCH' });
  const response = await Promise.all([
    axios.get(`${url}/states/${stateId}/counties`),
    axios.get(`${url}/states/${stateId}/offices/${getState().offices.selectedOfficeId}/candidates`),
    axios.get(`${url}/states/${stateId}/offices/${getState().offices.selectedOfficeId}/results/county`),
    axios.get(`${url}/states/${stateId}/offices/${getState().offices.selectedOfficeId}/results/state`),
    axios.get(`${url}/states/${stateId}/offices/${getState().offices.selectedOfficeId}/results/state`),
    // axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&generator=images&titles=United+States+Senate+election+in+${getState().states.states[activeStateId].attributes.name}%2C+2016&format=json`),
  ]);

  const geography = normalize(response[0].data, stateCounties);
  const countyResults = normalize(response[2].data.results, resultListSchema);
  const stateResults = response[3].data.results;
  const candidates = normalize(response[1].data.data, candidateListSchema);

  dispatch({
    type: 'SET_STATE_DATA',
    geography,
    candidates,
    countyResults,
    stateResults,
  });
};

const resetResults = () => ({ type: 'RESET_RESULTS' });

export { fetchStateData, resetResults };
