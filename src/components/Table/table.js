import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

const colors = {
  clinton: 'blue',
  trump: 'red',
  johnson: 'yellow',
  stein: 'green',
  other: 'purple',
};

class ResultsTable extends Component {
  state = {
    column: null,
    data: [],
    direction: null,
  };

  componentDidMount() {
    if (this.props.results.counties !== undefined && this.props.results.counties.length > 0) {
      this.formatData();
    }
  }

  formatData = () => {
    const electionData = [];
    this.props.results.counties.forEach(county =>
      county.results.forEach(results => electionData.push({ name: county.name, ...results })),
    );
    this.setState({ data: electionData });
  };

  candidates = () => {
    return Object.keys(this.state.data[0]).filter(k => k !== 'name');
  };

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
        {this.state.data.length > 0 && (
          <Table sortable celled fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'name' ? direction : null}
                  onClick={this.handleSort('name')}
                >
                  Name
                </Table.HeaderCell>
                {this.candidates().map(key => (
                  <Table.HeaderCell
                    sorted={column === { key } ? direction : null}
                    onClick={this.handleSort({ key })}
                  >
                    {key}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map(county => (
                <Table.Row key={county.name}>
                  <Table.Cell>{county.name}</Table.Cell>
                  {this.candidates().map(candidate => <Table.Cell>{county[candidate]}</Table.Cell>)}
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
