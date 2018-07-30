import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { setActiveState, fetchStatesList } from '../redux/actions/stateActions';
import StateDropdown from './StateDropdown';

class Nav extends Component {
  componentDidMount() {
    this.props.fetchStatesList();
  }

  render() {
    return (
      <Menu size="huge">
        <Menu.Item name="home" as={Link} to="/" />
        <Menu.Item name="about" />
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  states: state.states.states,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: id => dispatch(setActiveState(id)),
  fetchStatesList: () => dispatch(fetchStatesList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Nav);
