import React from 'react';
import { Card, Image, Statistic, Label, Header } from 'semantic-ui-react';

const colors = {
  democratic: 'blue',
  republican: 'red',
  libertarian: 'yellow',
  green: 'green',
  'working families': 'purple',
};

const ToplinesCard = ({
  candidate, votes, total, winner, children,
}) => (
  <Card
    color={colors[candidate.attributes.party]}
    style={{
      minHeight: 400,
    }}
  >
    <Card.Content>
      {parseInt(candidate.id, 10) === winner && (
        <Label color={colors[candidate.attributes.party]} corner="right" icon="check" />
      )}
      <Card.Header as="h4">
        {candidate.attributes.image !== null && (
          <Image rounded size="mini" src={candidate.attributes.image} spaced="right" />
        )}
        {candidate.attributes.name}
      </Card.Header>
    </Card.Content>
    <Card.Content>
      {/* <Card.Meta>{candidate.attributes.party}</Card.Meta> */}
      <Card.Description>
        <Header as="h4">Results</Header>
        <Statistic.Group size="mini" widths="two">
          <Statistic color={colors[candidate.attributes.party]}>
            <Statistic.Value>{Math.round((votes / total) * 100)}</Statistic.Value>
            <Statistic.Label>Percent</Statistic.Label>
          </Statistic>
          <Statistic color={colors[candidate.attributes.party]}>
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
