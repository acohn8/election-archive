import React from 'react';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';

import ToplinesCard from './toplinesCard';

const ToplinesContainer = (props) => {
  const statewideCandidateResults = () => {
    const statewideResults = {};
    const stateCandidates = props.candidates.result;
    stateCandidates.forEach((candidateId) => {
      statewideResults[candidateId] = 0;
    });
    props.electionResults.result.forEach((countyId) => {
      stateCandidates.forEach((candidateId) => {
        statewideResults[candidateId] +=
          props.electionResults.entities.results[countyId].results[candidateId];
      });
    });
    return statewideResults;
  };

  const filterAndSortCandidatesWithResults = () => {
    const candidatesWithResults = Object.keys(statewideCandidateResults()).filter(candidateId =>
      Boolean(statewideCandidateResults()[candidateId]));
    const sortedIds = candidatesWithResults.sort((a, b) => statewideCandidateResults()[b] - statewideCandidateResults()[a]);
    return sortedIds;
  };

  const getStatewideTotal = () => {
    let statewideTotal = 0;
    filterAndSortCandidatesWithResults().forEach((candidateId) => {
      statewideTotal += statewideCandidateResults()[candidateId];
    });
    return statewideTotal;
  };

  return (
    <Card.Group itemsPerRow={3}>
      {filterAndSortCandidatesWithResults()
        .slice(0, 3)
        .map(candidateId => (
          <ToplinesCard
            candidate={props.candidates.entities.candidates[candidateId]}
            key={candidateId}
            votes={statewideCandidateResults()[candidateId]}
            winner={filterAndSortCandidatesWithResults()[0]}
            total={getStatewideTotal()}
          />
        ))}
    </Card.Group>
  );
};

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
});

export default connect(mapStateToProps)(ToplinesContainer);
