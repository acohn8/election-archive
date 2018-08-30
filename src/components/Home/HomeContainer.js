import React from 'react';
import { connect } from 'react-redux';

import HomepageHeading from './HomepageHeadeading';
import { setActive } from '../../redux/actions/navActions';
import { resetActiveState } from '../../redux/actions/stateActions';

class HomeContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('home');
  }

  componentDidUpdate() {
    if (this.props.stateInfo !== null) {
      this.props.resetActiveState();
    }
  }

  render() {
    return <HomepageHeading />;
  }
}

const mapDispatchToProps = dispatch => ({
  setActive: name => dispatch(setActive(name)),
  resetActiveState: () => dispatch(resetActiveState()),
});

const mapStateToProps = state => ({
  stateInfo: state.states.stateInfo,
  offices: state.offices,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
