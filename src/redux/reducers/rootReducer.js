import { combineReducers } from 'redux';

import resultsReducer from './resultsReducer';
import statesReducer from './stateReducer';
import mapsReducer from './mapReducer';
import navReducer from './navReducer';

const rootReducer = combineReducers({
  maps: mapsReducer,
  results: resultsReducer,
  states: statesReducer,
  nav: navReducer,
});

export default rootReducer;
