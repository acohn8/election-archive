import React from 'react';
import { Table, TableRow, TableHeaderCell } from 'semantic-ui-react';

const colors = {
  democratic: 'rgba(32,133,208,.2)',
  republican: 'rgba(219,40,40,.2)',
  libertarian: 'rgba(251,189,9, .2)',
  other: 'rgba(100,53,201, .2)',
};

const StateResultTable = ({
  direction, column, data, handleSort, candidateIds, value,
}) => (
  <div style={{ overflowX: 'auto', width: '100%', height: '100%' }}>
    {data.length > 0 && (
      <Table sortable celled unstackable structured size="small" compact>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={() => handleSort('name')}
              rowSpan="2"
            >
              County
            </Table.HeaderCell>
            {candidateIds.map(candidateId => (
              <Table.HeaderCell key={candidateId} colSpan="2">
                {data[0].results[candidateId].name}
              </Table.HeaderCell>
            ))}
          </Table.Row>
          <TableRow textAlign="center">
            {candidateIds.map(candidateId => [
              <TableHeaderCell
                key={`${candidateId}vc`}
                sorted={column === candidateId && value === 'votes' ? direction : null}
                onClick={() => handleSort(candidateId, 'votes')}
              >
                Votes
              </TableHeaderCell>,
              <TableHeaderCell
                key={`${candidateId}pc`}
                sorted={column === candidateId && value === 'percent' ? direction : null}
                onClick={() => handleSort(candidateId, 'percent')}
              >
                Percent
              </TableHeaderCell>,
            ])}
          </TableRow>
        </Table.Header>
        <Table.Body>
          {data.map(county => (
            <Table.Row key={county.id} textAlign="center">
              <Table.Cell>{county.name}</Table.Cell>
              {candidateIds.map(candidateId =>
                  (county.winnerParty === county.results[candidateId].party
                    ? [
                      <Table.Cell
                        key={`${county.name}${candidateId}v`}
                        style={{ backgroundColor: colors[county.winnerParty] }}
                      >
                        {county.results[candidateId].total
                            ? county.results[candidateId].total.toLocaleString()
                            : 0}
                      </Table.Cell>,
                      <Table.Cell
                        key={`${county.name}${candidateId}p`}
                        style={{ backgroundColor: colors[county.winnerParty] }}
                      >
                        {county.results[candidateId].percent
                            ? `${Math.round(county.results[candidateId].percent * 100)}%`
                            : '0%'}
                      </Table.Cell>,
                      ]
                    : [
                      <Table.Cell key={`${county.name}${candidateId}v`}>
                        {county.results[candidateId].total
                            ? county.results[candidateId].total.toLocaleString()
                            : 0}
                      </Table.Cell>,
                      <Table.Cell key={`${county.name}${candidateId}p`}>
                        {county.results[candidateId].percent
                            ? `${Math.round(county.results[candidateId].percent * 100)}%`
                            : '0%'}
                      </Table.Cell>,
                      ]))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </div>
);

export default StateResultTable;
