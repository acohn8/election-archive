import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

class NewTable extends Component {
  state = {
    column: null,
    data: {},
    direction: null,
  };

  componentDidMount() {
    this.makeData();
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      console.log(column, data, clickedColumn);
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data.map(d => d.results), [clickedColumn]),
        direction: 'ascending',
      });
      console.log(this.state);
      return;
    }

    this.setState({
      data: this.makeData().reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  sortedCandidates = () => {
    const sortedCandidates = Object.keys(this.props.stateResults)
      .filter(id => id !== 'other')
      .map(id => parseInt(id, 10))
      .sort((a, b) => this.props.stateResults[b] - this.props.stateResults[a]);
    return sortedCandidates.slice(0, 2);
  };

  makeData = () => {
    const countyResults = this.props.countyResults.result.map(county_id => ({
      id: county_id,
      name: this.props.countyResults.entities.results[county_id].name,
    }));
    countyResults.forEach(result => {
      const countyTotal = Object.values(
        this.props.countyResults.entities.results[result.id].results,
      ).reduce((sum, n) => sum + n);

      const firstVotes = this.props.countyResults.entities.results[result.id].results[
        this.sortedCandidates()[0]
      ];
      const secondVotes = this.props.countyResults.entities.results[result.id].results[
        this.sortedCandidates()[1]
      ];
      const otherVotes = countyTotal - (firstVotes + secondVotes);

      const firstPlace = this.props.candidates.entities.candidates[this.sortedCandidates()[0]];
      const secondPlace = this.props.candidates.entities.candidates[this.sortedCandidates()[1]];

      result.first = {};
      result.first.id = this.sortedCandidates()[0];
      result.first.name = firstPlace.attributes.name;
      result.first.party = firstPlace.attributes.party;
      result.first.total = firstVotes;
      result.second = {};
      result.second.id = this.sortedCandidates()[1];
      result.second.name = secondPlace.attributes.name;
      result.second.party = secondPlace.attributes.party;
      result.second.total = secondVotes;
      result.other = {};
      result.other.id = 'other';
      result.other.name = 'other';
      result.other.party = null;
      result.other.total = otherVotes;
    });
    this.setState({ data: countyResults });
  };

  render() {
    const { column, data, direction } = this.state;
    console.log(this.state);
    return (
      <Table sortable celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'county' ? direction : null}
              onClick={this.handleSort('county')}
            >
              County
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'second' ? direction : null}
              onClick={this.handleSort('second')}
            >
              {
                this.props.candidates.entities.candidates[this.sortedCandidates()[0]].attributes
                  .name
              }
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'first' ? direction : null}
              onClick={this.handleSort('first')}
            >
              {
                this.props.candidates.entities.candidates[this.sortedCandidates()[1]].attributes
                  .name
              }
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'other' ? direction : null}
              onClick={this.handleSort('other')}
            >
              Other
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.data.length &&
            this.state.data.map(county => (
              <Table.Row key={county.id}>
                <Table.Cell>{county.name}</Table.Cell>
                <Table.Cell>{county.first.total}</Table.Cell>
                <Table.Cell>{county.second.total}</Table.Cell>
                <Table.Cell>{county.other.total}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  countyResults: state.results.countyResults,
  stateResults: state.results.stateResults,
});

export default connect(mapStateToProps)(NewTable);
