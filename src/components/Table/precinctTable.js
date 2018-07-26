import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

class PrecinctTable extends React.Component {
  render() {
    console.log(this.props.precinctResults);
    // {
    // return this.props.precinctResults !== {} ? (
    return (
      <ReactTable
        data={this.props.precinctResults.precincts}
        columns={[
          {
            Header: 'Precinct',
            id: 'precinct',
            width: 300,
            accessor: d => d.name,
          },
        ].concat(Object.keys(this.props.electionResults.entities.results[this.props.electionResults.result[0]]
              .results).map(candidateId => ({
            id: candidateId,
            Header:
              candidateId === 'other'
                ? 'Other'
                : this.props.candidates.entities.candidates[candidateId].attributes.name,
            accessor: d => d.results[candidateId],
            filterable: false,
            minWidth: 100,
          })))}
        defaultPageSize={this.props.precinctResults.length}
        showPagination={false}
        style={{
          height: '400px',
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  precinctResults: state.results.precinctResults,
  electionResults: state.results.electionResults,
});

export default connect(mapStateToProps)(PrecinctTable);
