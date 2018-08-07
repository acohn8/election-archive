<<<<<<< HEAD
import React from 'react';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';
import StateDropdown from '../StateDropdown';

const HomeContainer = props => (
  <div>
    {!props.headerHid && (
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          left: 60,
          top: 72,
          width: 250,
          backgroundColor: 'white',
          padding: '20px',
          opacity: '0.8',
        }}
      >
        <Header as="h1">
          President: 2016
          <Header.Subheader>Zoom in to see counties or out to see states</Header.Subheader>
        </Header>
      </div>
    )}
    <div
=======
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Header,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';

/* eslint-disable react/no-multi-comp */

const HomepageHeading = ({ mobile }) => (
  <Container text fluid>
    <Header
      as="h1"
      content="Election Archive"
      inverted
>>>>>>> big-refactor
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

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign="center"
            style={{
              background:
                "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), no-repeat center, url('https://s3.amazonaws.com/stateprecinctresults/Images/crop-v2.png') 0 0 /cover",
              minHeight: '100vh',
              padding: '1em 0em',
            }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
              color="white"
            >
              <Container>
                <Menu.Item name="home" as={Link} to="/" active />
                <Menu.Item name="National Map" as={Link} to="/national-map" />
                <Menu.Item name="States" as={Link} to="/states" />
                {/* <Menu.Item as="a">About</Menu.Item> */}
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

class MobileContainer extends Component {
  state = {};

  handlePusherClick = () => {
    const { sidebarOpened } = this.state;

    if (sidebarOpened) this.setState({ sidebarOpened: false });
  };

  handleToggle = () => this.setState({ sidebarOpened: !this.state.sidebarOpened });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation="uncover" vertical visible={sidebarOpened}>
            <Menu.Item name="home" as={Link} to="/" active />
            <Menu.Item name="National Map" as={Link} to="/national-map" />
            <Menu.Item name="States" as={Link} to="/states" />
            {/* <Menu.Item as="a">About</Menu.Item> */}
          </Sidebar>

          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
            style={{ minHeight: '100vh' }}
          >
            <Segment
              inverted
              textAlign="center"
              style={{
                minHeight: '100vh',
                padding: '1em 0em',
                background:
                  "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), no-repeat center, url('https://s3.amazonaws.com/stateprecinctresults/Images/crop-v2.png') 0 0 /cover",
              }}
              vertical
            >
              <Container>
                <Menu pointing secondary size="large">
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading mobile />
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const HomeContainer = () => <ResponsiveContainer />;

export default HomeContainer;
