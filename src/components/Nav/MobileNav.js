import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Divider, Icon, Menu, Responsive, Segment, Sidebar } from 'semantic-ui-react';

class MobileNav extends Component {
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
          <Sidebar
            as={Menu}
            animation="uncover"
            vertical
            visible={sidebarOpened}
            style={{ padding: '1em 0em' }}
          >
            <Menu.Item name="home" as={Link} to="/" />
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
              textAlign="center"
              vertical
              basic
              inverted
              color="teal"
              style={{ maxHeight: '8vh', margin: 0, padding: 0 }}
            >
              <Container textAlign="center" style={{ maxHeight: '8vh' }}>
                <Menu secondary size="small" inverted>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                    <Menu.Item header as="h3">
                      Election Archive
                    </Menu.Item>
                  </Menu.Item>
                </Menu>
              </Container>
            </Segment>
            <Divider hidden />
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

export default MobileNav;
