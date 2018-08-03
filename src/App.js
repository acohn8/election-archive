import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Nav from './components/nav';
import StateContainer from './components/stateContainer';
import HomeContainer from './components/Home/HomeContainer';

import './App.css';
import Footer from './components/Footer';

const App = () => (
  <div>
    <Nav />
    <Switch>
      <Route exact path="/" component={HomeContainer} />
      <Route path="/states/:activeStateId" component={StateContainer} />
    </Switch>
    <Footer />
  </div>
);

export default App;
