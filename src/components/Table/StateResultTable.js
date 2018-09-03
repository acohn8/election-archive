import React from 'react';
import { Table } from 'semantic-ui-react';

const colors = {
  democratic: 'rgb(32,133,208,.2)',
  republican: 'rgb(219,40,40,.2)',
  libertarian: 'rgb(251,189,9, .2)',
  other: 'rgb(100,53,201, .2)',
};

const StateResultTable = ({
  direction, column, data, handleSort,
}) => (
  <div
    style={{
      overflow: 'auto',
      height: 375,
    }}
  >
    {data.length > 0 && (
      <Table sortable celled unstackable fixed basic>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={() => handleSort('name')}
            >
              County
            </Table.HeaderCell>
            {console.log(data[0].results)}
            {Object.keys(data[0].results).map(candidateId => (
              <Table.HeaderCell
                key={data[0].results[candidateId].name}
                sorted={column === candidateId ? direction : null}
                onClick={() => handleSort(candidateId)}
              >
                {data[0].results[candidateId].name}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(county => (
            <Table.Row key={county.id} textAlign="center">
              <Table.Cell>{county.name}</Table.Cell>
              {Object.keys(county.results).map(position =>
                  (county.winnerParty === county.results[position].party ? (
                    <Table.Cell
                      key={`${county.name}${position}`}
                      style={{ backgroundColor: colors[county.winnerParty] }}
                    >
                      {county.results[position].total.toLocaleString()}
                    </Table.Cell>
                  ) : (
                    <Table.Cell key={`${county.name}${position}`}>
                      {county.results[position]
                        ? county.results[position].total.toLocaleString()
                        : 0}
                    </Table.Cell>
                  )))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </div>
);

export default StateResultTable;
