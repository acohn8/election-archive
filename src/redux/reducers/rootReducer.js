import { combineReducers } from 'redux';

import resultsReducer from './resultsReducer';

const rootReducer = combineReducers({
  results: resultsReducer,
});

export default rootReducer;
