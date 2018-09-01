import React from 'react';
import { Table } from 'semantic-ui-react';

const CampaignFinanceTable = ({ campaignFinance, disabled }) => (
  <div>
    <Table basic="very" celled stackable>
      <Table.Body>
        <Table.Row disabled={disabled}>
          <Table.Cell collapsing>Receipts</Table.Cell>
          <Table.Cell textAlign="center">
            {campaignFinance === undefined
              ? 'Not available'
              : `$${Math.round(campaignFinance.total_receipts).toLocaleString()}`}
          </Table.Cell>
        </Table.Row>
        <Table.Row disabled={disabled}>
          <Table.Cell>Disbursements</Table.Cell>
          <Table.Cell textAlign="center">
            {campaignFinance === undefined
              ? 'Not available'
              : `$${Math.round(campaignFinance.total_disbursements).toLocaleString()}`}
          </Table.Cell>
        </Table.Row>
        <Table.Row disabled={disabled}>
          <Table.Cell>Ending Cash</Table.Cell>
          <Table.Cell textAlign="center">
            {campaignFinance === undefined
              ? 'Not available'
              : `$${Math.round(campaignFinance.end_cash).toLocaleString()}`}
          </Table.Cell>
        </Table.Row>
        <Table.Row disabled={disabled}>
          <Table.Cell>Debts</Table.Cell>
          <Table.Cell textAlign="center">
            {campaignFinance === undefined
              ? 'Not available'
              : `$${Math.round(campaignFinance.debts_owed).toLocaleString()}`}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </div>
);

export default CampaignFinanceTable;
