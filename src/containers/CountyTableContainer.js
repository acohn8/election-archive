import React from 'react';
import { connect } from 'react-redux';
import { Segment, Pagination } from 'semantic-ui-react';
import StateResultTable from '../components/Table/StateResultTable';
import { setSortedResults } from '../redux/actions/resultActions';
import formatTableData from '../util/FormatTableData';
import convertToPercent from '../util/ConvertToPercent';
import numericalSort from '../util/NumericalSort';
import resultTotals from '../util/ResultTotals';

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
        () => this.props.setSortedResults(newData, 'precinct'),
      );
      return;
    }
    const previousSort = this.props.precinctResults.result.slice();
    this.setState(
      {
        column: clickedColumn,
        value: value,
        direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
      },
      () => this.props.setSortedResults(previousSort.reverse(), 'precinct'),
    );
  };

  sortColumns = (column, value) => {
    const precinctKeys = this.props.precinctResults.result.slice();
    const precinctData = this.props.precinctResults.entities.results;
    if (column === 'name') {
      return precinctKeys.sort((a, b) =>
        precinctData[a][column].localeCompare(precinctData[b][column]),
      );
    } else if (value === 'votes') {
      return numericalSort(precinctKeys, precinctData, column);
    } else if (value === 'percent') {
      const percentResults = convertToPercent(precinctData, precinctKeys);
      return numericalSort(precinctKeys, percentResults, column);
    }
  };

  handleInputChange = (e, { value }) => this.setState({ activePage: value });

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

  render() {
    const pageMinusOne = this.state.activePage - 1;
    const { activePage } = this.state;
    const allData = formatTableData('precinctResults');
    const displayData = allData.slice(pageMinusOne * 10, pageMinusOne * 10 + 10);
    const countyTotal = Object.values(
      this.props.countyResults.entities.results[this.props.countyId].results,
    ).reduce((sum, n) => sum + n);
    const toplines = resultTotals(allData, countyTotal);
    return (
      <Segment style={{ minHeight: 430, overflow: 'hidden' }} basic>
        <StateResultTable
          data={displayData}
          candidateIds={this.props.candidates.result}
          handleSort={this.handleSort}
          column={this.state.column}
          value={this.state.value}
          direction={this.state.direction}
          geography={'Precinct'}
          toplines={toplines}
        />
        <Pagination
          secondary
          pointing
          firstItem={null}
          lastItem={null}
          fluid
          activePage={activePage}
          totalPages={Math.ceil(this.props.precinctResults.result.length / 10)}
          onPageChange={this.handlePaginationChange}
          boundaryRange={1}
          style={{ padding: 0, margin: 0 }}
        />
      </Segment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSortedResults: (keys, geography) => dispatch(setSortedResults(keys, geography)),
});

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  precinctResults: state.results.precinctResults,
  countyResults: state.results.countyResults,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateResultTableContainer);
