import React from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';

import Nav from './components/nav';
import StateContainer from './components/stateContainer';
import HomeContainer from './components/Home/HomeContainer';

import './App.css';

const App = () => (
  <div>
    <Nav />
    {/* <Container> */}
    <Switch>
      <Route exact path="/" render={HomeContainer} />
      <Route path="/states/:activeStateId" component={StateContainer} />
    </Switch>
    {/* </Container> */}
  </div>
);

export default App;
