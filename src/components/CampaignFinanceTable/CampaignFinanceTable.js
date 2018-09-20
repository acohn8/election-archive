import React from 'react';
import { Table, Header } from 'semantic-ui-react';
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
      <div
        style={{
          overflowX: 'auto',
          height: '100%',
        }}
      >
        <Table structured padded unstackable celled size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="2">Overview</Table.HeaderCell>
              {filteredCandidates.map(id => (
                <Table.HeaderCell key={`${id}name`}>
                  <PartyColorCircle color={colors[candidateEntities[id].party]} />
                  {candidateEntities[id].name}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell rowSpan="3" textAlign="left">
                <Header as="h4">Receipts</Header>
              </Table.Cell>
              <Table.Cell>Total Receipts</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  key={`${id}totalrec`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'total_receipts') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.total_receipts).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell>From Individuals</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  key={`${id}indv`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'total_from_individuals') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.total_from_individuals).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell>From PACs</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  key={`${id}totalpac`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'total_from_pacs') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.total_from_pacs).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan="2" textAlign="left">
                <Header as="h4">Disbursements</Header>
              </Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  key={`${id}disb`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'total_disbursements') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.total_disbursements).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan="2" textAlign="left">
                <Header as="h4">Ending Cash</Header>
              </Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  key={`${id}cash`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'end_cash') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.end_cash).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan="2" textAlign="left">
                <Header as="h4">Debts</Header>
              </Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  key={`${id}debt`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'debts_owed') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.debts_owed).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell rowSpan="2" textAlign="left">
                <Header as="h4">Outside Spending</Header>
              </Table.Cell>
              <Table.Cell>Coordinated</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
                  key={`${id}coordspending`}
                  style={{ backgroundColor: getFinanceCellColor(id, 'coordinated_expenditures') }}
                >
                  {`$${Math.round(candidateEntities[id].finance_data.coordinated_expenditures).toLocaleString()}`}
                </Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell>Independent</Table.Cell>
              {filteredCandidates.map(id => (
                <Table.Cell
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
