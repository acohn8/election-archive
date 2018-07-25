import React from 'react';
import { Table } from 'semantic-ui-react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import { div } from 'gl-matrix/src/gl-matrix/vec4';

const ResultsTable = (props) => {
  const majorCandidates = Object.keys(props.electionResults.entities.results[props.electionResults.result[0]].results);

  const data = props.electionResults.result.map(countyId => ({
    countyId,
    county: props.geography.entities.counties[countyId].name,
  }));

  data.forEach((county) => {
    county.candidates = {};
    majorCandidates.forEach((candidateId) => {
      county.candidates[candidateId] = {
        votes: props.electionResults.entities.results[county.countyId].results[candidateId],
      };
    });
  });

  const columns = [
    {
      Header: 'County',
      id: 'county',
      accessor: d => d.county,
    },
  ];

  majorCandidates.map((candidateId) => {
    columns.push({
      id: candidateId,
      Header: `${
        candidateId === 'other'
          ? 'Other'
          : props.candidates.entities.candidates[candidateId].attributes.name
      }`,
      accessor: d => d.candidates[candidateId].votes,
    });
  });

  return (
    <ReactTable
      data={data}
      columns={columns}
      defaultPageSize={10}
      className="-striped -highlight"
    />
  );
};

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
});

export default connect(mapStateToProps)(ResultsTable);
