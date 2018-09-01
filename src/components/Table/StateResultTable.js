import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

const colors = {
  democratic: 'rgb(32,133,208,.2)',
  republican: 'rgb(219,40,40,.2)',
  libertarian: 'rgb(251,189,9, .2)',
  other: 'rgb(100,53,201, .2)',
};

class StateResultTable extends Component {
  // state = {
  //   column: null,
  //   data: [],
  //   direction: null,
  // };

  // handleSort = clickedColumn => () => {
  //   const data = this.sortColumns(clickedColumn);
  //   if (this.state.column !== clickedColumn) {
  //     this.setState({
  //       column: clickedColumn,
  //       data: data,
  //       direction: 'ascending',
  //     });
  //     return;
  //   }

  //   this.setState({
  //     column: clickedColumn,
  //     data: this.state.data.reverse(),
  //     direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
  //   });
  // };

  // sortColumns = column => {
  //   if (column === 'name') {
  //     return this.state.data.slice().sort((a, b) => a[column].localeCompare(b[column]));
  //   } else {
  //     return this.state.data.slice().sort((a, b) => b[column].total - a[column].total);
  //   }
  // };

  render() {
    // const { column, direction } = this.state;
    return (
      <div
        style={{
          overflow: 'auto',
          height: 375,
        }}
      >
        {this.props.data.length > 0 && (
          <Table sortable celled fixed unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  // sorted={column === 'name' ? direction : null}
                  onClick={() => this.props.sortColumns('name')}
                >
                  County
                </Table.HeaderCell>
                {Object.keys(this.props.data[0])
                  .filter(key => ['first', 'second', 'other'].includes(key))
                  .map(position => (
                    <Table.HeaderCell
                      key={this.props.data[0][position].name}
                      // sorted={column === position ? direction : null}
                      // onClick={this.handleSort(position)}
                    >
                      {this.props.data[0][position].name}
                    </Table.HeaderCell>
                  ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.data.map(county => (
                <Table.Row key={county.id}>
                  <Table.Cell>{county.name}</Table.Cell>
                  {Object.keys(county)
                    .filter(key => ['first', 'second', 'other'].includes(key))
                    .map(position =>
                        (county.winnerParty === county[position].party ? (
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
                        )))}
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
  topTwo: state.results.topTwo,
});

export default connect(mapStateToProps)(StateResultTable);
