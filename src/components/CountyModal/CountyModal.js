import React from 'react';
import { Button, Header, Icon, Modal, Table } from 'semantic-ui-react';
import CountyContainer from '../../containers/CountyContainer';

const CountyModal = ({ countyName, countyId }) => (
  <Modal
    size="large"
    dimmer="blurring"
    trigger={
      <Table.Cell selectable>
        <a href="#">{countyName}</a>
      </Table.Cell>
    }
  >
    <Modal.Header>{countyName}</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Header>Results</Header>
        <CountyContainer countyId={countyId} />
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button primary>
        Proceed <Icon name="right chevron" />
      </Button>
    </Modal.Actions>
  </Modal>
);

export default CountyModal;
