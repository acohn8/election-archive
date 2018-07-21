import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fetchStateData } from '../redux/actions/resultActions';
import TableContainer from './Table/tableContainer';
import MapContainer from './Map/mapContainer';
import ToplinesContainer from './Toplines/toplinesContainer';
import ContentLoader from './Loader';

class StateContainer extends React.Component {
  componentDidMount() {
    this.props.fetchStateData();
  }
  render() {
    return (
      <div>
        {this.props.loading === true ? (
          <ContentLoader />
        ) : (
          <div>
            <Header as="h1">Pennsylvania</Header>
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
});

const mapDispatchToProps = dispatch => ({
  fetchStateData: () => dispatch(fetchStateData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateContainer);
