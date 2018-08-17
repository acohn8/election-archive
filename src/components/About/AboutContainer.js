import React from 'react';
import { Grid, Container, Segment, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';

import setActive from '../../redux/actions/navActions';
import ResponsiveNav from '../Nav/ResponsiveNav';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';
import AboutMe from './AboutMe';
import ContactButtons from './ContactButtons';
import OtherProjects from './OtherProjects';

class AboutContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('about');
  }

  render() {
    return (
      <ResponsiveNav>
        <Container text>
          <Divider hidden />
          <AboutMe />
          <OtherProjects />
          <Divider />
          <FrequentlyAskedQuestions />
        </Container>
      </ResponsiveNav>
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
