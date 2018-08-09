import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Responsive, Visibility, Segment } from 'semantic-ui-react';

class DesktopNav extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { fixed } = this.state;
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
                <Menu.Item name="home" as={Link} to="/" />
                <Menu.Item name="national map" as={Link} to="/national-map" />
                <Menu.Item name="states" as={Link} to="/states" />
                {/* <Menu.Item as="a">About</Menu.Item> */}
              </Container>
            </Menu>
          </Segment>
        </Visibility>
        {this.props.children}
      </Responsive>
    );
  }
}

export default DesktopNav;
