import React from 'react';
import { Header } from 'semantic-ui-react';
import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';

/* eslint-disable max-len */

const HomeContainer = () => (
  <div>
    <Header as="h1">
      Select a State For Results
      <Header.Subheader>Zoom in for county results</Header.Subheader>
    </Header>
    <MapInfo />
    <NationalMap />
  </div>
);

export default HomeContainer;
