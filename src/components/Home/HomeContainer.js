import React from 'react';
import { connect } from 'react-redux';

import HomepageHeading from './HomepageHeadeading';
import MobileNav from '../Nav/MobileNav';
import DesktopNav from '../Nav/DesktopNav';
import setActive from '../../redux/actions/navActions';

class HomeContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('home');
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
});

export default connect(
  null,
  mapDispatchToProps,
)(HomeContainer);
