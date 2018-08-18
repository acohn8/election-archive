import React from 'react';
import { Modal, Dropdown, List } from 'semantic-ui-react';
import { connect } from 'react-redux';

const MobileStateSelector = props => (
  <Modal dimmer="blurring" trigger={<Dropdown text={props.state} />} closeIcon>
    <Modal.Header>States</Modal.Header>
    <Modal.Content scrolling>
      <List selection verticalAlign="middle">
        {props.states.states.map(state => (
          <List.Item
            key={state.id}
            href={`/states/${state.attributes.name
              .split(' ')
              .join('-')
              .toLowerCase()}`}
          >
            <List.Icon name="right triangle" size="large" verticalAlign="middle" color="teal" />
            <List.Content>
              <List.Header>{state.attributes.name}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Modal.Content>
  </Modal>
);

const mapStateToProps = state => ({
  states: state.states,
});

export default connect(mapStateToProps)(MobileStateSelector);
