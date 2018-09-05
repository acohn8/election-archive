import React from 'react';
import { connect } from 'react-redux';
import { Segment, Pagination } from 'semantic-ui-react';
import StateResultTable from '../components/Table/StateResultTable';
import { setSortedCountyResults } from '../redux/actions/resultActions';
import formatTableData from '../util/FormatTableData';
import convertToPercent from '../util/ConvertToPercent';

class StateResultTableContainer extends React.Component {
  state = {
    column: null,
    value: null,
    direction: null,
    activePage: 1,
  };

  handleSort = (clickedColumn, value = null) => {
    const newData = this.sortColumns(clickedColumn, value);
    if (this.state.column !== clickedColumn) {
      this.setState(
        {
          column: clickedColumn,
          value: value,
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
        value: value,
        direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
      },
      () => this.props.setSortedCountyResults(previousSort.reverse()),
    );
  };

  sortColumns = (column, value) => {
    const countyKeys = this.props.countyResults.result.slice();
    const countyData = this.props.countyResults.entities.results;
    if (column === 'name') {
      return countyKeys.sort((a, b) => countyData[a][column].localeCompare(countyData[b][column]));
    } else if (value === 'votes') {
      return this.numericalSort(countyKeys, countyData, column);
    } else if (value === 'percent') {
      const percentResults = convertToPercent(countyData, countyKeys);
      return this.numericalSort(countyKeys, percentResults, column);
    }
  };

  numericalSort = (keys, entities, column) => {
    const zeroVoteCounties = keys.slice().filter(key => !entities[key].results[column]);
    const countiesWithVotes = keys.slice().filter(key => entities[key].results[column]);
    const sortedCounties = countiesWithVotes.sort(
      (a, b) => entities[b].results[column] - entities[a].results[column],
    );
    return sortedCounties.concat(zeroVoteCounties);
  };

  handleInputChange = (e, { value }) => this.setState({ activePage: value });

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

  render() {
    const pageMinusOne = this.state.activePage - 1;
    const data = formatTableData().slice(pageMinusOne * 10, pageMinusOne * 10 + 10);

    const { activePage } = this.state;
    return (
      <Segment style={{ minHeight: 430 }}>
        <StateResultTable
          data={data}
          candidateIds={this.props.candidates.result}
          handleSort={this.handleSort}
          column={this.state.column}
          value={this.state.value}
          direction={this.state.direction}
        />
        <Pagination
          secondary
          pointing
          firstItem={null}
          lastItem={null}
          fluid
          activePage={activePage}
          totalPages={Math.ceil(this.props.countyResults.result.length / 10)}
          onPageChange={this.handlePaginationChange}
          boundaryRange={1}
          style={{ padding: 0, margin: 0 }}
        />
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateResultTableContainer);
