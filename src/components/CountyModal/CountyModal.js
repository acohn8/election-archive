import React from 'react';
import { Button, Header, Icon, Image, Modal, Table } from 'semantic-ui-react';
import CountyTableContainer from '../../containers/CountyTableContainer';

const CountyModal = ({ countyName, countyId }) => (
  <Modal
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
        <CountyTableContainer countyId={countyId} />
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
