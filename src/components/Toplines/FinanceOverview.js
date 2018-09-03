import React from 'react';
import { List } from 'semantic-ui-react';

const FinanceOverview = ({ campaignFinance }) => (
  <List relaxed size="large">
    <List.Item>
      <List.Icon name="dollar sign" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>Receipts</List.Header>
        {campaignFinance === undefined
          ? 'Not available'
          : `$${Math.round(campaignFinance.total_receipts).toLocaleString()}`}
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name="payment" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>Disbursements</List.Header>
        {campaignFinance === undefined
          ? 'Not available'
          : `$${Math.round(campaignFinance.total_disbursements).toLocaleString()}`}
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name="balance scale" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>Ending Cash</List.Header>
        {campaignFinance === undefined
          ? 'Not available'
          : `$${Math.round(campaignFinance.end_cash).toLocaleString()}`}
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name="money bill alternate" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>Debts</List.Header>
        {campaignFinance === undefined
          ? 'Not available'
          : `$${Math.round(campaignFinance.debts_owed).toLocaleString()}`}
      </List.Content>
    </List.Item>
  </List>
);

export default FinanceOverview;
