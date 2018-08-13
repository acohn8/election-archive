import React from 'react';
import { Card, Image } from 'semantic-ui-react';

const StateCard = props => (
  <Card
    href={`/states/${props.name
      .split(' ')
      .join('-')
      .toLowerCase()}/us-president`}
  >
    <Image fluid src={props.image} style={{ height: '200px' }} />
    <Card.Content>
      <Card.Header>{props.name}</Card.Header>
    </Card.Content>
  </Card>
);

export default StateCard;
