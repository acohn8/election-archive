import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Image, Menu, Segment, Visibility } from 'semantic-ui-react';
import OfficeDropdown from '../OfficeDropdown/OfficeDropdown';
import StateDropdown from '../StateDropdown/StateDropdown';

class DesktopNav extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { fixed } = this.state;
    const activeItem = this.props.activeItem;

    const importAll = r => r.keys().map(r);
    const images = importAll(
      require.context('../../images/state-flags', false, /\.(png|jpe?g|svg)$/),
    );
    return (
      <div>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment basic style={{ height: '6vh' }}>
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
                <Menu.Item
                  name="faq"
                  as={Link}
                  to="/faq"
                  color="teal"
                  active={activeItem === 'faq'}
                />
                <Menu.Item
                  name="about"
                  as={Link}
                  to="/about"
                  color="teal"
                  active={activeItem === 'about'}
                />
                {this.props.activeItem === 'statesShow' &&
                  this.props.states.activeStateId !== null && (
                    <Menu.Menu position="right">
                      <Menu.Item>
                        <Image
                          size="mini"
                          spaced
                          verticalAlign="bottom"
                          src={images.find(image =>
                            image.includes(
                              this.props.states.states
                                .find(state => state.id === this.props.states.activeStateId)
                                .attributes['short-name'].toLowerCase(),
                            ),
                          )}
                        />
                        <StateDropdown />
                      </Menu.Item>
                    </Menu.Menu>
                  )}
                {this.props.activeItem === 'national map' &&
                  this.props.offices.allOffices.result !== undefined && (
                    <Menu.Menu position="right">
                      <Menu.Item>
                        <OfficeDropdown />
                      </Menu.Item>
                    </Menu.Menu>
                  )}
              </Container>
            </Menu>
          </Segment>
        </Visibility>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeItem: state.nav.activePage,
  states: state.states,
  offices: state.offices,
});

export default connect(mapStateToProps)(DesktopNav);
