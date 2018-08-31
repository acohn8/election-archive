import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

const colors = {
  democratic: 'rgb(32,133,208,.2)',
  republican: 'rgb(219,40,40,.2)',
  libertarian: 'rgb(251,189,9, .2)',
  other: 'rgb(100,53,201, .2)',
};

class NewTable extends Component {
  state = {
    column: null,
    data: [],
    direction: null,
  };

  componentDidMount() {
    this.makeData();
  }

  handleSort = clickedColumn => () => {
    const data = this.sortColumns(clickedColumn);
    if (this.state.column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: data,
        direction: 'ascending',
      });
      return;
    }

    this.setState({
      column: clickedColumn,
      data: this.state.data.reverse(),
      direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  sortColumns = column => {
    if (column === 'name') {
      return this.state.data.slice().sort((a, b) => a[column].localeCompare(b[column]));
    } else {
      return this.state.data.slice().sort((a, b) => b[column].total - a[column].total);
    }
  };

  sortedCandidates = () => {
    const sortedCandidates = Object.keys(this.props.stateResults)
      .filter(id => id !== 'other')
      .map(id => parseInt(id, 10))
      .sort((a, b) => this.props.stateResults[b] - this.props.stateResults[a]);
    return sortedCandidates.slice(0, 2);
  };

  getCountyWinner = countyResults => {
    const winner = Object.keys(countyResults).sort(
      (a, b) => countyResults[b] - countyResults[a],
    )[0];
    return this.props.candidates.entities.candidates[winner].attributes.party;
  };

  makeData = () => {
    const countyResults = this.props.countyResults.result.map(county_id => ({
      id: county_id,
      name: this.props.countyResults.entities.results[county_id].name,
    }));
    countyResults.forEach(result => {
      const countyResults = this.props.countyResults.entities.results[result.id].results;
      const countyTotal = Object.values(countyResults).reduce((sum, n) => sum + n);

      const countyWinnerParty = this.getCountyWinner(countyResults);

      const firstVotes = countyResults[this.sortedCandidates()[0]];
      const secondVotes = countyResults[this.sortedCandidates()[1]];
      const otherVotes = countyTotal - (firstVotes + secondVotes);

      const firstPlace = this.props.candidates.entities.candidates[this.sortedCandidates()[0]];
      const secondPlace = this.props.candidates.entities.candidates[this.sortedCandidates()[1]];

      result.winnerParty = countyWinnerParty;
      result.first = {};
      result.first.id = this.sortedCandidates()[0];
      result.first.name = firstPlace.attributes.name;
      result.first.party = firstPlace.attributes.party;
      result.first.total = firstVotes;
      result.second = {};
      if (secondVotes > 0) {
        result.second.id = this.sortedCandidates()[1];
        result.second.name = secondPlace.attributes.name;
        result.second.party = secondPlace.attributes.party;
        result.second.total = secondVotes;
      }
      if (otherVotes > 0) {
        result.other = {};
        result.other.id = 'other';
        result.other.name = 'other';
        result.other.party = null;
        result.other.total = otherVotes;
      }
    });
    this.setState({ data: countyResults });
  };

  render() {
    const { column, direction } = this.state;
    return (
      <div
        style={{
          overflow: 'auto',
          height: 375,
        }}
      >
        {this.state.data.length > 0 && (
          <Table sortable celled fixed unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'name' ? direction : null}
                  onClick={this.handleSort('name')}
                >
                  County
                </Table.HeaderCell>
                {Object.keys(this.state.data[0])
                  .filter(key => ['first', 'second', 'other'].includes(key))
                  .map(position => (
                    <Table.HeaderCell
                      key={this.state.data[0][position].name}
                      sorted={column === position ? direction : null}
                      onClick={this.handleSort(position)}
                    >
                      {this.state.data[0][position].name}
                    </Table.HeaderCell>
                  ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.data.map(county => (
                <Table.Row key={county.id}>
                  <Table.Cell>{county.name}</Table.Cell>
                  {Object.keys(county)
                    .filter(key => ['first', 'second', 'other'].includes(key))
                    .map(
                      position =>
                        county.winnerParty === county[position].party ? (
                          <Table.Cell
                            key={`${county.name}${position}`}
                            style={{ backgroundColor: colors[county.winnerParty] }}
                          >
                            {county[position].total.toLocaleString()}
                          </Table.Cell>
                        ) : (
                          <Table.Cell key={`${county.name}${position}`}>
                            {county[position].total ? county[position].total.toLocaleString() : 0}
                          </Table.Cell>
                        ),
                    )}
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
  candidates: state.results.candidates,
  countyResults: state.results.countyResults,
  stateResults: state.results.stateResults,
});

export default connect(mapStateToProps)(NewTable);
