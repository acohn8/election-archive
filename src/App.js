import React from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Nav from './components/nav';
import StateContainer from './components/stateContainer';
import HomeContainer from './components/Home/HomeContainer';

import './App.css';

const App = () => (
  <div>
    <Nav />
    <Container>
      <Switch>
        <StateContainer />
      </Switch>
    </Container>
  </div>
);

export default withRouter(App);
