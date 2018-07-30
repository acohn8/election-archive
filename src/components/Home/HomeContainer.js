import React from 'react';
import { Header, Container, Divider } from 'semantic-ui-react';
import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';

/* eslint-disable max-len */

const HomeContainer = () => (
  <div>
    <Container>
      <Header as="h1">
        Select a State For Results
        <Header.Subheader>Zoom in for county results</Header.Subheader>
      </Header>
      <Divider hidden />
    </Container>
    <MapInfo />
    <Container fluid style={{ height: '100%' }}>
      <NationalMap />
    </Container>
  </div>
);

export default HomeContainer;
