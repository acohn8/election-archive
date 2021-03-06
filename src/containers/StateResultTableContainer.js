import React from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'semantic-ui-react';
import StateResultTable from '../components/Table/StateResultTable';
import { setSortedResults } from '../redux/actions/resultActions';
import formatTableData from '../util/FormatTableData';
import convertToPercent from '../util/ConvertToPercent';
import numericalSort from '../util/NumericalSort';
import resultTotals from '../util/ResultTotals';
import StateTableHeader from '../components/StateTableHeader/StateTableHeader';
import ExportDropdown from '../components/Table/ExportDropdown';

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
    const allData = formatTableData('countyResults');
    const displayData = allData.slice(pageMinusOne * 10, pageMinusOne * 10 + 10);
    const statewideTotal = Object.values(this.props.statewideResults).reduce((sum, n) => sum + n);
    const toplines = resultTotals(allData, statewideTotal);
    const { activePage } = this.state;
    return (
      <div>
        <StateTableHeader selectedTable="results">
          {this.props.selectedOfficeId !== 322 && <ExportDropdown />}
        </StateTableHeader>
        <StateResultTable
          data={displayData}
          candidateIds={this.props.candidates.result}
          handleSort={this.handleSort}
          column={this.state.column}
          value={this.state.value}
          direction={this.state.direction}
          geography={'County'}
          toplines={toplines}
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
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSortedResults: (keys, geography) => dispatch(setSortedResults(keys, geography)),
});

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  countyResults: state.results.countyResults,
  statewideResults: state.results.stateResults,
  selectedOfficeId: state.results.officeInfo.id,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateResultTableContainer);
