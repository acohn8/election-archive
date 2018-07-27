import React from 'react';
import { Grid, Header, Segment, List } from 'semantic-ui-react';
import { connect } from 'react-redux';

import Loader from '../Loader';
import CountyMap from '../Map/countyMap';
import ResultsList from './ResultsList';
import PrecinctResultsTable from './PrecinctResultsTable';

const CountyContainer = (props) => {
  const formatCountyToplines = () => {
    const countyResults =
      props.electionResults.entities.results[props.precinctResults.county_id].results;
    const countyCandidates = Object.keys(countyResults);
    const formattedData = countyCandidates
      .map(candidate => ({
        candidate: props.candidates.entities.candidates[candidate],
        votes: countyResults[candidate],
      }))
      .filter(candidate => candidate.candidate !== undefined)
      .sort((a, b) => b.votes - a.votes);
    return formattedData;
  };
  return (
    <Segment raised padded>
      {props.precinctResults.precincts !== undefined ? (
        <Grid centered columns={2}>
          <Grid.Row>
            <Header as="h2">
              {props.geography.entities.counties[props.precinctResults.county_id].name}
            </Header>
          </Grid.Row>
          <Grid.Row>
            <List horizontal size="big">
              {formatCountyToplines().map(candidate => (
                <ResultsList key={candidate.id} candidate={candidate} />
              ))}
            </List>
          </Grid.Row>
          <Grid.Column>
            <PrecinctResultsTable />
          </Grid.Column>
          <Grid.Column>
            <CountyMap />
          </Grid.Column>
        </Grid>
      ) : (
        <Loader />
      )}
    </Segment>
  );
};

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  precinctResults: state.results.precinctResults,
  electionResults: state.results.electionResults,
});

export default connect(mapStateToProps)(CountyContainer);
