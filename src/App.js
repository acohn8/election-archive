import React from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Nav from './components/nav';
import StateContainer from './components/stateContainer';
import HomeContainer from './components/Home/HomeContainer';

import './App.css';

const App = () => (
  <div>
    <Nav />
    <Container>
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <Route path="/states/:activeStateId" component={StateContainer} />
      </Switch>
    </Container>
  </div>
);

const mapStateToProps = state => ({
  states: state.results.states,
});

export default withRouter(connect(mapStateToProps)(App));
