import { combineReducers } from 'redux';

import resultsReducer from './resultsReducer';
import statesReducer from './stateReducer';
import mapsReducer from './mapReducer';

const rootReducer = combineReducers({
  maps: mapsReducer,
  results: resultsReducer,
  states: statesReducer,
});

export default rootReducer;
