import React from 'react';
import { Card, Image, Label, Statistic } from 'semantic-ui-react';

const colors = {
  democratic: 'blue',
  republican: 'red',
  libertarian: 'yellow',
  green: 'green',
  'working families': 'purple',
};

const ToplinesCard = ({
  candidate, votes, winner, total, children,
}) => (
  <Card
    color={colors[candidate.party]}
    style={{
      minHeight: 400,
    }}
  >
    <Card.Content>
      {parseInt(candidate.id, 10) === winner && (
        <Label color={colors[candidate.party]} corner="right" icon="check" />
      )}
      <Card.Header as="h4">
        {candidate.image !== null && (
          <Image rounded size="mini" src={candidate.image} spaced="right" />
        )}
        {candidate.name}
      </Card.Header>
      <Card.Description>
        <Statistic.Group size="mini" widths="two">
          <Statistic color={colors[candidate.party]}>
            <Statistic.Value>{Math.round((votes / total) * 100)}</Statistic.Value>
            <Statistic.Label>Percent</Statistic.Label>
          </Statistic>
          <Statistic color={colors[candidate.party]}>
            <Statistic.Value>{votes.toLocaleString()}</Statistic.Value>
            <Statistic.Label>Votes</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Card.Description>
    </Card.Content>
    {children}
  </Card>
);

export default ToplinesCard;
