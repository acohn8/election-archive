import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { setActiveState, fetchStatesList } from '../redux/actions/stateActions';

class Nav extends Component {
  componentDidMount() {
    this.props.fetchStatesList();
  }

  render() {
    return (
      <Menu size="huge">
        <Menu.Item name="home" as={Link} to="/" />
        <Menu.Item name="about" />
        <Menu.Menu position="right">
          <Dropdown item text="States">
            <Dropdown.Menu>
              {this.props.states.length > 0 &&
                this.props.states.map(state => (
                  <Dropdown.Item
                    as={Link}
                    to={`/states/${state.id}`}
                    key={state.id}
                    onClick={() => this.props.setActiveState(state.id)}
                  >
                    {state.attributes.name}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  states: state.states.states,
});

const mapDispatchToProps = dispatch => ({
  setActiveState: e => dispatch(setActiveState(e)),
  fetchStatesList: () => dispatch(fetchStatesList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Nav);
