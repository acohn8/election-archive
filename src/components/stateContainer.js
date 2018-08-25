import React from 'react';
import { Grid, Header, Container, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TableContainer from './Table/tableContainer';
import MapContainer from './Map/mapContainer';
import ToplinesContainer from './Toplines/toplinesContainer';
import ContentLoader from './Loader';
import { setActiveState, resetActiveState } from '../redux/actions/stateActions';
import { fetchStateOffices, setActiveOffice, resetOffice } from '../redux/actions/officeActions';
import { setActive } from '../redux/actions/navActions';
import OfficeDropdown from './OfficeDropdown/OfficeDropdown';
import MobileStateSelector from './StateList/MobileStateSelect';

class StateContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('statesShow');
  }

  componentDidUpdate() {
    const state = this.props.states.states.find(state =>
      state.attributes.name
        .split(' ')
        .join('-')
        .toLowerCase() === this.props.match.params.activeStateName.toLowerCase());
    if (state !== undefined && state.id !== this.props.states.activeStateId) {
      this.props.resetOffice();
      this.props.setActiveState(state.id);
    }
  }

  componentWillUnmount() {
    this.props.resetOffice();
    this.props.resetActiveState();
  }

  render() {
    return (
      <div>
        <Divider hidden />
        <Container>
          {this.props.loading === true && <ContentLoader />}
          {this.props.loading === false &&
            this.props.offices.stateOffices.result !== undefined &&
            this.props.states.activeStateId !== null && (
              <div>
                <Grid columns={2} verticalAlign="middle" stackable>
                  <Grid.Column>
                    <Header size="huge">
                      {this.props.nav.windowWidth >= 768 ? (
                        this.props.states.states.find(state => state.id === this.props.states.activeStateId).attributes.name
                      ) : (
                        <MobileStateSelector
                          state={
                            this.props.states.states.find(state => state.id === this.props.states.activeStateId).attributes.name
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
                  <Grid.Row>
                    <Grid.Column>
                      <ToplinesContainer />
                    </Grid.Column>
                    <Grid.Column>
                      {!this.props.offices.selectedDistrictId && <MapContainer />}
                    </Grid.Column>
                  </Grid.Row>
                  <Divider />
                </Grid>
                <TableContainer />
              </div>
            )}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.results.loading,
  geography: state.results.geography,
  states: state.states,
  offices: state.offices,
  nav: state.nav,
  resultsOfficeName: state.results.name,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: (stateId, fetch) => dispatch(setActiveState(stateId, fetch)),
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
  fetchStateOffices: () => dispatch(fetchStateOffices()),
  setActiveOffice: officeId => dispatch(setActiveOffice(officeId)),
  resetOffice: () => dispatch(resetOffice()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
