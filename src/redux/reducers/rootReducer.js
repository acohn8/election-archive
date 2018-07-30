import { combineReducers } from 'redux';

import resultsReducer from './resultsReducer';
import statesReducer from './stateReducer';
import mapReducer from './mapReducer';

const rootReducer = combineReducers({
  maps: mapReducer,
  results: resultsReducer,
  states: statesReducer,
});

export default rootReducer;
