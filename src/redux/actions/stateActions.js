import axios from 'axios';
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

const resetActiveState = () => (dispatch) => {
  dispatch({ type: 'RESET_ACTIVE_STATE' });
  dispatch(resetResults());
  dispatch(resetHover());
};

export { fetchStatesList, setActiveState, resetActiveState, setStateId };
