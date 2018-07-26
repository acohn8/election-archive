import React from 'react';
import { Grid } from 'semantic-ui-react';

import Map from '../Map/map';

const CountyContainer = () => (
  <Grid centered columns={2}>
    <Grid.Column>
      <Map />
    </Grid.Column>
  </Grid>
);

export default CountyContainer;
