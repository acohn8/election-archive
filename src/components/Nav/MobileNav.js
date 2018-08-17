import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Icon, Menu, Responsive, Segment, Sidebar } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { hideHeader, showHeader } from '../../redux/actions/mapActions';
import StateDropdown from '../StateDropdown';
import OfficeDropdown from '../OfficeDropdown/OfficeDropdown';

class MobileNav extends Component {
  state = {};

  handlePusherClick = () => {
    const { sidebarOpened } = this.state;

    if (sidebarOpened) this.setState({ sidebarOpened: false });
    if (sidebarOpened && this.props.activeItem === 'national map') {
      this.props.showHeader();
    } else if (!sidebarOpened && this.props.activeItem === 'national map') {
      this.props.hideHeader();
    }
  };

  handleToggle = () => this.setState({ sidebarOpened: !this.state.sidebarOpened });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;
    const activeItem = this.props.activeItem;

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
            <Menu.Item name="home" as={Link} to="/" active={activeItem === 'home'} />
            <Menu.Item
              name="national map"
              as={Link}
              to="/national-map"
              active={activeItem === 'national map'}
            />
            <Menu.Item
              name="states"
              as={Link}
              to="/states"
              active={activeItem === 'states' || activeItem === 'statesShow'}
            />
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
              style={{ minHeight: '6vh', margin: 0, padding: 0 }}
            >
              <Container textAlign="center" style={{ maxHeight: '10vh' }}>
                <Menu secondary size="large" inverted>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                    <Menu.Item header as="h3">
                      Election Archive
                    </Menu.Item>
                  </Menu.Item>
                  {this.props.activeItem === 'statesShow' &&
                    this.props.states.activeStateId !== null && (
                      <Menu.Menu position="right">
                        <Menu.Item>
                          <StateDropdown />
                        </Menu.Item>
                      </Menu.Menu>
                    )}
                  {this.props.activeItem === 'national map' && (
                    <Menu.Menu position="right">
                      <Menu.Item>
                        <OfficeDropdown />
                      </Menu.Item>
                    </Menu.Menu>
                  )}
                </Menu>
              </Container>
            </Segment>
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  hideHeader: () => dispatch(hideHeader()),
  showHeader: () => dispatch(showHeader()),
});

const mapStateToProps = state => ({
  activeItem: state.nav.activePage,
  states: state.states,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileNav);
