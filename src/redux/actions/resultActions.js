import axios from 'axios';
import { normalize } from 'normalizr';
import { candidateListSchema, officeListSchema, resultListSchema } from './schema';
import { setActiveOffice } from './officeActions';

const getOfficeTotal = (stateId, officeId, districtId = null) => {
  if (!districtId) {
    return `states/${stateId}/offices/${officeId}/results/state`;
  }
  return `states/${stateId}/offices/${officeId}/results/district/${districtId}`;
};

const getSubGeography = (stateId, officeId, geography, districtId = null) => {
  if (!districtId) {
    return `states/${stateId}/offices/${officeId}/results/${geography}`;
  }
  return `states/${stateId}/offices/${officeId}/results/district/${districtId}/${geography}`;
};

const fetchStateData = (stateId, districtId = null) => async (dispatch, getState) => {
  const url = 'http://localhost:3000/api/v1';
  dispatch({ type: 'START_FETCH' });
  const officeTotal = getOfficeTotal(stateId, getState().offices.selectedOfficeId, districtId);
  const subgeography = getSubGeography(
    stateId,
    getState().offices.selectedOfficeId,
    'county',
    districtId,
  );

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

const fetchPrecinctData = (countyId, districtId = null) => async (dispatch, getState) => {
  const subgeography = getSubGeography(
    getState().states.activeStateId,
    getState().offices.selectedOfficeId,
    'precinct',
    districtId,
  );
  const url = `http://localhost:3000/api/v1/${subgeography}/${countyId}`;
  dispatch({ type: 'START_PRECINCT_FETCH' });
  const fetchedPrecincts = await axios.get(url);
  const precincts = normalize(fetchedPrecincts.data.results, resultListSchema);
  dispatch({ type: 'SET_PRECINCTS', precincts });
};

const updateOfficeData = (officeId, districtId = null) => async (dispatch, getState) => {
  dispatch({ type: 'FETCHING' });
  dispatch(setActiveOffice(officeId, districtId));
  const url = 'http://localhost:3000/api/v1';
  const officeTotal = getOfficeTotal(getState().states.activeStateId, officeId, districtId);
  const subgeography = getSubGeography(
    getState().states.activeStateId,
    officeId,
    'county',
    districtId,
  );

  const response = await Promise.all([
    axios.get(`${url}/${subgeography}`),
    axios.get(`${url}/${officeTotal}`),
  ]);

  const countyResults = normalize(response[0].data.results, resultListSchema);
  const stateResults = response[1].data.results;
  const candidates = normalize(response[1].data.candidates, candidateListSchema);
  const officeInfo = response[1].data.office;

  dispatch({
    type: 'UPDATE_OFFICE_DATA',
    candidates,
    countyResults,
    stateResults,
    officeInfo,
  });
};

const resetResults = () => ({ type: 'RESET_RESULTS' });

const resetPrecinctResults = () => ({ type: 'RESET_PRECINCT_RESULTS' });

const setSortedResults = (results, geography) => {
  if (geography === 'county') {
    return { type: 'SET_SORTED_COUNTY_RESULTS', results };
  }
  return { type: 'SET_SORTED_PRECINCT_RESULTS', results };
};
export {
  fetchStateData,
  updateOfficeData,
  resetResults,
  setSortedResults,
  fetchPrecinctData,
  resetPrecinctResults,
};
