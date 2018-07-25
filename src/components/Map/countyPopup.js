import React from 'react';
import { List, Segment, Header } from 'semantic-ui-react';

const Tooltip = ({ features }) => {
  const feature = features.find(feature => feature.layer.id === 'dem-margin');

  return (
    <List>
      <Segment inverted>
        <Header as="h4"> {feature.properties.NAME}</Header>
        <List.Item>Democrat: {feature.properties.demVotes.toLocaleString()}</List.Item>
        <List.Item>Republican: {feature.properties.gopVotes.toLocaleString()}</List.Item>
      </Segment>
    </List>
  );
};

export default Tooltip;
