import React from 'react';
import { Card } from 'semantic-ui-react';
import LazyImage from './LazyImage';

const StateCard = props => (
  <Card
    href={`/states/${props.name
      .split(' ')
      .join('-')
      .toLowerCase()}/us-president`}
  >
    <LazyImage fluid src={props.image} style={{ height: '200px' }} />
    <Card.Content>
      <Card.Header>{props.name}</Card.Header>
    </Card.Content>
  </Card>
);

export default StateCard;
