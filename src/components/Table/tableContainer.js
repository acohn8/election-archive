import React from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import ResultsTable from './table';

const tableContainer = props => (
  <div>
    <Divider />
    <Header as="h2">County Results</Header>
    <Button primary>Export to CSV</Button>
    <Divider hidden />
    <ResultsTable />
  </div>
);

const mapStateToProps = state => ({
  candidates: state.results.candidates,
});

export default connect(mapStateToProps)(tableContainer);
