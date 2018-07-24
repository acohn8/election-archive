import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TableContainer from './Table/tableContainer';
import MapContainer from './Map/mapContainer';
import ToplinesContainer from './Toplines/toplinesContainer';
import ContentLoader from './Loader';

const StateContainer = props => (
  <div>
    {props.loading === true && <ContentLoader />}
    {props.candidates.result !== undefined && (
      <div>
        <Header as="h1">
          {
            props.states.states.find(state => state.id === props.states.activeStateId).attributes
              .name
          }
        </Header>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <ToplinesContainer />
            </Grid.Column>
            <Grid.Column>
              <MapContainer />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row colums={1}>
            <TableContainer />
          </Grid.Row>
        </Grid>
      </div>
    )}
  </div>
);

const mapStateToProps = state => ({
  loading: state.results.loading,
  geogrophy: state.results.geogrophy,
  candidates: state.results.candidates,
  states: state.states,
});

export default connect(mapStateToProps)(StateContainer);
