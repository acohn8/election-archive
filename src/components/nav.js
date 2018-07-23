import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Menu } from 'semantic-ui-react';
import { setActiveState, fetchStatesList } from '../redux/actions/stateActions';

class Nav extends Component {
  state = { activeItem: 'home' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentDidMount() {
    this.props.fetchStatesList();
  }

  render() {
    const { activeItem } = this.state;

    return (
      <Menu size="huge">
        <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item name="about" active={activeItem === 'about'} onClick={this.handleItemClick} />
        <Menu.Menu position="right">
          <Dropdown item text="States">
            <Dropdown.Menu>
              {this.props.states.length > 0 &&
                this.props.states.map(state => (
                  <Dropdown.Item key={state.id} onClick={() => this.props.setActiveState(state.id)}>
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
