import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ResultsTable = props => (
  <div>
    {props.candidates.length > 0 && (
      <Table sortable celled fixed selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            {Object.keys(props.results[0].results[0]).map(candidateId => (
              <Table.HeaderCell key={candidateId}>
                {candidateId === 'other'
                  ? 'Other'
                  : props.candidates.find(candidate => candidate.id === candidateId).attributes
                      .name}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.geography.counties.map(county => (
            <Table.Row key={county.name}>
              <Table.Cell>{county.name}</Table.Cell>
              {props.results
                .find(countyResult => countyResult.county_id === county.id)
                .results.map(result =>
                  Object.values(result).map(num => <Table.Cell>{num}</Table.Cell>))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </div>
);

const mapStateToProps = state => ({
  results: state.results.countyResults.results,
  candidates: state.results.candidates,
  geography: state.results.geography,
});

export default connect(mapStateToProps)(ResultsTable);
