import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';

const PrecinctResultsTable = (props) => {
  const majorCandidates = Object.keys(props.electionResults.entities.results[props.electionResults.result[0]].results);
  return (
    <ReactTable
      data={props.precinctResults.precincts}
      defaultPageSize={props.precinctResults.precincts.length}
      showPagination={false}
      columns={[
        {
          Header: 'Precinct',
          id: 'precinct',
          width: 100,
          accessor: d => d.name,
        },
      ].concat(majorCandidates.map(candidateId => ({
          id: candidateId,
          Header: `${
            candidateId === 'other'
              ? 'Other'
              : props.candidates.entities.candidates[candidateId].attributes.name
          }`,
          accessor: d => d.results[candidateId],
          filterable: false,
          minWidth: 90,
        })))}
      style={{ maxHeight: '400px' }}
    />
  );
};

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
  precinctResults: state.results.precinctResults,
});

export default connect(mapStateToProps)(PrecinctResultsTable);
