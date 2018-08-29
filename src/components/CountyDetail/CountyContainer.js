import React from 'react';
import { Grid, Header, Segment, List } from 'semantic-ui-react';
import { connect } from 'react-redux';

import Loader from '../Loader';
import CountyMap from '../Map/countyMap';
import ResultsList from './ResultsList';
import PrecinctResultsTable from './PrecinctResultsTable';
import { fetchPrecinctData } from '../../redux/actions/precinctActions';
import NewMapComponent from '../Map/NewMapComponent';

class CountyContainer extends React.Component {
  componentDidMount() {
    this.props.fetchPrecinctData(this.props.row.original);
    this.props.setActive('countyShow');
  }

  formatCountyToplines = () => {
    const countyResults = this.props.countyResults.entities.results[
      this.props.precinctResults.county_id
    ].results;
    const countyCandidates = Object.keys(countyResults);

    const formattedData = countyCandidates
      .map(candidate => ({
        candidate: this.props.candidates.entities.candidates[candidate],
        votes: countyResults[candidate],
      }))
      .filter(candidate => candidate.candidate !== undefined)
      .sort((a, b) => b.votes - a.votes);
    //removes the last candidate from the results list if they got less than 5% of the statewide vote
    if (formattedData.length > 2) {
      return this.props.stateResults[formattedData[2].candidate.id] /
        Object.values(this.props.stateResults).reduce((sum, num) => sum + num) <=
        0.05
        ? formattedData.slice(0, 2)
        : formattedData;
    } else {
      return formattedData;
    }
  };

  render() {
    return (
      <Segment raised padded>
        {this.props.precinctResults.precincts !== undefined ? (
          <Grid centered stackable columns={2}>
            <Grid.Row>
              <List horizontal size="big">
                {this.formatCountyToplines().map(candidate => (
                  <ResultsList key={candidate.candidate.id} candidate={candidate} />
                ))}
              </List>
            </Grid.Row>
            <Grid.Column>
              <Header as="h3">Precinct Results</Header>
              <PrecinctResultsTable />
            </Grid.Column>
            {this.props.states.activeStateId !== '17' &&
              this.props.selectedOfficeId !== '322' && (
                <Grid.Column>
                  <Header as="h3">
                    {
                      this.props.counties.entities.counties[
                        this.props.precinctResults.county_id.toString()
                      ].attributes.name
                    }
                  </Header>
                  {/* <NewMapComponent minHeight={398}/> */}
                </Grid.Column>
              )}
          </Grid>
        ) : (
          <Loader />
        )}
      </Segment>
    );
  }
}

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  states: state.states,
  counties: state.results.counties,
  precinctResults: state.results.precinctResults,
  countyResults: state.results.countyResults,
  stateResults: state.results.stateResults,
  selectedOfficeId: state.offices.selectedOfficeId,
});

const mapDispatchToProps = dispatch => ({
  fetchPrecinctData: id => dispatch(fetchPrecinctData(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CountyContainer);
