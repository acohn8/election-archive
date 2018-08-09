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

  render() {
    const majorCandidates = Object.keys(
      this.props.electionResults.entities.results[this.props.electionResults.result[0]].results,
    );
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
