import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';

class PrecinctResultsTable extends React.Component {
  statewideCandidateResults = () => {
    const statewideResults = {};
    const stateCandidates = this.props.candidates.result;
    stateCandidates.forEach(candidateId => {
      statewideResults[candidateId] = 0;
    });
    this.props.countyResults.result.forEach(countyId => {
      stateCandidates.forEach(candidateId => {
        statewideResults[candidateId] += this.props.countyResults.entities.results[
          countyId
        ].results[candidateId];
      });
    });
    return statewideResults;
  };

  sortedCandidates = () => {
    const candidatesWithResults = Object.keys(this.statewideCandidateResults()).filter(
      candidateId => Boolean(this.statewideCandidateResults()[candidateId]),
    );
    const sortedIds = candidatesWithResults.sort(
      (a, b) => this.statewideCandidateResults()[b] - this.statewideCandidateResults()[a],
    );
    return sortedIds;
  };

  render() {
    const majorCandidates = this.sortedCandidates();
    return (
      <div ref={divElement => (this.divElement = divElement)}>
        <ReactTable
          data={this.props.precinctResults.precincts}
          defaultPageSize={this.props.precinctResults.precincts.length}
          showPagination={false}
          columns={[
            {
              Header: (
                <span style={{ fontSize: this.props.windowWidth < 300 && '0.8em' }}>Precinct</span>
              ),
              id: 'precinct',
              style: {
                textAlign: 'left',
                fontSize: this.props.windowWidth < 300 && '.8em',
              },
              maxWidth: this.props.windowWidth * 0.2,
              minWidth: 1.5,
              accessor: d => d.name,
            },
          ].concat(
            majorCandidates.map(candidateId => ({
              id: candidateId,
              style: {
                fontSize: this.props.windowWidth < 300 && '.8em',
              },
              maxWidth: this.props.windowWidth * 0.2,
              minWidth: 1.5,
              Header: (
                <span style={{ fontSize: this.props.windowWidth < 300 && '0.8em' }}>
                  {`${
                    candidateId === 'other'
                      ? 'Other'
                      : this.props.candidates.entities.candidates[candidateId].attributes[
                          'normalized-name'
                        ].replace(/\b\w/g, l => l.toUpperCase())
                  }
                  `}
                </span>
              ),
              accessor: d => d.results[candidateId],
              filterable: false,
              Cell: row => <span style={{ whiteSpace: 'normal' }}>{row.value}</span>,
            })),
          )}
          style={{ maxHeight: '400px' }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  countyResults: state.results.countyResults,
  precinctResults: state.results.precinctResults,
  windowWidth: state.nav.windowWidth,
});

export default connect(mapStateToProps)(PrecinctResultsTable);
