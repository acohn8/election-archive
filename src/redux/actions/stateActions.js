import axios from 'axios';
import { push } from 'connected-react-router';
import { resetHover } from './mapActions';
import { fetchStateData, resetResults } from './resultActions';
import { setActiveOffice } from './officeActions';

const fetchStatesList = () => async (dispatch) => {
  const response = await axios.get('https://election-data-2016.herokuapp.com/api/v1/states');
  dispatch({ type: 'SET_STATES', states: response.data.data });
};

const setActiveState = (stateId, officeId, districtName = null) => (dispatch) => {
  dispatch(setStateId(stateId));
  dispatch(setActiveOffice(officeId, districtName));
  dispatch(resetHover());
  dispatch(fetchStateData(stateId, districtName));
};

const setStateId = stateId => dispatch => dispatch({ type: 'ACTIVE_STATE', stateId });

const pushToNewState = (stateId, districtName = null) => (dispatch, getState) => {
  const state = getState()
    .states.states.find(state => state.id === stateId)
    .attributes.name.split(' ')
    .join('-')
    .toLowerCase();
  const office = getState()
    .offices.allOffices.entities.offices[getState().offices.selectedOfficeId].attributes.name.split(' ')
    .join('-')
    .toLowerCase();

  if (districtName) {
    const district = districtName.toLowerCase();
    dispatch(push(`/states/${state}/${office}/${district}`));
  } else {
    dispatch(push(`/states/${state}/${office}`));
  }
};
const resetActiveState = () => (dispatch) => {
  dispatch({ type: 'RESET_ACTIVE_STATE' });
  dispatch(resetResults());
  dispatch(resetHover());
};

export { fetchStatesList, setActiveState, resetActiveState, pushToNewState, setStateId };
