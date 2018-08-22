import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { hideHeader, showHeader } from '../../redux/actions/mapActions';
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
      <div>
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
            <Menu.Item name="faq" as={Link} to="/faq" color="teal" active={activeItem === 'faq'} />
            <Menu.Item name="about" as={Link} to="/about" active={activeItem === 'about'} />
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
              style={{ minHeight: '6vh', margin: 0, padding: 0, backgroundColor: '#00B5AD' }}
            >
              <Container textAlign="center" style={{ minHeight: '5vh' }}>
                <Menu secondary size="large" inverted>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                    <Menu.Item header as="h3">
                      Election Archive
                    </Menu.Item>
                  </Menu.Item>
                  {this.props.activeItem === 'national map' &&
                    this.props.offices.offices.length === 4 && (
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
      </div>
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
  offices: state.offices,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileNav);
