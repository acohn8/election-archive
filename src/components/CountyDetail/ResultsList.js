import React from 'react';
import { Image, List } from 'semantic-ui-react';

const ResultsList = ({ candidate }) => (
  <List.Item>
    <Image avatar src={candidate.candidate.attributes.image} />
    <List.Content>
      <List.Header>{candidate.candidate.attributes.name}</List.Header>
      {candidate.votes.toLocaleString()}
    </List.Content>
  </List.Item>
);

export default ResultsList;
