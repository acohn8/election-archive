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

  const counties = normalize(response[0].data.data, stateCounties);
  const countyResults = normalize(response[2].data.results, resultListSchema);
  const stateResults = response[3].data.results;
  const officeName = response[3].data.office_name;
  const stateName = response[3].data.name;
  const stateFips = response[3].data.fips;
  const shortName = response[3].data.short_name;
  const candidates = normalize(response[1].data.data, candidateListSchema);
  console.log(counties);
  dispatch({
    type: 'SET_STATE_DATA',
    shortName,
    counties,
    officeName,
    stateName,
    stateFips,
    candidates,
    countyResults,
    stateResults,
  });
};

const resetResults = () => ({ type: 'RESET_RESULTS' });

export { fetchStateData, resetResults };
