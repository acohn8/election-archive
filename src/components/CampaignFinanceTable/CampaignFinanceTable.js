import React from 'react';
import { Table } from 'semantic-ui-react';
import getFinanceCellColor from '../../util/CompareFinance';
import StateTableHeader from '../StateTableHeader/StateTableHeader';
import PartyColorCircle from '../Ui/ColorCircle';

const colors = {
  democratic: '#2085D0',
  republican: '#DB2828',
  libertarian: '#FBBD09',
  other: '#6435C9',
};

const FinanceOverview = ({ candidates }) => {
  const filteredCandidates = candidates.result.filter(id => id !== 'other' && candidates.entities.candidates[id].finance_data);
  const candidateEntities = candidates.entities.candidates;
  return (
    <div>
      <StateTableHeader selectedTable="finance" />
      <div style={{ overflowX: 'auto', height: '100%' }}>
        <Table structured size="small" celled unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2} />
              <Table.HeaderCell width={2} />
              {filteredCandidates.map(id => (
                <Table.HeaderCell textAlign="center" key={`${id}name`}>
                  <PartyColorCircle color={colors[candidateEntities[id].party]} />{' '}
                  {candidateEntities[id].name}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell rowSpan="3">Receipts</Table.Cell>
              <Table.Cell textAlign="center">Total Receipts</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  textAlign="center"
                  key={`${id}totalrec`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'total_receipts') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.total_receipts).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell textAlign="center">Total from Individuals</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  textAlign="center"
                  key={`${id}indv`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'total_from_individuals') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.total_from_individuals).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell textAlign="center">Total from PACs</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  textAlign="center"
                  key={`${id}totalpac`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'total_from_pacs') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.total_from_pacs).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan="2">Disbursements</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  textAlign="center"
                  key={`${id}disb`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'total_disbursements') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.total_disbursements).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan="2">Ending Cash</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  textAlign="center"
                  key={`${id}cash`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'end_cash') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.end_cash).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan="2">Debts</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  textAlign="center"
                  key={`${id}debt`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'debts_owed') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.debts_owed).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell rowSpan="2">Outside Spending</Table.Cell>
              <Table.Cell textAlign="center">Coordinated</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  textAlign="center"
                  key={`${id}coordspending`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'coordinated_expenditures') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.coordinated_expenditures).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell textAlign="center">Independent</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  textAlign="center"
                  key={`${id}ie_spending`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'independent_expenditures') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.independent_expenditures).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default FinanceOverview;
