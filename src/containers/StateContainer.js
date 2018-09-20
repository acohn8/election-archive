import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Divider,
  Grid,
  Header,
  Segment,
  Responsive,
  Label,
  Icon,
  Tab,
  Button,
} from 'semantic-ui-react';
import ContentLoader from '../components/Loader/Loader';
import OfficeDropdown from '../components/OfficeDropdown/OfficeDropdown';
import MobileStateSelector from '../components/StateList/MobileStateSelect';
import ExportDropdown from '../components/Table/ExportDropdown';
import { setActive } from '../redux/actions/navActions';
import { resetOffice, setActiveOffice, updateOffices } from '../redux/actions/officeActions';
import { resetActiveState, setActiveState } from '../redux/actions/stateActions';
import MapContainer from './StateMapContainer';
import StateResultTableContainer from './StateResultTableContainer';
import CampaignFinanceTable from '../components/CampaignFinanceTable/CampaignFinanceTable';
import ButtonWithIcon from '../components/ButtonWithIcon/ButtonWithIcon';
import { resetResults } from '../redux/actions/resultActions';

class StateContainer extends React.Component {
  state = { expandedOverview: false };

  componentDidMount() {
    this.props.setActive('statesShow');
    this.fetchStateData();
  }

  componentDidUpdate(prevProps) {
    const state = this.getStateFromParams();
    const officeId = this.getOfficeFromParams();
    const districtName = this.props.match.params.activeDistrict;
    if (this.props.match.params.activeStateName !== prevProps.match.params.activeStateName) {
      this.setState({ expandedOverview: false }, () => {
        this.props.resetOffice();
        this.props.setActiveState(state.id, officeId);
      });
    } else if (
      (this.props.match.params.activeStateName === prevProps.match.params.activeStateName &&
        this.props.match.params.activeOfficeName !== prevProps.match.params.activeOfficeName) ||
      (this.props.match.params.activeStateName === prevProps.match.params.activeStateName &&
        this.props.match.params.activeDistrict !== prevProps.match.params.activeDistrict)
    ) {
      districtName
        ? this.setState({ expandedOverview: false }, () =>
            this.props.updateOffices(officeId, districtName.toLowerCase()),
          )
        : this.setState({ expandedOverview: false }, () => this.props.updateOffices(officeId));
    }
  }

  componentWillUnmount() {
    this.props.resetOffice();
    this.props.resetResults();
    this.props.resetActiveState();
    this.setState({ expandedOverview: false });
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

  handleClick = () => {
    this.setState({ ...this.state, expandedOverview: !this.state.expandedOverview });
  };

  formatRaceSummary = () => {
    const splitSummary = this.props.officeInfo.overview
      .replace(
        /\b(\w\.\w\.|\d+(?:\.\d+){1,2}\.?)|([.?!])\s+(?=[A-Za-z])/g,
        (m, g1, g2) => (g1 ? g1 : g2 + '\r'),
      )
      .split('\r');
    if (this.state.expandedOverview === true) {
      return (
        <div>
          <p>{this.props.officeInfo.overview}</p>
          <Button.Group>
            <ButtonWithIcon color="teal" icon="arrow up" text={'Less'} onClick={this.handleClick} />
            <ButtonWithIcon
              color="grey"
              link={this.props.officeInfo.overview_link}
              icon="wikipedia w"
              text={'Wiki'}
            />
          </Button.Group>
        </div>
      );
    } else if (splitSummary.length <= 2) {
      return (
        <div>
          <p>{this.props.officeInfo.overview}</p>
          <Button.Group>
            <ButtonWithIcon
              color="grey"
              link={this.props.officeInfo.overview_link}
              icon="wikipedia w"
              text={'Wiki'}
            />
          </Button.Group>
        </div>
      );
    } else {
      const shortenedSummary = splitSummary.slice(0, 2).join(' ');
      return (
        <div>
          <p>{shortenedSummary}</p>
          <Button.Group>
            <ButtonWithIcon
              color="teal"
              icon="arrow down"
              text={'More'}
              onClick={this.handleClick}
            />
            <ButtonWithIcon
              color="grey"
              link={this.props.officeInfo.overview_link}
              icon="wikipedia w"
              text={'Wiki'}
            />
          </Button.Group>
        </div>
      );
    }
  };

  formatTableTabs = () => {
    const tabPanes = [
      {
        menuItem: 'Results',
        render: () => (
          <Tab.Pane attached={false}>
            <StateResultTableContainer />
          </Tab.Pane>
        ),
      },
    ];
    if (this.props.officeInfo.id !== 313) {
      tabPanes.push({
        menuItem: 'Campaign Finance',
        render: () => (
          <Tab.Pane attached={false}>
            <CampaignFinanceTable candidates={this.props.candidates} />
          </Tab.Pane>
        ),
      });
    }
    return tabPanes;
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
                <Grid.Row columns={1}>
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
                    </Header>
                    <Header
                      as="h3"
                      style={{
                        marginTop: 3,
                        fontWeight: 'normal',
                      }}
                    >
                      <span style={{ color: '#00B5AD' }}>
                        <OfficeDropdown
                          className="link item"
                          offices={this.props.stateOffices}
                          selectedOfficeId={this.props.offices.selectedOfficeId}
                          stateName={this.props.stateInfo.attributes.name}
                        />
                      </span>
                    </Header>
                  </Grid.Column>
                </Grid.Row>
                {this.props.officeInfo.overview && (
                  <Grid.Row colums={1}>
                    <Grid.Column>
                      <Segment>{this.formatRaceSummary()}</Segment>
                    </Grid.Column>
                  </Grid.Row>
                )}
                <Grid.Row colums={1} verticalAlign="top">
                  <Grid.Column>
                    <div style={{ minHeight: 430, overflow: 'hidden', width: '100%' }}>
                      <Tab menu={{ text: true, color: 'teal' }} panes={this.formatTableTabs()} />
                    </div>
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
                      <MapContainer />
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
  officeInfo: state.results.officeInfo,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: (stateId, officeId, districtId) =>
    dispatch(setActiveState(stateId, officeId, districtId)),
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
  resetOffice: () => dispatch(resetOffice()),
  resetResults: () => dispatch(resetResults()),
  setActiveOffice: (officeId, districtName) => dispatch(setActiveOffice(officeId, districtName)),
  updateOffices: (officeId, districtName) => dispatch(updateOffices(officeId, districtName)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
