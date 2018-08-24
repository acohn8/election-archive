import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';

import CountyContainer from '../CountyDetail/CountyContainer';

const colors = {
  democratic: '#2085D0',
  republican: '#DB2828',
  libertarian: '#FBBD09',
  other: '#6435C9',
};

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

  sortedCandidates = () => {
    const sortedCandidates = Object.keys(this.props.stateResults)
      .filter(id => id !== 'other')
      .map(id => parseInt(id, 10))
      .sort((a, b) => this.props.stateResults[b] - this.props.stateResults[a]);
    sortedCandidates.push('other');
    return sortedCandidates;
  };

  render() {
    const majorCandidates = this.sortedCandidates();
    return (
      <div ref={divElement => (this.divElement = divElement)}>
        <ReactTable
          data={this.props.countyResults.result}
          columns={[
            {
              Header: (
                <span
                  style={{
                    fontSize: this.props.windowWidth < 400 && '.8em',
                  }}
                >
                  County
                </span>
              ),
              style: {
                textAlign: 'left',
              },
              id: 'county',
              minWidth: 1.5,
              accessor: d => this.props.countyResults.entities.results[d].name,
              filterMethod: (filter, row) =>
                this.state.filtered.length > 0 &&
                row.county.toLowerCase().includes(this.state.filtered[0].value.toLowerCase()),
              Cell: row => {
                const winningCandidate = Object.keys(row.row)
                  .filter(key => key.includes('votes'))
                  .sort((a, b) => row.row[b] - row.row[a])
                  .map(key => key.split('-'))[0][1];
                const winnerParty = this.props.candidates.entities.candidates[winningCandidate]
                  .attributes.party;
                return (
                  <span>
                    <span
                      style={{
                        color: colors[winnerParty],
                        transition: 'all .3s ease',
                        margin: '3px',
                      }}
                    >
                      &#x25cf;
                    </span>
                    <span
                      style={{
                        whiteSpace: 'normal',
                        fontSize: this.props.windowWidth < 400 && '.8em',
                      }}
                    >
                      {row.value !== null ? row.value.replace(/County/g, '') : 'Unknown'}
                    </span>
                  </span>
                );
              },
            },
          ].concat(
            this.props.windowWidth >= 600
              ? majorCandidates.map(candidateId => ({
                  id: candidateId,
                  maxWidth: this.props.windowWidth * 0.2,
                  minWidth: 1,
                  Header: `${
                    candidateId === 'other'
                      ? 'Other'
                      : this.props.candidates.entities.candidates[candidateId].attributes.name
                  }`,
                  columns: [
                    {
                      id: `votes-${candidateId}`,
                      Header: 'Votes',
                      minWidth: 1,
                      accessor: d =>
                        this.props.countyResults.entities.results[d].results[candidateId],
                      filterable: false,
                      Cell: row => (row.value === undefined ? 0 : row.value.toLocaleString()),
                    },
                    {
                      Header: 'Percent',
                      id: `percent-${candidateId}`,
                      minWidth: 1,
                      accessor: d =>
                        this.props.countyResults.entities.results[d].results[candidateId] > 0
                          ? this.props.countyResults.entities.results[d].results[candidateId] /
                            Object.values(
                              this.props.countyResults.entities.results[d].results,
                            ).reduce((total, num) => total + num)
                          : 0,
                      filterable: false,
                      Cell: row => `${Math.max(Math.round(row.value * 100 * 10) / 10)} %`,
                    },
                  ],
                }))
              : majorCandidates.map(candidateId => ({
                  id: candidateId,
                  minWidth: 1,
                  Header: (
                    <span style={{ fontSize: '0.8em' }}>
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
                  columns: [
                    {
                      id: `votes-${candidateId}`,
                      Header: <span style={{ fontSize: '0.8em' }}>Votes</span>,
                      style: {
                        fontSize: '.8em',
                      },
                      minWidth: 1,
                      accessor: d =>
                        this.props.countyResults.entities.results[d].results[candidateId],
                      filterable: false,
                      Cell: row => (row.value === undefined ? 0 : row.value.toLocaleString()),
                    },
                  ],
                })),
          )}
          filterable
          filtered={this.state.filtered}
          expanded={this.state.expanded}
          defaultPageSize={
            this.props.countyResults.result.length < 20
              ? this.props.countyResults.result.length
              : 20
          }
          showPagination={this.props.countyResults.result.length > 20}
          onExpandedChange={(newExpanded, index, event) => {
            this.handleRowExpanded(index);
          }}
          onFilteredChange={filtered => this.setState({ filtered })}
          className="-highlight"
          SubComponent={row => (
            <div style={{ padding: '20px' }}>
              <CountyContainer row={row} />
            </div>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  countyResults: state.results.countyResults,
  stateResults: state.results.stateResults,
  windowWidth: state.nav.windowWidth,
  offices: state.offices,
});

export default connect(mapStateToProps)(ResultsTable);
