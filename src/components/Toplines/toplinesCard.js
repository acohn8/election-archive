import React from 'react';
import { connect } from 'react-redux';
import { Card, Image, Statistic } from 'semantic-ui-react';

import CampaignFinanceTable from './financeTable';

const colors = {
  democratic: 'blue',
  republican: 'red',
  libertarian: 'yellow',
  green: 'green',
  'working families': 'purple',
};

const ToplinesCard = ({
  candidate, votes, total, winner, financeData,
}) => (
  <Card color={colors[candidate.attributes.party]}>
    <Card.Content>
      {parseInt(candidate.id, 10) === winner ? (
        <Image floated="right" size="mini" src={candidate.attributes.image} />
      ) : (
        <Image src={candidate.attributes.image} floated="right" size="mini" disabled />
      )}
      <Card.Header>{candidate.attributes.name}</Card.Header>
      <Card.Meta>{candidate.attributes.party}</Card.Meta>
      <Card.Description style={{ textAlign: 'center' }}>
        <Statistic size="tiny" color={colors[candidate.attributes.party]}>
          <Statistic.Value>{votes.toLocaleString()}</Statistic.Value>
          <Statistic.Label>Votes</Statistic.Label>
        </Statistic>
        <Statistic size="tiny" color={colors[candidate.attributes.party]}>
          <Statistic.Value>{Math.round((votes / total) * 100)}</Statistic.Value>
          <Statistic.Label>Percent</Statistic.Label>
        </Statistic>
      </Card.Description>
    </Card.Content>

    {Object.keys(financeData) && (
      <Card.Content>
        {candidate.attributes['fec-id'] !== null ? (
          <CampaignFinanceTable candidateId={candidate.id} disabled={false} />
        ) : (
          <CampaignFinanceTable candidateId={candidate.id} disabled />
        )}
      </Card.Content>
    )}
  </Card>
);

const mapStateToProps = state => ({
  financeData: state.campaignFinance.financeData,
});

export default connect(mapStateToProps)(ToplinesCard);
