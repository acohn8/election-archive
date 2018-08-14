import React from 'react';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';

import ToplinesCard from './toplinesCard';

const ToplinesContainer = (props) => {
  const sortedCandidates = Object.keys(props.stateResults)
    .filter(id => id !== 'other')
    .map(id => parseInt(id))
    .sort((a, b) => props.stateResults[b] - props.stateResults[a]);
  const total = Object.values(props.stateResults).reduce((total, num) => total + num);
  return (
    <Card.Group itemsPerRow={sortedCandidates.length}>
      {sortedCandidates.map(candidateId => (
        <ToplinesCard
          candidate={props.candidates.entities.candidates[candidateId]}
          key={candidateId}
          votes={props.stateResults[candidateId]}
          winner={sortedCandidates[0]}
          total={total}
        />
      ))}
    </Card.Group>
  );
};

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  countyResults: state.results.countyResults,
  stateResults: state.results.stateResults,
});

export default connect(mapStateToProps)(ToplinesContainer);
