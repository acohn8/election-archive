import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { setActiveState, fetchStatesList } from '../redux/actions/stateActions';

class StateMenu extends Component {
  state = { activeItem: 'closest' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu text vertical>
        <Menu.Item header>Sort By</Menu.Item>
        {this.props.states.length > 0 &&
          this.props.states.map(state => (
            <Menu.Item
              name={state.attributes.name}
              as={Link}
              to={`/states/${state.id}`}
              key={state.id}
              active={activeItem === 'closest'}
              onClick={this.handleItemClick}
            />
          ))}
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
)(StateMenu);
