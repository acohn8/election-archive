import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Nav = () => (
  <Menu size="huge">
    <Menu.Item name="home" as={Link} to="/" />
    <Menu.Item name="National Map" as={Link} to="/national-map" />
    <Menu.Item name="States" as={Link} to="/states" />
    {/* <Menu.Item as="a">About</Menu.Item> */}
  </Menu>
);

export default Nav;
