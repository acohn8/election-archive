import React from 'react';
import { connect } from 'react-redux';

import HomepageHeading from './HomepageHeadeading';
import { setActive } from '../../redux/actions/navActions';

class HomeContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('home');
  }

  render() {
    return <HomepageHeading />;
  }
}

const mapDispatchToProps = dispatch => ({
  setActive: name => dispatch(setActive(name)),
});

const mapStateToProps = state => ({
  stateInfo: state.results.stateInfo,
  offices: state.offices,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
