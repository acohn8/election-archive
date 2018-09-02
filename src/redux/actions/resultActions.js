import axios from 'axios';
import { normalize } from 'normalizr';

import { candidateListSchema, resultListSchema, officeListSchema } from './schema';

const fetchStateData = (stateId, districtId = null) => async (dispatch, getState) => {
  const url = 'https://election-data-2016.herokuapp.com/api/v1/';
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
    axios.get(`${url}/states/${stateId}/offices/${getState().offices.selectedOfficeId}/candidates`),
    axios.get(`${url}/${subgeography}`),
    axios.get(`${url}/${officeTotal}`),
    axios.get(`${url}/states/${stateId}/offices`),
    axios.get(`${url}/states/${stateId}`),
  ]);

  const countyResults = normalize(response[1].data.results, resultListSchema);
  const stateResults = response[2].data.results;
  const officeName = response[2].data.office_name;
  const stateName = response[2].data.name;
  const stateFips = response[2].data.fips;
  const shortName = response[2].data.short_name;
  const candidates = normalize(response[0].data.data, candidateListSchema);
  const stateOffices = normalize(response[3].data, officeListSchema);
  const stateInfo = response[4].data.data;

  dispatch({
    type: 'SET_STATE_DATA',
    shortName,
    officeName,
    stateName,
    stateOffices,
    stateFips,
    candidates,
    countyResults,
    stateResults,
    stateInfo,
  });
};

const setTopTwo = candidates => ({ type: 'SET_TOP_TWO', candidates });
const resetTopTwo = () => ({ type: 'RESET_TOP_TWO' });
const resetResults = () => ({ type: 'RESET_RESULTS' });

const setSortedCountyResults = results => ({ type: 'SET_SORTED_COUNTY_RESULTS', results });

export { fetchStateData, resetResults, setTopTwo, resetTopTwo, setSortedCountyResults };
