import React from 'react';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';

import ToplinesCard from './toplinesCard';

const ToplinesContainer = (props) => {
  const sortedCandidates = Object.keys(props.stateResults)
    .filter(id => id !== 'other')
    .map(id => parseInt(id, 10))
    .sort((a, b) => props.stateResults[b] - props.stateResults[a]);

  const total = Object.values(props.stateResults).reduce((sum, num) => sum + num);

  const candidatesToDisplay =
    props.stateResults[sortedCandidates[2]] / total <= 0.05
      ? sortedCandidates.slice(0, 2)
      : sortedCandidates;

  return (
    <Card.Group itemsPerRow={candidatesToDisplay.length}>
      {candidatesToDisplay.map(candidateId => (
        <ToplinesCard
          candidate={props.candidates.entities.candidates[candidateId]}
          key={candidateId}
          votes={props.stateResults[candidateId]}
          winner={candidatesToDisplay[0]}
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
