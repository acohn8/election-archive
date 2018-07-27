import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import { Grid, Header, Divider } from 'semantic-ui-react';

import { fetchPrecinctData } from '../../redux/actions/precinctActions';
import CountyMap from '../Map/countyMap';
import Loader from '../Loader';

class ResultsTable extends React.Component {
  state = { filtered: [], expanded: {}, prevIndex: '' };

  handleRowExpanded(newExpanded, index, event) {
    if (this.state.prevIndex !== '' && index - this.state.prevIndex === 0) {
      this.setState({ expanded: {}, prevIndex: '' });
    } else {
      this.setState({
        expanded: { [index]: true },
        prevIndex: index,
      });
      this.props.fetchPrecinctData(
        this.props.geography.entities.counties[this.props.geography.result.counties[index[0]]].id,
      );
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
            id: `candidate-votes-${candidateId}`,
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
        onExpandedChange={(newExpanded, index, event) =>
          this.handleRowExpanded(newExpanded, index, event)
        }
        onFilteredChange={filtered => this.setState({ filtered })}
        className="-highlight"
        SubComponent={row => {
          return (
            <div style={{ padding: '20px' }}>
              <Grid centered columns={2}>
                <Grid.Row>
                  <Divider />
                  <Header as="h2">{row.row.county}</Header>
                  {this.props.precinctResults.precincts === undefined && <Loader />}
                </Grid.Row>
                <Grid.Column>
                  {this.props.precinctResults.precincts !== undefined && (
                    <ReactTable
                      data={this.props.precinctResults.precincts}
                      defaultPageSize={this.props.precinctResults.precincts.length}
                      showPagination={false}
                      columns={this.makeColumns(true)}
                      style={{
                        maxHeight: '400px',
                      }}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {this.props.precinctResults.county_id !== undefined && <CountyMap />}
                </Grid.Column>
                <Divider />
              </Grid>
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
