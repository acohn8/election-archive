import React from 'react';
import { connect } from 'react-redux';
import { Segment, Pagination } from 'semantic-ui-react';
import StateResultTable from '../components/Table/StateResultTable';
import { setSortedResults } from '../redux/actions/resultActions';
import formatTableData from '../util/FormatTableData';
import convertToPercent from '../util/ConvertToPercent';
import numericalSort from '../util/NumericalSort';

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
        () => this.props.setSortedResults(newData, 'county'),
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
      () => this.props.setSortedResults(previousSort.reverse(), 'county'),
    );
  };

  sortColumns = (column, value) => {
    const countyKeys = this.props.countyResults.result.slice();
    const countyData = this.props.countyResults.entities.results;
    if (column === 'name') {
      return countyKeys.sort((a, b) => countyData[a][column].localeCompare(countyData[b][column]));
    } else if (value === 'votes') {
      return numericalSort(countyKeys, countyData, column);
    } else if (value === 'percent') {
      const percentResults = convertToPercent(countyData, countyKeys);
      return numericalSort(countyKeys, percentResults, column);
    }
  };

  handleInputChange = (e, { value }) => this.setState({ activePage: value });

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

  render() {
    const pageMinusOne = this.state.activePage - 1;
    const data = formatTableData('countyResults').slice(pageMinusOne * 10, pageMinusOne * 10 + 10);

    const { activePage } = this.state;
    return (
      <Segment style={{ minHeight: 430, overflow: 'hidden' }} basic>
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
  setSortedResults: (keys, geography) => dispatch(setSortedResults(keys, geography)),
});

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  countyResults: state.results.countyResults,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateResultTableContainer);
