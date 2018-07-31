import React from 'react';
import { Header, Container, Grid, Divider } from 'semantic-ui-react';
import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';
import StateDropdown from '../StateDropdown';

/* eslint-disable max-len */

const HomeContainer = () => (
  <div>
    <Container>
      <Grid columns={2} verticalAlign="middle">
        <Grid.Column>
          <Header as="h1">
            Select a State For Results
            <Header.Subheader>Zoom in for county results</Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column>
          <StateDropdown />
        </Grid.Column>
      </Grid>
      <Divider hidden />
    </Container>
    <MapInfo />
    <Container fluid style={{ height: '100%', position: 'fixed', overflow: 'hide' }}>
      <NationalMap />
    </Container>
  </div>
);

export default HomeContainer;
