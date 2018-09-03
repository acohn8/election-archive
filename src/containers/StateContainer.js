import React from 'react';
import { connect } from 'react-redux';
import { Card, Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import ContentLoader from '../components/Loader/Loader';
import ResultsMap from '../components/Map/ResultsMap';
import OfficeDropdown from '../components/OfficeDropdown/OfficeDropdown';
import MobileStateSelector from '../components/StateList/MobileStateSelect';
import ExportDropdown from '../components/Table/ExportDropdown';
import FinanceOverview from '../components/Toplines/FinanceOverview';
import ToplinesCard from '../components/Toplines/toplinesCard';
import { setActive } from '../redux/actions/navActions';
import { resetOffice } from '../redux/actions/officeActions';
import { resetTopTwo, setTopTwo } from '../redux/actions/resultActions';
import { resetActiveState, setActiveState } from '../redux/actions/stateActions';
import { PrecinctColorScale } from '../util/ColorScale';
import MapLayers from '../util/MapLayers';
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
    if (Object.keys(this.props.stateResults).length > 0 && this.props.topTwo.length === 0) {
      this.getTopTwoCandidates();
    }
  }

  componentWillUnmount() {
    this.props.resetOffice();
    this.props.resetActiveState();
  }

  getMapGeographies = () => {
    if (
      this.props.stateInfo.attributes['precinct-map'] !== null &&
      this.props.offices.selectedOfficeId === '308'
    ) {
      const countyLayer = MapLayers.county;
      const precinctMinCountyMaxZoom = this.props.states.activeStateId === '3' ? 9 : 8;
      countyLayer.order = 2;
      countyLayer.minzoom = 0;
      countyLayer.maxzoom = precinctMinCountyMaxZoom;
      const precinctMinZoom =
        this.props.states.activeStateId === '3' ? 9 : precinctMinCountyMaxZoom;
      const precinctLayer = {
        name: 'precinct',
        url: this.props.stateInfo.attributes['precinct-map'],
        sourceLayer: this.props.stateInfo.attributes['precinct-source'],
        colorScale: PrecinctColorScale,
        minzoom: precinctMinZoom,
        maxzoom: 0,
        layer: 'precinct-map',
        filter: null,
        order: 1,
      };
      return [precinctLayer, countyLayer];
    } else if (this.props.offices.selectedOfficeId !== '322') {
      const countyLayer = MapLayers.county;
      countyLayer.minzoom = 0;
      countyLayer.maxzoom = 0;
      return [countyLayer];
    } else {
      const congressionalLayer = MapLayers.congressionalDistrict;
      congressionalLayer.minzoom = 0;
      congressionalLayer.maxzoom = 0;
      return [congressionalLayer];
    }
  };

  getMapFilter = () => {
    if (this.props.offices.selectedOfficeId !== '322') {
      return { property: 'STATEFP', value: this.props.stateFips };
    } else {
      const congressionalDistricts = this.props.stateOffices.entities.offices[
        this.props.offices.selectedOfficeId
      ].districts;
      const districtNumber = congressionalDistricts
        .find(district => district.id === this.props.offices.selectedDistrictId)
        .name.split('-')[1];
      return {
        property: 'GEOID',
        value: `${this.props.stateFips}${districtNumber}`,
      };
    }
  };

  getTopTwoCandidates = () => {
    const candidateIds = Object.keys(this.props.stateResults).filter(id => id !== 'other');
    const topTwoCandidates = candidateIds
      .map(id => parseInt(id, 10))
      .sort((a, b) => this.props.stateResults[b] - this.props.stateResults[a])
      .slice(0, 2);
    this.props.setTopTwo(topTwoCandidates);
  };

  getStatewideTotal = () => {
    const votes = Object.values(this.props.stateResults);
    return votes.reduce((sum, num) => sum + num);
  };

  render() {
    const topCandidates = this.props.topTwo;
    return (
      <div>
        <Divider hidden />
        <Container>
          {this.props.loading === true && <ContentLoader />}
          {this.props.loading === false &&
            this.props.stateOffices.result !== undefined && (
              <div>
                <Grid columns={2} verticalAlign="middle" stackable>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Header size="huge">
                        {this.props.nav.windowWidth >= 768 ? (
                          this.props.states.states.find(
                            state => state.id === this.props.states.activeStateId,
                          ).attributes.name
                        ) : (
                          <MobileStateSelector
                            state={
                              this.props.states.states.find(
                                state => state.id === this.props.states.activeStateId,
                              ).attributes.name
                            }
                          />
                        )}
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
                      {this.props.topTwo && (
                        <Card.Group itemsPerRow={2} stackable>
                          {topCandidates.map(candidateId => (
                            <ToplinesCard
                              candidate={this.props.candidates.entities.candidates[candidateId]}
                              key={candidateId}
                              votes={this.props.stateResults[candidateId]}
                              winner={topCandidates[0]}
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
                      )}
                    </Grid.Column>
                    <Grid.Column>
                      <Header size="large">County</Header>
                      {this.props.topTwo.length && <StateResultTableContainer />}
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
                          <ResultsMap
                            minHeight={600}
                            geographies={this.getMapGeographies()}
                            mapFilter={this.getMapFilter()}
                            hideHeaderOnPrecincts
                          />
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
  stateFips: state.results.stateFips,
  stateResults: state.results.stateResults,
  candidates: state.results.candidates,
  topTwo: state.results.topTwo,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: stateId => dispatch(setActiveState(stateId)),
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
  resetOffice: () => dispatch(resetOffice()),
  setTopTwo: candidates => dispatch(setTopTwo(candidates)),
  resetTopTwo: () => dispatch(resetTopTwo()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
