import React from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';
import ResultsTable from './table';

const tableContainer = () => (
  <div>
    <Divider />
    <Header as="h2">County Results</Header>
    <Button primary>Export to CSV</Button>
    <Divider hidden />
    <ResultsTable />
  </div>
);

export default tableContainer;
