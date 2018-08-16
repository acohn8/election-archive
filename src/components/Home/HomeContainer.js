import React from 'react';
import { connect } from 'react-redux';

import HomepageHeading from './HomepageHeadeading';
import MobileNav from '../Nav/MobileNav';
import DesktopNav from '../Nav/DesktopNav';
import setActive from '../../redux/actions/navActions';
import { resetActiveState } from '../../redux/actions/stateActions';
import { fetchOfficesList } from '../../redux/actions/officeActions';

class HomeContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('home');
  }

  componentDidUpdate() {
    if (this.props.offices.offices.length !== 3) {
      this.props.fetchOfficesList();
    } else if (this.props.states !== null) {
      this.props.resetActiveState();
    }
  }

  render() {
    return (
      <div>
        <MobileNav>
          <HomepageHeading mobile />
        </MobileNav>
        <DesktopNav>
          <HomepageHeading />
        </DesktopNav>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setActive: name => dispatch(setActive(name)),
  fetchOfficesList: () => dispatch(fetchOfficesList()),
  resetActiveState: () => dispatch(resetActiveState()),
});

const mapStateToProps = state => ({
  states: state.states.activeStateId,
  offices: state.offices,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
