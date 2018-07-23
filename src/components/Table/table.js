import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ResultsTable = props => (
  <Table sortable celled fixed selectable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        {Object.keys(props.electionResults.entities.results[props.electionResults.result[0]].results).map(candidateId => (
          <Table.HeaderCell key={candidateId}>
            {candidateId === 'other'
              ? 'Other'
              : props.candidates.entities.candidates[candidateId].attributes.name}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {props.electionResults.result.map(countyId => (
        <Table.Row key={countyId}>
          <Table.Cell>{props.geography.entities.counties[countyId].name}</Table.Cell>
          {Object.values(props.electionResults.entities.results[countyId].results).map(result => (
            <Table.Cell key={result}>{result.toLocaleString()}</Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
});

export default connect(mapStateToProps)(ResultsTable);
