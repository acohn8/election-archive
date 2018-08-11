import React from 'react';
import { Grid, Header, Image, Container, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TableContainer from './Table/tableContainer';
import MapContainer from './Map/mapContainer';
import ToplinesContainer from './Toplines/toplinesContainer';
import ContentLoader from './Loader';
import { setActiveState, resetActiveState } from '../redux/actions/stateActions';
import { fetchStateOffices } from '../redux/actions/officeActions';
import setActive from '../redux/actions/navActions';
import ResponsiveNav from './Nav/ResponsiveNav';
import OfficeDropdown from './OfficeDropdown/OfficeDropdown';

class StateContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('states');
  }

  componentDidUpdate() {
    const state = this.props.states.states.find(
      state =>
        state.attributes.name
          .split(' ')
          .join('-')
          .toLowerCase() === this.props.match.params.activeStateName.toLowerCase(),
    );
    if (state.id !== this.props.states.activeStateId) {
      this.props.setActiveState(state.id);
      this.props.fetchStateOffices();
    }
  }

  componentWillUnmount() {
    this.props.resetActiveState();
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
});

const mapDispatchToProps = dispatch => ({
  setActiveState: stateId => dispatch(setActiveState(stateId)),
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
  fetchStateOffices: () => dispatch(fetchStateOffices()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
