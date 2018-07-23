import React from 'react';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';

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

const ToplinesContainer = (props) => {
  const statewideResults = {};
  if (props.geography.result !== undefined) {
    const stateCandidates = Object.keys(props.geography.entities.counties[props.geography.result.counties[0]].results);
    stateCandidates.forEach(candidateId => (statewideResults[candidateId] = 0));
    props.geography.result.counties.forEach((countyId) => {
      stateCandidates.forEach((candidateId) => {
        statewideResults[candidateId] +=
          props.geography.entities.counties[countyId].results[candidateId];
      });
    });
  }
  const sortedIds = Object.keys(statewideResults).sort((a, b) => statewideResults[b] - statewideResults[a]);

  return (
    <Card.Group itemsPerRow={3}>
      {sortedIds
        .slice(0, 3)
        .map(candidateId => (
          <ToplinesCard
            candidate={props.candidates.entities.candidates[candidateId]}
            votes={statewideResults[candidateId]}
            winner={sortedIds[0]}
            total={Object.values(statewideResults).reduce((a, b) => a + b, 0)}
          />
        ))}
    </Card.Group>
  );
};

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
});

export default connect(mapStateToProps)(ToplinesContainer);
