import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import _ from 'lodash';

import CountyContainer from '../CountyDetail/CountyContainer';

class ResultsTable extends React.Component {
  state = { filtered: [], expanded: {}, prevIndex: '' };

  handleRowExpanded(index) {
    if (this.state.prevIndex !== '' && index - this.state.prevIndex === 0) {
      this.setState({ expanded: {}, prevIndex: '' });
    } else {
      this.setState({
        expanded: { [index]: true },
        prevIndex: index,
      });
    }
  }

  makeData = () => {
    const majorCandidates = Object.keys(
      this.props.electionResults.entities.results[this.props.electionResults.result[0]].results,
    );

    const data = this.props.electionResults.result.map(countyId => ({
      countyId,
      county: this.props.geography.entities.counties[countyId].name,
    }));

    data.forEach(county => {
      county.candidates = {};
      majorCandidates.forEach(candidateId => {
        county.candidates[candidateId] = {
          votes: this.props.electionResults.entities.results[county.countyId].results[candidateId],
        };
      });
    });
    return data;
  };

  makeColumns = (precinct = false) => {
    const majorCandidates = Object.keys(
      this.props.electionResults.entities.results[this.props.electionResults.result[0]].results,
    );

    const columns = [
      {
        Header: 'County',
        id: 'county',
        width: 300,
        accessor: d => d.county,
        filterMethod: (filter, row) =>
          this.state.filtered.length > 0 &&
          row.county.toLowerCase().includes(this.state.filtered[0].value.toLowerCase()),
      },
    ];

    majorCandidates.map(candidateId => {
      columns.push({
        id: candidateId,
        Header: `${
          candidateId === 'other'
            ? 'Other'
            : this.props.candidates.entities.candidates[candidateId].attributes.name
        }`,
        columns: [
          {
            Header: 'Votes',
            id: `candidate-votes${candidateId}`,
            accessor:
              precinct === false
                ? d => d.candidates[candidateId].votes
                : d => d.results[candidateId],
            filterable: false,
            minWidth: 100,
            Cell: row => row.value.toLocaleString(),
          },
          {
            Header: 'Percent',
            id: `candidate-percent-${candidateId}`,
            accessor: d =>
              d.candidates[candidateId].votes /
              majorCandidates
                .map(candidate => d.candidates[candidate].votes)
                .reduce((total, num) => total + num),
            filterable: false,
            minWidth: 100,
            Cell: row => `${Math.max(Math.round(row.value * 100 * 10) / 10)} %`,
          },
        ],
      });
    });
    return columns;
  };

  render() {
    return (
      <ReactTable
        data={this.makeData()}
        columns={this.makeColumns()}
        defaultPageSize={this.makeData().length > 50 ? 50 : this.makeData().length}
        filterable
        filtered={this.state.filtered}
        expanded={this.state.expanded}
        onExpandedChange={(newExpanded, index, event) => {
          this.handleRowExpanded(index);
        }}
        onFilteredChange={filtered => this.setState({ filtered })}
        className="-highlight"
        SubComponent={row => {
          return (
            <div style={{ padding: '20px' }}>
              <CountyContainer row={row} />
            </div>
          );
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
  precinctResults: state.results.precinctResults,
});

export default connect(mapStateToProps)(ResultsTable);
