import React from 'react';
import { Card, Image } from 'semantic-ui-react';

const colors = { democrat: 'blue', republican: 'red' };

const ToplinesCard = ({
  candidate, votes, total, winner,
}) => (
  <Card>
    {candidate.id === winner ? (
      <Image
        fluid
        label={{
          color: colors[candidate.attributes.party],
          icon: 'winner',
          corner: 'left',
        }}
        src={candidate.attributes.image}
      />
    ) : (
      <Image src={candidate.attributes.image} />
    )}
    <Card.Content>
      <Card.Header>{candidate.attributes.name}</Card.Header>
      <Card.Meta>{candidate.attributes.party}</Card.Meta>
      <Card.Description>
        {`${votes.toLocaleString()} (${Math.round((votes / total) * 100)}%)`}
      </Card.Description>
    </Card.Content>
  </Card>
);

export default ToplinesCard;
