import React from 'react';
import { Grid, Header, Image, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TableContainer from './Table/tableContainer';
import MapContainer from './Map/mapContainer';
import ToplinesContainer from './Toplines/toplinesContainer';
import ContentLoader from './Loader';
import { setActiveState } from '../redux/actions/stateActions';

class StateContainer extends React.Component {
  componentDidMount() {
    if (this.props.states.activeStateId === '') {
      this.props.setActiveState(this.props.match.params.activeStateId);
    }
  }

  importAll = r => {
    return r.keys().map(r);
  };

  render() {
    const images = this.importAll(require.context('./state-flags', false, /\.(png|jpe?g|svg)$/));
    return (
      <Container>
        {this.props.loading === true && <ContentLoader />}
        {this.props.loading === false &&
          this.props.states.activeStateId !== '' && (
            <div>
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
              <Grid columns={2} verticalAlign="middle">
                <Grid.Row>
                  <Grid.Column>
                    <ToplinesContainer />
                  </Grid.Column>
                  <Grid.Column>
                    <MapContainer />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row colums={1}>
                  <TableContainer />
                </Grid.Row>
              </Grid>
            </div>
          )}
      </Container>
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
