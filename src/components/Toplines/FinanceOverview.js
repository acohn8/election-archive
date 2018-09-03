import React from 'react';
import { List } from 'semantic-ui-react';

const FinanceOverview = ({ campaignFinance }) => (
  <List relaxed="very">
    <List.Item>
      <List.Icon name="dollar sign" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>Receipts</List.Header>
        <List.Description>
          {campaignFinance.total_receipts === undefined
            ? 'Not available'
            : `$${Math.round(campaignFinance.total_receipts).toLocaleString()}`}
        </List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name="payment" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>Disbursements</List.Header>
        <List.Description>
          {campaignFinance.total_disbursements === undefined
            ? 'Not available'
            : `$${Math.round(campaignFinance.total_disbursements).toLocaleString()}`}
        </List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name="money bill alternate outline" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>Ending Cash</List.Header>
        <List.Description>
          {campaignFinance.end_cash === undefined
            ? 'Not available'
            : `$${Math.round(campaignFinance.end_cash).toLocaleString()}`}
        </List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name="balance scale" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>Debts</List.Header>
        <List.Description>
          {campaignFinance.debts_owed === undefined
            ? 'Not available'
            : `$${Math.round(campaignFinance.debts_owed).toLocaleString()}`}
        </List.Description>
      </List.Content>
    </List.Item>
  </List>
);

export default FinanceOverview;
