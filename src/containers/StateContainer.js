import React from 'react';
import { connect } from 'react-redux';
import { Card, Container, Divider, Grid, Header, Segment, Responsive } from 'semantic-ui-react';
import ContentLoader from '../components/Loader/Loader';
import OfficeDropdown from '../components/OfficeDropdown/OfficeDropdown';
import MobileStateSelector from '../components/StateList/MobileStateSelect';
import ExportDropdown from '../components/Table/ExportDropdown';
import FinanceOverview from '../components/Toplines/FinanceOverview';
import ToplinesCard from '../components/Toplines/toplinesCard';
import { setActive } from '../redux/actions/navActions';
import { resetOffice } from '../redux/actions/officeActions';
import { resetActiveState, setActiveState } from '../redux/actions/stateActions';
import MapContainer from './StateMapContainer';
import StateResultTableContainer from './StateResultTableContainer';

class StateContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('statesShow');
  }

  componentDidUpdate() {
    const state = this.props.states.states.find(
      state =>
        state.attributes.name
          .split(' ')
          .join('-')
          .toLowerCase() === this.props.match.params.activeStateName.toLowerCase(),
    );
    if (this.props.states.states.length && this.props.states.activeStateId === null) {
      this.props.setActiveState(state.id);
    } else if (
      this.props.states.states.length > 0 &&
      this.props.states.activeStateId !== state.id
    ) {
      this.props.resetOffice();
      this.props.setActiveState(state.id);
    }
  }

  componentWillUnmount() {
    this.props.resetOffice();
    this.props.resetActiveState();
  }

  getStatewideTotal = () => {
    const votes = Object.values(this.props.stateResults);
    return votes.reduce((sum, num) => sum + num);
  };

  render() {
    return (
      <div>
        <Divider hidden />
        <Container>
          {this.props.loading === true && <ContentLoader />}
          {this.props.loading === false &&
            this.props.candidates.result !== undefined && (
              <div>
                <Grid columns={2} verticalAlign="middle" stackable>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Header size="huge">
                        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                          {
                            this.props.states.states.find(
                              state => state.id === this.props.states.activeStateId,
                            ).attributes.name
                          }
                        </Responsive>
                        <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                          <MobileStateSelector
                            state={
                              this.props.states.states.find(
                                state => state.id === this.props.states.activeStateId,
                              ).attributes.name
                            }
                          />
                        </Responsive>
                        <Header.Subheader>
                          Results for{' '}
                          <span style={{ color: '#00B5AD' }}>
                            <OfficeDropdown className="link item" />
                          </span>
                        </Header.Subheader>
                      </Header>
                    </Grid.Column>
                    <Grid.Column floated="right" textAlign="right">
                      {this.props.offices.selectedOfficeId !== '322' && <ExportDropdown />}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row style={{ minHeight: 450 }}>
                    <Grid.Column>
                      <Header size="large">Statewide</Header>
                      <Card.Group itemsPerRow={2} stackable>
                        {this.props.candidates.result
                          .filter(id => id !== 'other')
                          .map(candidateId => (
                            <ToplinesCard
                              key={candidateId}
                              candidate={this.props.candidates.entities.candidates[candidateId]}
                              votes={this.props.stateResults[candidateId]}
                              winner={this.props.candidates.result[0]}
                              total={this.getStatewideTotal()}
                            >
                              <Card.Content>
                                <Header as="h4">Finance</Header>
                                {this.props.candidates.entities.candidates[candidateId].fec_id !==
                                  null && (
                                  <FinanceOverview
                                    candidateId={candidateId}
                                    campaignFinance={
                                      this.props.candidates.entities.candidates[candidateId]
                                        .finance_data
                                    }
                                  />
                                )}
                              </Card.Content>
                            </ToplinesCard>
                          ))}
                      </Card.Group>
                    </Grid.Column>
                    <Grid.Column>
                      <Header size="large">County</Header>
                      <StateResultTableContainer />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={1} style={{ minHeight: 700 }} verticalAlign="top">
                    <Grid.Column>
                      <Header size="large">
                        County Map
                        {this.props.stateInfo.attributes['precinct-map'] && (
                          <Header.Subheader>Zoom in for precincts</Header.Subheader>
                        )}
                      </Header>
                      <Segment>
                        <Container>
                          <MapContainer />
                        </Container>
                      </Segment>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            )}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.results.loading,
  states: state.states,
  stateInfo: state.results.stateInfo,
  offices: state.offices,
  stateOffices: state.results.stateOffices,
  nav: state.nav,
  stateResults: state.results.stateResults,
  candidates: state.results.candidates,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: stateId => dispatch(setActiveState(stateId)),
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
  resetOffice: () => dispatch(resetOffice()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
