import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Icon } from 'semantic-ui-react';

const HomepageHeading = ({ mobile }) => (
  <Container text fluid>
    <Header
      as="h1"
      content="Election Archive"
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: '30%',
      }}
    />
    <Header
      as="h2"
      content="Select a state for detailed results."
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: '0.5em',
      }}
    />
    <Button primary size="huge" color="teal" as={Link} to="/national-map">
      Get Started
      <Icon name="right arrow" />
    </Button>
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
};

export default HomepageHeading;
