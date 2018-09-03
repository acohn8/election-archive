import React from 'react';
import { connect } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';
import AboutMe from '../components/About/AboutMe';
import OtherProjects from '../components/About/OtherProjects';
import { setActive } from '../redux/actions/navActions';

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
