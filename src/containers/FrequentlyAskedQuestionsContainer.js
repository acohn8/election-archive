import React from 'react';
import { connect } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';
import FrequentlyAskedQuestions from '../components/Faq/FrequentlyAskedQuestions';
import { setActive } from '../redux/actions/navActions';

class AboutContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('faq');
  }

  render() {
    return (
      <Container text>
        <Divider hidden />
        <FrequentlyAskedQuestions />
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
