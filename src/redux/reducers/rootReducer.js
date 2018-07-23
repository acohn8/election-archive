import { combineReducers } from 'redux';

import resultsReducer from './resultsReducer';
import statesReducer from './stateReducer';

const rootReducer = combineReducers({
  results: resultsReducer,
  states: statesReducer,
});

export default rootReducer;
