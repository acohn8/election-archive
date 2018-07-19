import React from 'react';
import { Grid, Container, Header } from 'semantic-ui-react';

import Nav from './components/nav';
import StateContainer from './components/stateContainer'

import './App.css';

const App = () => (
  <div>
    <Nav />
    <Container>
      <StateContainer />
    </Container>
  </div>
);

export default App;
