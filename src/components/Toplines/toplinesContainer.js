import React from 'react';
import { Card } from 'semantic-ui-react';

import ToplinesCard from './toplinesCard';

const candidates = [
  {
    name: 'Hillary Clinton',
    votes: 10000,
    share: 0.62,
    party: 'Democrat',
    winner: true,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/2/27/Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg',
  },
  {
    name: 'Donald Trump',
    votes: 4000,
    share: 0.33,
    party: 'Republican',
    winner: false,
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
  },
  {
    name: 'Gary Johnson',
    votes: 10,
    share: 0.05,
    party: 'Libertarian',
    winner: false,
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Gary_Johnson_campaign_portrait.jpg',
  },
];

const ToplinesContainer = () => (
  <Card.Group itemsPerRow={3}>
    {candidates.map(candidate => <ToplinesCard candidate={candidate} />)}
  </Card.Group>
);

export default ToplinesContainer;
