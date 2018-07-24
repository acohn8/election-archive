import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import rootReducer from './reducers/rootReducer';

export const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancers(applyMiddleware(routerMiddleware(history), thunk)),
);

// export default store;
