import React from 'react';
import { Grid, Container, Header, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';

import setActive from '../../redux/actions/navActions';
import ResponsiveNav from '../Nav/ResponsiveNav';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';

class AboutContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('about');
  }

  render() {
    return (
      <ResponsiveNav>
        <Divider hidden />
        <Container>
          <Grid columns={2} stackable>
            <Grid.Column>
              <FrequentlyAskedQuestions />
            </Grid.Column>
            <Grid.Column>
              <Container text>
                <Header size="large">About Me</Header>
              </Container>
            </Grid.Column>
          </Grid>
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
