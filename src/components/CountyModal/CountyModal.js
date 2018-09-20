import React from 'react';
import { Modal, Table } from 'semantic-ui-react';
import CountyContainer from '../../containers/CountyContainer';

const CountyModal = ({ countyName, countyId, title }) => (
  <Modal
    size="large"
    dimmer="blurring"
    closeIcon
    trigger={
      <Table.Cell selectable style={{ cursor: 'pointer', paddingLeft: '10px' }}>
        <div as="a">{countyName}</div>
      </Table.Cell>
    }
  >
    <Modal.Header>{title}</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <CountyContainer countyId={countyId} />
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default CountyModal;
