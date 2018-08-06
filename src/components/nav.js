import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <Menu size="huge">
        <Menu.Item name="home" as={Link} to="/" />
      </Menu>
    );
  }
}

export default Nav;
