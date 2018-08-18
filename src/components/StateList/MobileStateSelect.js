import React from 'react';
import { Modal, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import StateListContainer from './StateListContainer';

const MobileStateSelector = ({ state }) => (
  <Modal dimmer="blurring" trigger={<Dropdown text={state} />} closeIcon>
    <Modal.Header>States</Modal.Header>
    <Modal.Content scrolling>
      <StateListContainer />
    </Modal.Content>
  </Modal>
);

const mapStateToProps = state => ({
  states: state.states,
});

export default connect(mapStateToProps)(MobileStateSelector);
