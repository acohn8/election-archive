import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Menu, Responsive, Visibility, Segment } from 'semantic-ui-react';

import StateDropdown from '../StateDropdown';

class DesktopNav extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { fixed } = this.state;
    const activeItem = this.props.activeItem;

    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment textAlign="center" basic>
            <Menu fixed={fixed ? 'top' : null} pointing={!fixed} secondary={!fixed} size="large">
              <Container>
                <Menu.Item
                  name="home"
                  as={Link}
                  to="/"
                  color="teal"
                  active={activeItem === 'home'}
                />
                <Menu.Item
                  name="national map"
                  as={Link}
                  to="/national-map"
                  color="teal"
                  active={activeItem === 'national map'}
                />
                <Menu.Item
                  name="states"
                  as={Link}
                  to="/states"
                  color="teal"
                  active={activeItem === 'states' || activeItem === 'statesShow'}
                />
                {/* <Menu.Item as="a">About</Menu.Item> */}
                {this.props.activeItem === 'statesShow' && (
                  <Menu.Menu position="right">
                    <Menu.Item style={{ width: '25vw' }}>
                      <StateDropdown />
                    </Menu.Item>
                  </Menu.Menu>
                )}
              </Container>
            </Menu>
          </Segment>
        </Visibility>
        {this.props.children}
      </Responsive>
    );
  }
}

const mapStateToProps = state => ({
  activeItem: state.nav.activePage,
});

export default connect(mapStateToProps)(DesktopNav);
