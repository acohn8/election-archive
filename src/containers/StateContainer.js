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
import { resetOffice, setActiveOffice, updateOffices } from '../redux/actions/officeActions';
import { resetActiveState, setActiveState } from '../redux/actions/stateActions';
import MapContainer from './StateMapContainer';
import StateResultTableContainer from './StateResultTableContainer';

class StateContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('statesShow');
    this.fetchStateData();
  }

  componentDidUpdate(prevProps) {
    const state = this.getStateFromParams();
    const officeId = this.getOfficeFromParams();
    const districtName = this.props.match.params.activeDistrict;
    if (this.props.match.params.activeStateName !== prevProps.match.params.activeStateName) {
      this.props.resetOffice();
      this.props.setActiveState(state.id, officeId);
    } else if (
      (this.props.match.params.activeStateName === prevProps.match.params.activeStateName &&
        this.props.match.params.activeOfficeName !== prevProps.match.params.activeOfficeName) ||
      (this.props.match.params.activeStateName === prevProps.match.params.activeStateName &&
        this.props.match.params.activeDistrict !== prevProps.match.params.activeDistrict)
    ) {
      districtName
        ? this.props.updateOffices(officeId, districtName.toLowerCase())
        : this.props.updateOffices(officeId);
    }
  }

  componentWillUnmount() {
    this.props.resetOffice();
    this.props.resetActiveState();
  }

  fetchStateData = () => {
    const state = this.getStateFromParams();
    const officeId = this.getOfficeFromParams();
    const districtName = this.props.match.params.activeDistrict;
    if (districtName) {
      this.props.setActiveState(state.id, officeId, districtName.toLowerCase());
    } else {
      this.props.setActiveState(state.id, officeId);
    }
  };

  getStateFromParams = () => {
    return this.props.states.states.find(
      state =>
        state.attributes.name
          .split(' ')
          .join('-')
          .toLowerCase() === this.props.match.params.activeStateName.toLowerCase(),
    );
  };

  getOfficeFromParams = () => {
    return this.props.offices.allOffices.result.find(
      officeId =>
        this.props.offices.allOffices.entities.offices[officeId].attributes.name
          .split(' ')
          .join('-')
          .toLowerCase() ===
        this.props.match.params.activeOfficeName
          .split(' ')
          .join('-')
          .toLowerCase(),
    );
  };

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
              <Grid verticalAlign="middle" stackable className="fill-content">
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <Header as="h1">
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
                        <span style={{ color: '#00B5AD' }}>
                          <OfficeDropdown
                            className="link item"
                            offices={this.props.stateOffices}
                            selectedOfficeId={this.props.offices.selectedOfficeId}
                            stateName={this.props.stateInfo.attributes.name}
                          />
                        </span>
                      </Header.Subheader>
                    </Header>
                  </Grid.Column>
                  <Grid.Column floated="right" textAlign="right">
                    {this.props.offices.selectedOfficeId !== '322' && <ExportDropdown />}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row colums={1} verticalAlign="top">
                  <Grid.Column>
                    <Header size="medium">
                      Results
                      <Header.Subheader>Click a county for details</Header.Subheader>
                    </Header>
                    <StateResultTableContainer />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1} style={{ minHeight: 700 }} verticalAlign="top">
                  <Grid.Column>
                    <Header size="medium">
                      County Map
                      {this.props.stateInfo.attributes['precinct-map'] && (
                        <Header.Subheader>Zoom in for precincts</Header.Subheader>
                      )}
                    </Header>
                    <Segment>
                      {/* <Container> */}
                      <MapContainer />
                      {/* </Container> */}
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
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
  setActiveState: (stateId, officeId, districtId) =>
    dispatch(setActiveState(stateId, officeId, districtId)),
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
  resetOffice: () => dispatch(resetOffice()),
  setActiveOffice: (officeId, districtName) => dispatch(setActiveOffice(officeId, districtName)),
  updateOffices: (officeId, districtName) => dispatch(updateOffices(officeId, districtName)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
