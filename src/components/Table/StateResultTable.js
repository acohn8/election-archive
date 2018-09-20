import React from 'react';
import { Table, TableRow, TableHeaderCell } from 'semantic-ui-react';

import PartyColorCircle from '../Ui/ColorCircle';
import CountyModal from '../CountyModal/CountyModal';

const colors = {
  democratic: 'rgba(32,133,208,.2)',
  republican: 'rgba(219,40,40,.2)',
  libertarian: 'rgba(251,189,9, .2)',
  other: 'rgba(100,53,201, .2)',
};

const totalColors = {
  democratic: 'rgb(32,133,208)',
  republican: 'rgb(219,40,40)',
  libertarian: 'rgb(251,189,9)',
  other: 'rgb(100,53,201)',
};

const StateResultTable = ({
  direction,
  column,
  data,
  handleSort,
  candidateIds,
  value,
  geography,
  toplines,
}) => (
  <div style={{ overflowX: 'auto', height: '100%' }}>
    {data.length > 0 && (
      <Table sortable unstackable structured size="small" celled>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={() => handleSort('name')}
              rowSpan="2"
              width={3}
            >
              {geography}
            </Table.HeaderCell>
            {candidateIds.map(candidateId => (
              <Table.HeaderCell key={candidateId} colSpan="2">
                <PartyColorCircle color={totalColors[data[0].results[candidateId].party]} />
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
          {data.map(geo => (
            <Table.Row key={geo.id} textAlign="center">
              {geography === 'Precinct' ? (
                <Table.Cell>{geo.name}</Table.Cell>
              ) : (
                <CountyModal countyName={geo.name} countyId={geo.id} title={geo.title} />
              )}
              {candidateIds.map(candidateId =>
                  (geo.winnerParty === geo.results[candidateId].party
                    ? [
                      <Table.Cell
                        key={`${geo.name}${candidateId}v`}
                        style={{ backgroundColor: colors[geo.winnerParty] }}
                      >
                        {geo.results[candidateId].total
                            ? geo.results[candidateId].total.toLocaleString()
                            : 0}
                      </Table.Cell>,
                      <Table.Cell
                        key={`${geo.name}${candidateId}p`}
                        style={{ backgroundColor: colors[geo.winnerParty] }}
                      >
                        {geo.results[candidateId].percent
                            ? `${Math.round(geo.results[candidateId].percent * 100)}%`
                            : '0%'}
                      </Table.Cell>,
                      ]
                    : [
                      <Table.Cell key={`${geo.name}${candidateId}v`}>
                        {geo.results[candidateId].total
                            ? geo.results[candidateId].total.toLocaleString()
                            : 0}
                      </Table.Cell>,
                      <Table.Cell key={`${geo.name}${candidateId}p`}>
                        {geo.results[candidateId].percent
                            ? `${Math.round(geo.results[candidateId].percent * 100)}%`
                            : '0%'}
                      </Table.Cell>,
                      ]))}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row textAlign="center">
            <Table.HeaderCell />
            {candidateIds.map(candidateId =>
                (toplines[candidateId].winner
                  ? [
                    <Table.HeaderCell
                      key={`${candidateId}totalVotes`}
                      style={{
                          backgroundColor: totalColors[data[0].results[candidateId].party],
                          color: 'white',
                        }}
                    >
                      <strong>
                        {toplines[candidateId].votes
                            ? toplines[candidateId].votes.toLocaleString()
                            : 0}
                      </strong>
                    </Table.HeaderCell>,
                    <Table.HeaderCell
                      key={`${candidateId}totalPercent`}
                      style={{
                          backgroundColor: totalColors[data[0].results[candidateId].party],
                          color: 'white',
                        }}
                    >
                      <strong>
                        {toplines[candidateId].percent
                            ? `${Math.round(toplines[candidateId].percent * 100)}%`
                            : '0%'}
                      </strong>
                    </Table.HeaderCell>,
                    ]
                  : [
                    <Table.HeaderCell key={`${candidateId}totalVotes`}>
                      <strong>
                        {toplines[candidateId].votes
                            ? toplines[candidateId].votes.toLocaleString()
                            : 0}
                      </strong>
                    </Table.HeaderCell>,
                    <Table.HeaderCell key={`${candidateId}totalPercent`}>
                      <strong>
                        {toplines[candidateId].percent
                            ? `${Math.round(toplines[candidateId].percent * 100)}%`
                            : '0%'}
                      </strong>
                    </Table.HeaderCell>,
                    ]))}
          </Table.Row>
        </Table.Footer>
      </Table>
    )}
  </div>
);

export default StateResultTable;
