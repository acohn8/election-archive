import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

class ResultsTable extends Component {
  state = {
    column: null,
    data: [],
    direction: null,
  };

  componentDidMount() {
    this.formatData();
  }

  formatData = () => {
    const data = [];
    this.props.results.forEach(county => {
      const trump = county.candidates.filter(
        candidate => candidate['normalized_name'] === 'trump',
      )[0].results;
      const clinton = county.candidates.filter(
        candidate => candidate['normalized_name'] === 'clinton',
      )[0].results;
      const johnson = county.candidates.filter(
        candidate => candidate['normalized_name'] === 'johnson',
      )[0].results;
      const stein = county.candidates.filter(
        candidate => candidate['normalized_name'] === 'stein',
      )[0].results;
      // const mcmullin = county.candidates.filter(
      //   candidate => candidate['normalized_name'] === 'mcmullin',
      // )[0].results;
      const other = county.candidates.filter(
        candidate => candidate['normalized_name'] === 'other',
      )[0].results;
      data.push({
        name: county.county_name,
        trump: trump,
        clinton: clinton,
        johnson: johnson,
        stein: stein,
        // mcmullin: mcmullin,
        other: other,
      });
    });
    this.setState({ data: data });
  };

  //{county: '', trump: '', clinton: '', other: ''}

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      });
      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  render() {
    const { column, data, direction } = this.state;

    return (
      <div>
        {this.props.results.length > 0 && (
          <Table sortable celled fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'county_name' ? direction : null}
                  onClick={this.handleSort('county_name')}
                >
                  County
                </Table.HeaderCell>
                {this.props.results[0].candidates.map(candidate => (
                  <Table.HeaderCell
                    sorted={column === candidate.normalized_name ? direction : null}
                    onClick={this.handleSort(candidate.normalized_name)}
                  >
                    {candidate.name}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map({county} => (
                <Table.Row key={county.fips}>
                  <Table.Cell>{county.county_name}</Table.Cell>
                  <Table.Cell>{county.candidates.normalized_name}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  results: state.results.electionResults,
});

export default connect(mapStateToProps)(ResultsTable);
