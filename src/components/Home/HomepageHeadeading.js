import React from 'react';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HomepageHeading = ({ mobile }) => (
  <Segment
    inverted
    textAlign="center"
    style={{
      background:
        "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), no-repeat center, url('https://s3.amazonaws.com/stateprecinctresults/Images/crop-v2.png') 0 0 /cover",
      minHeight: '90vh',
      padding: '1em 0em',
    }}
    vertical
  >
    <Header
      as="h1"
      content="Election Archive"
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: '18%',
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
  </Segment>
);

export default HomepageHeading;
