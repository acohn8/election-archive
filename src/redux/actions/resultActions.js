import axios from 'axios';
import { normalize } from 'normalizr';
import { candidateListSchema, officeListSchema, resultListSchema } from './schema';

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
    axios.get(`${url}/${subgeography}`),
    axios.get(`${url}/${officeTotal}`),
    axios.get(`${url}/states/${stateId}/offices`),
    axios.get(`${url}/states/${stateId}`),
  ]);

  const countyResults = normalize(response[0].data.results, resultListSchema);
  const stateResults = response[1].data.results;
  const candidates = normalize(response[1].data.candidates, candidateListSchema);
  const stateOffices = normalize(response[2].data, officeListSchema);
  const stateInfo = response[3].data.data;
  const officeInfo = response[1].data.office;

  dispatch({
    type: 'SET_STATE_DATA',
    stateOffices,
    candidates,
    countyResults,
    stateResults,
    officeInfo,
    stateInfo,
  });
};

const resetResults = () => ({ type: 'RESET_RESULTS' });

const setSortedCountyResults = results => ({ type: 'SET_SORTED_COUNTY_RESULTS', results });

export { fetchStateData, resetResults, setSortedCountyResults };
