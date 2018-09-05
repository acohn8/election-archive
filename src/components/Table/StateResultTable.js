import React from 'react';
import { Table, Pagination } from 'semantic-ui-react';

const colors = {
  democratic: 'rgba(32,133,208,.2)',
  republican: 'rgba(219,40,40,.2)',
  libertarian: 'rgba(251,189,9, .2)',
  other: 'rgba(100,53,201, .2)',
};

const StateResultTable = ({
  direction, column, data, handleSort, candidateIds,
}) => (
  <div>
    {data.length > 0 && (
      <Table sortable celled unstackable fixed size="small" compact style={{ minHeight: 325 }}>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={() => handleSort('name')}
            >
              County
            </Table.HeaderCell>
            {candidateIds.map(candidateId => (
              <Table.HeaderCell
                key={candidateId}
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
              {candidateIds.map(candidateId =>
                  (county.winnerParty === county.results[candidateId].party ? (
                    <Table.Cell
                      key={`${county.name}${candidateId}`}
                      style={{ backgroundColor: colors[county.winnerParty] }}
                    >
                      {county.results[candidateId].total.toLocaleString()}
                    </Table.Cell>
                  ) : (
                    <Table.Cell key={`${county.name}${candidateId}`}>
                      {county.results[candidateId].total
                        ? county.results[candidateId].total.toLocaleString()
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
