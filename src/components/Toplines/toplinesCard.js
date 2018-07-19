import React from 'react';
import { Card, Image } from 'semantic-ui-react';

const ToplinesCard = ({ candidate }) => (
  <Card>
    <Image src={candidate.image} />
    <Card.Content>
      <Card.Header>{candidate.name}</Card.Header>
      <Card.Meta>{candidate.party}</Card.Meta>
      <Card.Description>{`${candidate.votes} (${candidate.share * 100}%)`}</Card.Description>
    </Card.Content>
  </Card>
);

export default ToplinesCard;
