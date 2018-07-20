import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

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

  componentDidUpdate() {
    if (this.props.results.counties !== undefined && this.props.results.counties.length > 0) {
      this.formatData();
    }
  }

  formatData = () => {
    console.log(this.props.results.counties);
    const data = this.props.results.counties.forEach(county =>
      county.results.map(results => ({ ...results, name: county.name })),
    );
    console.log(data);
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
      <Table sortable celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={this.handleSort('name')}
            >
              Name
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(data, ({ age, gender, name }) => (
            <Table.Row key={name}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{age}</Table.Cell>
              <Table.Cell>{gender}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  results: state.results.electionResults,
});

export default connect(mapStateToProps)(ResultsTable);
