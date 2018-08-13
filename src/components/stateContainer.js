import React from 'react';
import { Grid, Header, Image, Container, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TableContainer from './Table/tableContainer';
import MapContainer from './Map/mapContainer';
import ToplinesContainer from './Toplines/toplinesContainer';
import ContentLoader from './Loader';
import { setActiveState, resetActiveState } from '../redux/actions/stateActions';
import { fetchStateOffices, setActiveOffice, resetOffice } from '../redux/actions/officeActions';
import setActive from '../redux/actions/navActions';
import ResponsiveNav from './Nav/ResponsiveNav';
import OfficeDropdown from './OfficeDropdown/OfficeDropdown';

class StateContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('states');
  }

  componentDidUpdate() {
    const office = this.props.offices.offices.find(
      office =>
        office.attributes.name
          .split(' ')
          .join('-')
          .toLowerCase() === this.props.match.params.selectedOfficeId.toLowerCase(),
    );

    const state = this.props.states.states.find(
      state =>
        state.attributes.name
          .split(' ')
          .join('-')
          .toLowerCase() === this.props.match.params.activeStateName.toLowerCase(),
    );

    if (
      state !== undefined &&
      office !== undefined &&
      state.id !== this.props.states.activeStateId &&
      office.id !== this.props.offices.selectedOfficeId
    ) {
      this.props.setActiveState(state.id, false, office.id);
    } else if (
      state !== undefined &&
      office !== undefined &&
      state.id === this.props.states.activeStateId &&
      office.id !== this.props.offices.selectedOfficeId
    ) {
      this.props.setActiveOffice(office.id);
    } else if (
      state !== undefined &&
      office !== undefined &&
      state.id !== this.props.states.activeStateId
    ) {
      this.props.setActiveState(state.id);
    }
    // if (
    //   state.id !== this.props.states.activeStateId &&
    //   state.id !== undefined &&
    //   this.props.states.activeStateId !== undefined
    // ) {
    //   this.props.setActiveState(state.id);
    // }

    // if (
    //   this.props.offices.offices.length > 0 &&
    //   office.id !== this.props.offices.selectedOfficeId &&
    //   office.id !== undefined
    // ) {
    //   this.props.setActiveOffice(office.id);
    // }
  }

  componentWillUnmount() {
    this.props.resetActiveState();
    this.props.resetOffice();
  }

  importAll = r => {
    return r.keys().map(r);
  };

  render() {
    const images = this.importAll(require.context('./state-flags', false, /\.(png|jpe?g|svg)$/));
    return (
      <ResponsiveNav>
        <Divider hidden />
        <Container>
          {this.props.loading === true && <ContentLoader />}
          {this.props.loading === false &&
            this.props.offices.offices.length > 0 &&
            this.props.states.activeStateId !== '' && (
              <div>
                <Grid columns={2} verticalAlign="middle" stackable>
                  <Grid.Column>
                    <Header size="huge">
                      <Image
                        src={images.find(image =>
                          image.includes(
                            `/static/media/${this.props.geography.entities.state[
                              this.props.geography.result.state
                            ].short_name.toLowerCase()}`,
                          ),
                        )}
                      />
                      {
                        this.props.states.states.find(
                          state => state.id === this.props.states.activeStateId,
                        ).attributes.name
                      }
                    </Header>
                  </Grid.Column>
                  <Grid.Column>
                    <OfficeDropdown />
                  </Grid.Column>
                  <Grid.Row>
                    <Grid.Column>
                      <ToplinesContainer />
                    </Grid.Column>
                    <Grid.Column>
                      <MapContainer />
                    </Grid.Column>
                  </Grid.Row>
                  <Divider />
                </Grid>
                <TableContainer />
              </div>
            )}
        </Container>
      </ResponsiveNav>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.results.loading,
  geography: state.results.geography,
  states: state.states,
  offices: state.offices,
  nav: state.nav,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: stateId => dispatch(setActiveState(stateId)),
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
