import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';

class PrecinctResultsTable extends React.Component {
  state = { windowWidth: '' };
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ windowWidth: this.divElement.clientWidth });
  };

  statewideCandidateResults = () => {
    const statewideResults = {};
    const stateCandidates = this.props.candidates.result;
    stateCandidates.forEach(candidateId => {
      statewideResults[candidateId] = 0;
    });
    this.props.electionResults.result.forEach(countyId => {
      stateCandidates.forEach(candidateId => {
        statewideResults[candidateId] += this.props.electionResults.entities.results[
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
                <span style={{ fontSize: this.state.windowWidth < 300 && '0.8em' }}>Precinct</span>
              ),
              id: 'precinct',
              style: {
                textAlign: 'left',
                fontSize: this.state.windowWidth < 300 && '.8em',
              },
              maxWidth: this.state.windowWidth * 0.2,
              minWidth: 1.5,
              accessor: d => d.name,
            },
          ].concat(
            majorCandidates.map(candidateId => ({
              id: candidateId,
              style: {
                fontSize: this.state.windowWidth < 300 && '.8em',
              },
              maxWidth: this.state.windowWidth * 0.2,
              minWidth: 1.5,
              Header: (
                <span style={{ fontSize: this.state.windowWidth < 300 && '0.8em' }}>
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
  electionResults: state.results.electionResults,
  precinctResults: state.results.precinctResults,
});

export default connect(mapStateToProps)(PrecinctResultsTable);
