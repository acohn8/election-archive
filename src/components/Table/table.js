import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fetchPrecinctData } from '../../redux/actions/precinctActions';
import PrecinctTable from './precinctTable';

class ResultsTable extends React.Component {
  state = { filtered: [] };

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
    console.log(data);
    return data;
  };

  makeColumns = () => {
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
        accessor: d => d.candidates[candidateId].votes,
        filterable: false,
        minWidth: 100,
      });
    });
    return columns;
  };

  render() {
    return (
      <ReactTable
        data={this.makeData()}
        columns={this.makeColumns()}
        defaultPageSize={20}
        filterable
        filtered={this.state.filtered}
        // expanded={this.state.expanded}
        // onExpandedChange={expanded => this.setState({ expanded: expanded })}
        onFilteredChange={filtered => this.setState({ filtered })}
        className="-striped -highlight"
        style={{
          height: '800px',
        }}
        SubComponent={row => {
          {
            this.props.fetchPrecinctData(row.original.countyId);
          }
          return (
            <div style={{ padding: '20px', backgroundColor: '#F9FAFB' }}>
              <Header as="h4">Precinct Results</Header>
              <br />
              <br />
              <div>
                <PrecinctTable />
              </div>
            </div>
          );
        }}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchPrecinctData: id => dispatch(fetchPrecinctData(id)),
});

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
  precinctResults: state.results.precinctResults,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsTable);
