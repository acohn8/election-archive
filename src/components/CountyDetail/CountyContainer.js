import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import CountyMap from '../Map/countyMap';

const CountyContainer = props => (
  <Grid centered columns={2}>
    <Grid.Column>{props.precinctResults.precincts !== undefined && <CountyMap />}</Grid.Column>
  </Grid>
);

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  precinctResults: state.results.precinctResults,
});

export default connect(mapStateToProps)(CountyContainer);
