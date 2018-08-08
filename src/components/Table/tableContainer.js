import React from 'react';
import { Divider, Header, Grid, Container } from 'semantic-ui-react';
import ResultsTable from './table';
import ExportDropdown from './ExportDropdown';

const TableContainer = () => (
  <Grid columns={1} verticalAlign="middle" stackable>
    <Header as="h2">County Results</Header>
    <ExportDropdown />
    <Divider hidden />
    <Grid.Row centered>
      <Container fluid>
        <ResultsTable />
      </Container>
    </Grid.Row>
  </Grid>
);

export default TableContainer;
