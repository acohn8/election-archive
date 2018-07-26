import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';

import { fetchPrecinctData } from '../../redux/actions/precinctActions';

class ResultsTable extends React.Component {
  state = { filtered: [], expanded: {} };

  handleRowExpanded(newExpanded, index, event) {
    this.setState({
      expanded: { [index]: true },
    });
    this.props.fetchPrecinctData(
      this.props.geography.entities.counties[this.props.geography.result.counties[index[0]]].id,
    );
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
        Header: precinct === false ? 'County' : 'Precinct',
        id: precinct === false ? 'county' : 'precinct',
        width: 300,
        accessor: precinct === false ? d => d.county : d => d.name,
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
        accessor:
          precinct === false ? d => d.candidates[candidateId].votes : d => d.results[candidateId],
        filterable: false,
        minWidth: 200,
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
        onExpandedChange={(newExpanded, index, event) =>
          this.handleRowExpanded(newExpanded, index, event)
        }
        onFilteredChange={filtered => this.setState({ filtered })}
        className="-striped -highlight"
        style={{
          height: '800px',
        }}
        SubComponent={row => {
          return (
            <div style={{ padding: '20px' }}>
              <br />
              <br />
              {this.props.precinctResults.precincts !== undefined ? (
                <ReactTable
                  data={this.props.precinctResults.precincts}
                  columns={this.makeColumns(true)}
                  defaultPageSize={this.props.precinctResults.precincts.length}
                  showPagination={false}
                />
              ) : (
                ''
              )}
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
