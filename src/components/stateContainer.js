import React from 'react';
import { Grid, Header, Container, Divider, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import ExportDropdown from './Table/ExportDropdown';
import MapContainer from './Map/mapContainer';
import ToplinesContainer from './Toplines/toplinesContainer';
import ContentLoader from './Loader';
import { setActiveState, resetActiveState } from '../redux/actions/stateActions';
import { fetchStateOffices, resetOffice } from '../redux/actions/officeActions';
import { setActive } from '../redux/actions/navActions';
import OfficeDropdown from './OfficeDropdown/OfficeDropdown';
import MobileStateSelector from './StateList/MobileStateSelect';
import ResultsMap from './Map/ResultsMap';
import { PrecinctColorScale } from '../functions/ColorScale';
import MapLayers from '../functions/MapLayers';
import NewTable from './Table/NewTable';

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
    if (this.props.states.states.length > 0 && this.props.states.activeStateId === null) {
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

  getMapGeographies = () => {
    if (
      this.props.states.stateInfo.attributes['precinct-map'] !== null &&
      this.props.offices.selectedOfficeId === '308'
    ) {
      const countyLayer = MapLayers.county;
      //adapts to PA higher zoom threshold for precinct map
      const precinctMinCountyMaxZoom = this.props.states.activeStateId === '3' ? 9 : 8;
      countyLayer.order = 2;
      countyLayer.minzoom = 0;
      countyLayer.maxzoom = precinctMinCountyMaxZoom;
      const precinctMinZoom =
        this.props.states.activeStateId === '3' ? 9 : precinctMinCountyMaxZoom;
      const precinctLayer = {
        name: 'precinct',
        url: this.props.states.stateInfo.attributes['precinct-map'],
        sourceLayer: this.props.states.stateInfo.attributes['precinct-source'],
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
      const congressionalDistricts = this.props.offices.stateOffices.entities.offices[
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

  render() {
    return (
      <div>
        <Divider hidden />
        <Container>
          {this.props.loading === true && <ContentLoader />}
          {this.props.loading === false &&
            this.props.offices.stateOffices.result !== undefined &&
            this.props.states.activeStateId !== null &&
            this.props.states.stateInfo !== null && (
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
                  <Grid.Row verticalAlign="middle">
                    <Grid.Column>
                      <Header size="large">Statewide Results</Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header size="large">County Results</Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row style={{ minHeight: 450 }}>
                    <Grid.Column>
                      <ToplinesContainer />
                    </Grid.Column>
                    <Grid.Column>
                      <Segment>
                        <NewTable style={{ overflow: 'hidden' }} />
                      </Segment>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={1} style={{ minHeight: 700 }} verticalAlign="top">
                    <Grid.Column>
                      <Header size="large">
                        County Map
                        {this.props.states.stateInfo.attributes['precinct-map'] && (
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
  offices: state.offices,
  nav: state.nav,
  stateFips: state.results.stateFips,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: stateId => dispatch(setActiveState(stateId)),
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
  fetchStateOffices: () => dispatch(fetchStateOffices()),
  resetOffice: () => dispatch(resetOffice()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
