import { combineReducers } from 'redux';

import resultsReducer from './resultsReducer';
import statesReducer from './stateReducer';
import mapsReducer from './mapReducer';
import navReducer from './navReducer';
import officesReducer from './officeReducer';

const rootReducer = combineReducers({
  maps: mapsReducer,
  results: resultsReducer,
  states: statesReducer,
  offices: officesReducer,
  nav: navReducer,
});

export default rootReducer;
