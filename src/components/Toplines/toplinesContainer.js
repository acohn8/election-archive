import React from 'react';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';

import ToplinesCard from './toplinesCard';
import { fetchCampaignFinanceData } from '../../redux/actions/campaignFinanceActions';

const ToplinesContainer = (props) => {
  const sortedCandidates = Object.keys(props.stateResults)
    .filter(id => id !== 'other')
    .map(id => parseInt(id, 10))
    .sort((a, b) => props.stateResults[b] - props.stateResults[a])
    .slice(0, 2);

  const total = Object.values(props.stateResults).reduce((sum, num) => sum + num);

  props.fetchCampaignFinanceData(sortedCandidates);

  return (
    <Card.Group itemsPerRow={sortedCandidates.length} stackable>
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

const mapDispatchToProps = dispatch => ({
  fetchCampaignFinanceData: candidateIds => dispatch(fetchCampaignFinanceData(candidateIds)),
});

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  countyResults: state.results.countyResults,
  stateResults: state.results.stateResults,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToplinesContainer);
