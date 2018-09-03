import React from 'react';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import StateResultTable from '../components/Table/StateResultTable';
import { setSortedCountyResults } from '../redux/actions/resultActions';
import formatTableData from '../util/TableData/FormatTableData';

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
      return countyKeys.sort(
        (a, b) => countyData[b].results[column] - countyData[a].results[column],
      );
    }
  };

  render() {
    const data = formatTableData();
    return (
      <Segment>
        <StateResultTable
          style={{ overflow: 'hidden' }}
          data={data}
          candidateIds={this.props.candidates.result}
          handleSort={this.handleSort}
          column={this.state.column}
          direction={this.state.direction}
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
