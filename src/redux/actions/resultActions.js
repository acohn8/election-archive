import axios from 'axios';
import { normalize } from 'normalizr';

import { stateCounties, candidateListSchema, resultListSchema } from './schema';

const fetchStateData = (stateId, districtId = null) => async (dispatch, getState) => {
  const url = 'http://localhost:3000/api/v1';
  dispatch({ type: 'START_FETCH' });
  let officeTotal;
  let subgeography;

  if (!districtId) {
    officeTotal = `states/${stateId}/offices/${getState().offices.selectedOfficeId}/results/state`;
    subgeography = `states/${stateId}/offices/${
      getState().offices.selectedOfficeId
    }/results/county`;
  }

  if (districtId) {
    officeTotal = `states/${stateId}/offices/${
      getState().offices.selectedOfficeId
    }/results/district/${districtId}`;
    subgeography = `states/${stateId}/offices/${
      getState().offices.selectedOfficeId
    }/results/district/${districtId}/county`;
  }

  const response = await Promise.all([
    axios.get(`${url}/states/${stateId}/counties`),
    axios.get(`${url}/states/${stateId}/offices/${getState().offices.selectedOfficeId}/candidates`),
    axios.get(`${url}/${subgeography}`),
    axios.get(`${url}/${officeTotal}`),
  ]);

  const geography = normalize(response[0].data, stateCounties);
  const countyResults = normalize(response[2].data.results, resultListSchema);
  const stateResults = response[3].data.results;
  const name = response[3].data.name;
  const candidates = normalize(response[1].data.data, candidateListSchema);
  dispatch({
    type: 'SET_STATE_DATA',
    geography,
    name,
    candidates,
    countyResults,
    stateResults,
  });
};

const resetResults = () => ({ type: 'RESET_RESULTS' });

export { fetchStateData, resetResults };
