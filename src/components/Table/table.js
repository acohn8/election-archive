import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ResultsTable = props => (
  <Table sortable celled fixed selectable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        {Object.keys(props.results[0].results[0]).map(candidateId => (
          <Table.HeaderCell key={candidateId}>
            {candidateId === 'other'
              ? 'Other'
              : props.candidates.entities.candidates[candidateId].attributes.name}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {props.geography.result.counties.map(countyId => (
        <Table.Row key={countyId}>
          <Table.Cell>{props.geography.entities.counties[countyId].name}</Table.Cell>
          {props.results
            .find(countyResult => countyResult.county_id === countyId)
            .results.map(result =>
              Object.values(result).map(num => <Table.Cell key={num}>{num}</Table.Cell>))}
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const mapStateToProps = state => ({
  results: state.results.countyResults.results,
  candidates: state.results.candidates,
  geography: state.results.geography,
});

export default connect(mapStateToProps)(ResultsTable);
