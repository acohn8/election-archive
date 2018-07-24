import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
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

  render() {
    return (
      <div>
        {this.props.loading === true && <ContentLoader />}
        {this.props.loading === false &&
          this.props.states.activeStateId !== '' && (
            <div>
              <Header as="h1">
                {
                  this.props.states.states.find(state => state.id === this.props.states.activeStateId).attributes.name
                }
              </Header>
              <Grid columns={2}>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.results.loading,
  states: state.states,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: stateId => dispatch(setActiveState(stateId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
