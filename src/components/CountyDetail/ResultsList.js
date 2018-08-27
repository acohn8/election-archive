import React from 'react';
import { Image, List } from 'semantic-ui-react';

const colors = {
  democratic: '#2085D0',
  republican: '#DB2828',
  libertarian: '#FBBD09',
  other: '#6435C9',
};

const ResultsList = ({ candidate }) => (
  <List.Item>
    {candidate.candidate.attributes.image !== null && (
      <Image avatar src={candidate.candidate.attributes.image} />
    )}
    <List.Content>
      <List.Header>
        {' '}
        <span
          style={{
            color: colors[candidate.candidate.attributes.party],
            transition: 'all .3s ease',
            margin: '3px',
          }}
        >
          &#x25cf;
        </span>
        {candidate.candidate.attributes.name}
      </List.Header>
      {candidate.votes.toLocaleString()}
    </List.Content>
  </List.Item>
);

export default ResultsList;
