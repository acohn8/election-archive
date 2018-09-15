import React from 'react';
import { connect } from 'react-redux';
import { fetchPrecinctData, resetPrecinctResults } from '../redux/actions/resultActions';

import CountyTableContainer from './CountyTableContainer';
import { Loader } from 'semantic-ui-react';

class CountyContainer extends React.Component {
  componentDidMount() {
    this.props.fetchPrecinctData(this.props.countyId);
  }

  componentWillUnmount() {
    this.props.resetPrecinctResults();
  }

  render() {
    return (
      <div>
        {this.props.precinctResults.result !== undefined ? (
          <CountyTableContainer countyId={this.props.countyId} />
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  precinctResults: state.results.precinctResults,
});

const mapDispatchToProps = dispatch => ({
  fetchPrecinctData: countyId => dispatch(fetchPrecinctData(countyId)),
  resetPrecinctResults: () => dispatch(resetPrecinctResults()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CountyContainer);
