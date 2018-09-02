import React from 'react';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import StateResultTable from './StateResultTable';

import { setSortedCountyResults } from '../../redux/actions/resultActions';

class StateResultTableContainer extends React.Component {
  state = {
    column: null,
    direction: null,
  };

  handleSort = clickedColumn => {
    const newData = this.sortColumns(clickedColumn);
    if (this.state.column !== clickedColumn) {
      this.setState(
        {
          column: clickedColumn,
          direction: 'ascending',
        },
        () => this.props.setSortedCountyResults(newData),
      );
      return;
    }
    const previousSort = this.props.countyResults.result.slice();
    this.setState(
      {
        column: clickedColumn,
        direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
      },
      () => this.props.setSortedCountyResults(previousSort.reverse()),
    );
  };

  sortColumns = column => {
    const countyKeys = this.props.countyResults.result.slice();
    const countyData = Object.assign({}, this.props.countyResults.entities.results);
    if (column === 'name') {
      return countyKeys.sort((a, b) => countyData[a][column].localeCompare(countyData[b][column]));
    } else {
      let candidate;
      const first = this.props.topTwo[0];
      const second = this.props.topTwo[1];
      column === 'first' ? (candidate = first) : (candidate = second);
      return countyKeys.sort(
        (a, b) => countyData[b].results[candidate] - countyData[a].results[candidate],
      );
    }
  };

  makeData = () => {
    if (this.props.countyResults.result) {
      const countyResults = this.props.countyResults.result.map(county_id => ({
        id: county_id,
        name: this.props.countyResults.entities.results[county_id].name,
      }));
      countyResults.forEach(result => {
        const countyResults = this.props.countyResults.entities.results[result.id].results;
        const countyTotal = Object.values(countyResults).reduce((sum, n) => sum + n);

        const countyWinnerParty = this.getCountyWinner(countyResults);

        const firstVotes = countyResults[this.props.topTwo[0]];
        const secondVotes = countyResults[this.props.topTwo[1]];
        const otherVotes = countyTotal - (firstVotes + secondVotes);

        const firstPlace = this.props.candidates.entities.candidates[this.props.topTwo[0]];
        const secondPlace = this.props.candidates.entities.candidates[this.props.topTwo[1]];

        result.winnerParty = countyWinnerParty;
        result.first = {};
        result.first.id = this.props.topTwo[0];
        result.first.name = firstPlace.attributes.name;
        result.first.party = firstPlace.attributes.party;
        result.first.total = firstVotes;
        result.second = {};
        if (secondVotes > 0) {
          result.second.id = this.props.topTwo[1];
          result.second.name = secondPlace.attributes.name;
          result.second.party = secondPlace.attributes.party;
          result.second.total = secondVotes;
        }
        if (otherVotes > 0) {
          result.other = {};
          result.other.id = 'other';
          result.other.name = 'Other';
          result.other.party = null;
          result.other.total = otherVotes;
        }
      });
      return countyResults;
    }
  };

  getCountyWinner = countyResults => {
    const winner = Object.keys(countyResults).sort(
      (a, b) => countyResults[b] - countyResults[a],
    )[0];
    return this.props.candidates.entities.candidates[winner].attributes.party;
  };

  render() {
    return (
      <Segment>
        {this.props.topTwo.length && (
          <StateResultTable
            style={{ overflow: 'hidden' }}
            data={this.makeData()}
            handleSort={this.handleSort}
            column={this.state.column}
            direction={this.state.direction}
          />
        )}
      </Segment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSortedCountyResults: keys => dispatch(setSortedCountyResults(keys)),
});

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  countyResults: state.results.countyResults,
  stateResults: state.results.stateResults,
  topTwo: state.results.topTwo,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateResultTableContainer);
