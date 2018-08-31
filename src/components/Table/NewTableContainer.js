import React from 'react';
import NewTable from './NewTable';
import { Segment, Grid, Container } from 'semantic-ui-react';

const NewTableContainer = () => (
  <Container>
    <Grid columns={2}>
      <Grid.Column>
        <Segment>
          <NewTable />
        </Segment>
      </Grid.Column>
    </Grid>
  </Container>
);

export default NewTableContainer;
