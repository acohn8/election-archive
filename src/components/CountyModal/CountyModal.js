import React from 'react';
import { Modal, Table } from 'semantic-ui-react';
import CountyContainer from '../../containers/CountyContainer';

const CountyModal = ({ countyName, countyId }) => (
  <Modal
    size="large"
    dimmer="blurring"
    trigger={
      <Table.Cell selectable style={{ cursor: 'pointer' }}>
        <div as="a">{countyName}</div>
      </Table.Cell>
    }
  >
    <Modal.Header>{countyName}</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <CountyContainer countyId={countyId} />
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default CountyModal;
