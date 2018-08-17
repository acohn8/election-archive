import React from 'react';
import { Container, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setActive } from '../../redux/actions/navActions';
import AboutMe from './AboutMe';
import OtherProjects from './OtherProjects';

class AboutContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('about');
  }

  render() {
    return (
      <Container text>
        <Divider hidden />
        <AboutMe />
        <OtherProjects />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setActive: name => dispatch(setActive(name)),
});

export default connect(
  null,
  mapDispatchToProps,
)(AboutContainer);
